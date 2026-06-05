from __future__ import annotations

import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, patch
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.config import settings
from app.models.doctor import Doctor


def make_webhook_payload(event: str, call_id: str, agent_id: str, **kwargs) -> dict:
    return {
        "event": event,
        "call": {
            "call_id": call_id,
            "agent_id": agent_id,
            "from_number": "+919999999999",
            "to_number": "+918888888888",
        },
        **kwargs,
    }


def sign_payload(body: bytes) -> str:
    secret = settings.RETELL_WEBHOOK_SECRET.encode()
    return hmac.HMAC(secret, body, hashlib.sha256).hexdigest()


@pytest.mark.asyncio
async def test_webhook_call_started(async_client: AsyncClient, doctor: Doctor):
    from app.models.agent_config import AgentConfig
    from sqlalchemy import select
    from tests.conftest import TestSessionLocal

    async with TestSessionLocal() as db:
        result = await db.execute(select(AgentConfig).where(AgentConfig.doctor_id == doctor.id))
        config = result.scalar_one_or_none()
        agent_id = f"agent_{uuid4().hex}"
        config.retell_agent_id = agent_id
        await db.commit()

    call_id = f"call_{uuid4().hex}"
    payload = make_webhook_payload("call_started", call_id, agent_id)
    body = json.dumps(payload).encode()
    sig = sign_payload(body)

    resp = await async_client.post(
        "/api/v1/retell/webhook",
        content=body,
        headers={"Content-Type": "application/json", "X-Retell-Signature": sig},
    )
    assert resp.status_code == 200
    assert resp.json()["received"] is True


@pytest.mark.asyncio
async def test_webhook_invalid_signature(async_client: AsyncClient):
    payload = {"event": "call_started", "call": {"call_id": "x", "agent_id": "y"}}
    body = json.dumps(payload).encode()

    resp = await async_client.post(
        "/api/v1/retell/webhook",
        content=body,
        headers={"Content-Type": "application/json", "X-Retell-Signature": "badsig"},
    )
    assert resp.status_code == 401


# ─── Webhook Signature Verification Tests ────────────────────────────────────

def test_verify_webhook_signature_rejects_when_no_secret():
    """When RETELL_WEBHOOK_SECRET is absent, all webhook requests must be rejected."""
    from app.services.retell_service import RetellService
    import app.services.retell_service as retell_svc_module

    svc = RetellService()
    payload = b'{"event": "call_started"}'

    with patch.object(retell_svc_module.settings, "RETELL_WEBHOOK_SECRET", ""):
        result = svc.verify_webhook_signature(payload, "anysig")

    assert result is False


def test_verify_webhook_signature_accepts_valid_signature():
    """A correctly signed payload must pass verification."""
    from app.services.retell_service import RetellService

    svc = RetellService()
    payload = b'{"event": "call_started"}'
    secret = settings.RETELL_WEBHOOK_SECRET.encode()
    sig = hmac.HMAC(secret, payload, hashlib.sha256).hexdigest()

    assert svc.verify_webhook_signature(payload, sig) is True


def test_verify_webhook_signature_rejects_tampered_payload():
    """A tampered payload must fail verification even with a valid original signature."""
    from app.services.retell_service import RetellService

    svc = RetellService()
    original = b'{"event": "call_started"}'
    secret = settings.RETELL_WEBHOOK_SECRET.encode()
    sig = hmac.HMAC(secret, original, hashlib.sha256).hexdigest()

    tampered = b'{"event": "call_ended"}'
    assert svc.verify_webhook_signature(tampered, sig) is False


@pytest.mark.asyncio
async def test_webhook_no_secret_configured_rejects_request(async_client: AsyncClient):
    """When RETELL_WEBHOOK_SECRET is not set, the endpoint must reject all webhook calls."""
    import app.services.retell_service as retell_svc_module

    payload = {"event": "call_started", "call": {"call_id": "x", "agent_id": "y"}}
    body = json.dumps(payload).encode()

    with patch.object(retell_svc_module.settings, "RETELL_WEBHOOK_SECRET", ""):
        resp = await async_client.post(
            "/api/v1/retell/webhook",
            content=body,
            headers={"Content-Type": "application/json", "X-Retell-Signature": "anysig"},
        )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_tool_check_availability_missing_args(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/retell/tools/check-availability",
        json={"call": {"metadata": {}}, "args": {}},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "result" in data
    assert "error" in data["result"]


@pytest.mark.asyncio
async def test_tool_check_availability_invalid_doctor(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/retell/tools/check-availability",
        json={
            "call": {"metadata": {"doctor_id": str(uuid4())}},
            "args": {"date": "2025-12-15", "preferred_time": "morning"},
        },
    )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert "error" in data


@pytest.mark.asyncio
async def test_tool_create_booking_missing_fields(async_client: AsyncClient, doctor: Doctor):
    resp = await async_client.post(
        "/api/v1/retell/tools/create-booking",
        json={
            "call": {"metadata": {"doctor_id": str(doctor.id)}},
            "args": {"patient_name": "Test"},
        },
    )
    assert resp.status_code == 200
    assert "error" in resp.json()["result"]


@pytest.mark.asyncio
async def test_tool_get_patient_bookings_no_bookings(async_client: AsyncClient, doctor: Doctor):
    resp = await async_client.post(
        "/api/v1/retell/tools/get-patient-bookings",
        json={
            "call": {"metadata": {"doctor_id": str(doctor.id)}},
            "args": {"patient_phone": "+910000000000"},
        },
    )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert data["bookings"] == []
    assert data["patient_name"] is None


@pytest.mark.asyncio
async def test_tool_cancel_booking_not_found(async_client: AsyncClient, doctor: Doctor):
    resp = await async_client.post(
        "/api/v1/retell/tools/cancel-booking",
        json={
            "call": {"metadata": {"doctor_id": str(doctor.id)}},
            "args": {"booking_id": str(uuid4())},
        },
    )
    assert resp.status_code == 200
    assert "error" in resp.json()["result"]


# ─── C-1: Authorization Bypass Tests ─────────────────────────────────────────

@pytest.mark.asyncio
async def test_cancel_booking_without_doctor_id_is_rejected(async_client: AsyncClient):
    """Cancellation without doctor_id in metadata must be rejected — no bypass allowed."""
    resp = await async_client.post(
        "/api/v1/retell/tools/cancel-booking",
        json={
            "call": {"metadata": {}},  # No doctor_id
            "args": {"booking_id": str(uuid4())},
        },
    )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert "error" in data
    assert "Authorization context missing" in data["error"] or "missing" in data["error"].lower()


@pytest.mark.asyncio
async def test_cancel_booking_doctor_id_from_args_is_rejected(async_client: AsyncClient, doctor: Doctor):
    """doctor_id supplied in AI args (not metadata) must NOT be used for authorization."""
    resp = await async_client.post(
        "/api/v1/retell/tools/cancel-booking",
        json={
            "call": {"metadata": {}},  # No doctor_id in trusted metadata
            "args": {
                "booking_id": str(uuid4()),
                "doctor_id": str(doctor.id),  # Attacker-controlled
            },
        },
    )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert "error" in data  # Must be rejected, not processed


@pytest.mark.asyncio
async def test_cancel_booking_cross_doctor_ownership_rejected(async_client: AsyncClient, db):
    """A doctor cannot cancel a booking that belongs to a different doctor."""
    import copy
    from app.models.agent_config import AgentConfig, DEFAULT_WORKING_HOURS
    from app.models.booking import Booking, BookingStatus
    from app.core.security import hash_password
    from datetime import datetime, timezone, timedelta

    # Create two doctors
    doctor_a = Doctor(
        email=f"docA_{uuid4().hex[:8]}@test.com",
        password_hash=hash_password("pw"),
        name="Dr. A",
        clinic_name="Clinic A",
    )
    doctor_b = Doctor(
        email=f"docB_{uuid4().hex[:8]}@test.com",
        password_hash=hash_password("pw"),
        name="Dr. B",
        clinic_name="Clinic B",
    )
    db.add_all([doctor_a, doctor_b])
    await db.flush()
    db.add(AgentConfig(doctor_id=doctor_a.id, working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS)))
    db.add(AgentConfig(doctor_id=doctor_b.id, working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS)))
    await db.flush()

    # Booking belongs to doctor_a
    now = datetime.now(timezone.utc)
    booking = Booking(
        doctor_id=doctor_a.id,
        patient_name="Test Patient",
        patient_phone="+910000000001",
        appointment_start=now + timedelta(hours=1),
        appointment_end=now + timedelta(hours=2),
        status=BookingStatus.confirmed,
    )
    db.add(booking)
    await db.commit()

    # doctor_b tries to cancel doctor_a's booking
    resp = await async_client.post(
        "/api/v1/retell/tools/cancel-booking",
        json={
            "call": {"metadata": {"doctor_id": str(doctor_b.id)}},
            "args": {"booking_id": str(booking.id)},
        },
    )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert "error" in data
    assert "does not belong" in data["error"].lower() or "error" in data


@pytest.mark.asyncio
async def test_cancel_booking_valid_ownership_succeeds(async_client: AsyncClient, db):
    """A doctor can cancel their own booking."""
    import copy
    from app.models.agent_config import AgentConfig, DEFAULT_WORKING_HOURS
    from app.models.booking import Booking, BookingStatus
    from app.core.security import hash_password
    from datetime import datetime, timezone, timedelta

    doctor = Doctor(
        email=f"own_{uuid4().hex[:8]}@test.com",
        password_hash=hash_password("pw"),
        name="Dr. Owner",
        clinic_name="Owner Clinic",
    )
    db.add(doctor)
    await db.flush()
    db.add(AgentConfig(doctor_id=doctor.id, working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS)))
    await db.flush()

    now = datetime.now(timezone.utc)
    booking = Booking(
        doctor_id=doctor.id,
        patient_name="Patient",
        patient_phone="+910000000002",
        appointment_start=now + timedelta(hours=1),
        appointment_end=now + timedelta(hours=2),
        status=BookingStatus.confirmed,
    )
    db.add(booking)
    await db.commit()

    with patch("app.services.calendar_service.calendar_service.delete_event", return_value=None):
        resp = await async_client.post(
            "/api/v1/retell/tools/cancel-booking",
            json={
                "call": {"metadata": {"doctor_id": str(doctor.id)}},
                "args": {"booking_id": str(booking.id)},
            },
        )
    assert resp.status_code == 200
    data = resp.json()["result"]
    assert data.get("success") is True


# ─── H-5: Signature Validation on Tool Endpoints ─────────────────────────────

@pytest.mark.asyncio
async def test_tool_endpoints_reject_invalid_signature(async_client: AsyncClient):
    """All tool endpoints must reject requests with invalid Retell signatures."""
    endpoints = [
        "/api/v1/retell/tools/check-availability",
        "/api/v1/retell/tools/create-booking",
        "/api/v1/retell/tools/get-patient-bookings",
        "/api/v1/retell/tools/cancel-booking",
    ]
    for endpoint in endpoints:
        resp = await async_client.post(
            endpoint,
            json={"call": {"metadata": {}}, "args": {}},
            headers={"X-Retell-Signature": "invalidsignature"},
        )
        assert resp.status_code == 401, f"{endpoint} did not reject invalid signature"
