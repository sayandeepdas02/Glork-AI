from __future__ import annotations

from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo
from uuid import uuid4

import pytest
from httpx import AsyncClient
from fastapi import HTTPException
from sqlalchemy import select

from app.models.booking import Booking, BookingStatus
from app.models.calendar_integration import CalendarIntegration
from app.models.doctor import Doctor


def future_slot(days_ahead: int = 1, hour: int = 10, tz_name: str = "Asia/Kolkata") -> dict:
    tz = ZoneInfo(tz_name)
    start = datetime.now(tz) + timedelta(days=days_ahead)
    start = start.replace(hour=hour, minute=0, second=0, microsecond=0)
    end = start + timedelta(minutes=30)
    return {
        "appointment_start": start.isoformat(),
        "appointment_end": end.isoformat(),
    }


@pytest.mark.asyncio
async def test_create_booking(async_client: AsyncClient, auth_headers: dict, doctor: Doctor):
    slot = future_slot()
    resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "John Doe",
            "patient_phone": "+919876543210",
            "patient_email": "john@example.com",
            "reason": "Fever",
            **slot,
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert data["patient_name"] == "John Doe"
    assert data["status"] == "confirmed"


@pytest.mark.asyncio
async def test_list_bookings(async_client: AsyncClient, auth_headers: dict):
    resp = await async_client.get("/api/v1/bookings", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data


@pytest.mark.asyncio
async def test_get_booking_detail(async_client: AsyncClient, auth_headers: dict, doctor: Doctor):
    slot = future_slot(days_ahead=2)
    create_resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Jane Doe",
            "patient_phone": "+919876543211",
            **slot,
        },
    )
    booking_id = create_resp.json()["id"]

    resp = await async_client.get(f"/api/v1/bookings/{booking_id}", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["id"] == booking_id


@pytest.mark.asyncio
async def test_cancel_booking(async_client: AsyncClient, auth_headers: dict):
    slot = future_slot(days_ahead=3)
    create_resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Cancel Me",
            "patient_phone": "+919876543212",
            **slot,
        },
    )
    booking_id = create_resp.json()["id"]

    resp = await async_client.patch(
        f"/api/v1/bookings/{booking_id}",
        headers=auth_headers,
        json={"status": "cancelled"},
    )
    assert resp.status_code == 200
    assert resp.json()["status"] == "cancelled"


@pytest.mark.asyncio
async def test_booking_not_found(async_client: AsyncClient, auth_headers: dict):
    resp = await async_client.get(f"/api/v1/bookings/{uuid4()}", headers=auth_headers)
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_booking_stats(async_client: AsyncClient, auth_headers: dict):
    resp = await async_client.get("/api/v1/bookings/stats", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "total_this_month" in data
    assert "conversion_rate" in data


@pytest.mark.asyncio
async def test_booking_requires_auth(async_client: AsyncClient):
    resp = await async_client.get("/api/v1/bookings")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_invalid_date_filter_returns_422(async_client: AsyncClient, auth_headers: dict):
    resp = await async_client.get(
        "/api/v1/bookings", headers=auth_headers, params={"date": "not-a-date"}
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_date_filter_wrong_format_returns_422(async_client: AsyncClient, auth_headers: dict):
    resp = await async_client.get(
        "/api/v1/bookings", headers=auth_headers, params={"date": "06-05-2025"}
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_booking_create_with_conflict(async_client: AsyncClient, auth_headers: dict):
    slot = future_slot(days_ahead=5, hour=14)
    payload = {
        "patient_name": "Conflict Test",
        "patient_phone": "+919876543299",
        **slot,
    }
    resp1 = await async_client.post("/api/v1/bookings", headers=auth_headers, json=payload)
    assert resp1.status_code == 201

    resp2 = await async_client.post("/api/v1/bookings", headers=auth_headers, json=payload)
    assert resp2.status_code == 409


@pytest.mark.asyncio
async def test_create_booking_rejects_invalid_time_range(
    async_client: AsyncClient, auth_headers: dict
):
    slot = future_slot(days_ahead=2, hour=11)
    resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Range Test",
            "patient_phone": "+919876543250",
            "appointment_start": slot["appointment_end"],
            "appointment_end": slot["appointment_start"],
        },
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_create_booking_rejects_outside_working_hours(
    async_client: AsyncClient, auth_headers: dict
):
    slot = future_slot(days_ahead=2, hour=7)
    resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Early Bird",
            "patient_phone": "+919876543251",
            **slot,
        },
    )
    assert resp.status_code == 422
    assert "working hours" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_create_booking_rejects_beyond_max_advance_window(
    async_client: AsyncClient, auth_headers: dict
):
    slot = future_slot(days_ahead=45, hour=10)
    resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Far Future",
            "patient_phone": "+919876543252",
            **slot,
        },
    )
    assert resp.status_code == 422
    assert "days in advance" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_create_booking_rolls_back_when_calendar_sync_fails(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db,
    monkeypatch: pytest.MonkeyPatch,
):
    db.add(
        CalendarIntegration(
            doctor_id=doctor.id,
            google_calendar_id="primary",
            is_connected=True,
        )
    )
    await db.commit()

    async def fail_create_event(*args, **kwargs):
        raise HTTPException(status_code=502, detail="Failed to create Google Calendar event")

    monkeypatch.setattr(
        "app.services.calendar_service.calendar_service.create_event",
        fail_create_event,
    )

    resp = await async_client.post(
        "/api/v1/bookings",
        headers=auth_headers,
        json={
            "patient_name": "Calendar Fail",
            "patient_phone": "+919876543253",
            **future_slot(days_ahead=4, hour=12),
        },
    )

    assert resp.status_code == 502

    result = await db.execute(
        select(Booking).where(Booking.patient_phone == "+919876543253")
    )
    assert result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_cancel_booking_keeps_state_when_calendar_delete_fails(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db,
    monkeypatch: pytest.MonkeyPatch,
):
    db.add(
        CalendarIntegration(
            doctor_id=doctor.id,
            google_calendar_id="primary",
            is_connected=True,
        )
    )
    booking = Booking(
        doctor_id=doctor.id,
        patient_name="Keep Me",
        patient_phone="+919876543254",
        appointment_start=datetime.now(timezone.utc) + timedelta(days=2),
        appointment_end=datetime.now(timezone.utc) + timedelta(days=2, minutes=30),
        status=BookingStatus.confirmed,
        google_event_id="existing-google-event",
    )
    db.add(booking)
    await db.commit()

    async def fail_delete_event(*args, **kwargs):
        raise HTTPException(status_code=502, detail="Failed to delete Google Calendar event")

    monkeypatch.setattr(
        "app.services.calendar_service.calendar_service.delete_event",
        fail_delete_event,
    )

    resp = await async_client.patch(
        f"/api/v1/bookings/{booking.id}",
        headers=auth_headers,
        json={"status": "cancelled"},
    )

    assert resp.status_code == 502

    await db.refresh(booking)
    assert booking.status == BookingStatus.confirmed


@pytest.mark.asyncio
async def test_booking_pagination_second_page(async_client: AsyncClient, auth_headers: dict):
    for i in range(6):
        slot = future_slot(days_ahead=10 + i, hour=10)
        await async_client.post(
            "/api/v1/bookings",
            headers=auth_headers,
            json={"patient_name": f"Patient {i}", "patient_phone": f"+9198765432{i:02d}", **slot},
        )

    resp = await async_client.get(
        "/api/v1/bookings", headers=auth_headers, params={"page": 1, "limit": 3}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) <= 3
    assert data["total"] >= 6
