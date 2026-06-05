from __future__ import annotations

import copy
from datetime import datetime, timezone
from uuid import uuid4

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.call_log import CallLog, CallOutcome
from app.models.doctor import Doctor


async def _make_call(db: AsyncSession, doctor_id, outcome: CallOutcome, duration: int | None = None) -> CallLog:
    cl = CallLog(
        doctor_id=doctor_id,
        retell_call_id=f"call_{uuid4().hex}",
        caller_phone="+919999999999",
        outcome=outcome,
        duration_seconds=duration,
        started_at=datetime.now(timezone.utc),
    )
    db.add(cl)
    await db.flush()
    return cl


@pytest.mark.asyncio
async def test_call_list_pagination_first_page(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    for _ in range(5):
        await _make_call(db, doctor.id, CallOutcome.enquiry)
    await db.commit()

    resp = await async_client.get(
        "/api/v1/calls", headers=auth_headers, params={"page": 1, "limit": 3}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) <= 3
    assert data["page"] == 1
    assert data["limit"] == 3
    assert "total" in data


@pytest.mark.asyncio
async def test_call_list_pagination_respects_limit(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    for _ in range(10):
        await _make_call(db, doctor.id, CallOutcome.booked)
    await db.commit()

    resp = await async_client.get(
        "/api/v1/calls", headers=auth_headers, params={"page": 1, "limit": 5}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["items"]) <= 5


@pytest.mark.asyncio
async def test_call_stats_uses_aggregates(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    await _make_call(db, doctor.id, CallOutcome.booked, duration=120)
    await _make_call(db, doctor.id, CallOutcome.enquiry, duration=60)
    await _make_call(db, doctor.id, CallOutcome.failed, duration=None)
    await db.commit()

    resp = await async_client.get("/api/v1/calls/stats", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()

    assert data["total_calls"] >= 3
    assert data["total_duration_seconds"] >= 180
    assert data["avg_duration_seconds"] >= 0
    assert "calls_by_outcome" in data
    assert "booked" in data["calls_by_outcome"]
    assert "calls_this_week" in data


@pytest.mark.asyncio
async def test_call_stats_empty(
    async_client: AsyncClient,
    db: AsyncSession,
):
    from app.core.security import create_access_token, hash_password
    from app.models import AgentConfig
    from app.models.agent_config import DEFAULT_WORKING_HOURS

    doc = Doctor(
        email=f"stats_empty_{uuid4().hex[:8]}@test.com",
        password_hash=hash_password("testpass"),
        name="Dr. Empty",
        clinic_name="Empty Clinic",
    )
    db.add(doc)
    await db.flush()
    db.add(AgentConfig(doctor_id=doc.id, working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS)))
    await db.commit()

    token = create_access_token({"sub": str(doc.id)})
    headers = {"Authorization": f"Bearer {token}"}

    resp = await async_client.get("/api/v1/calls/stats", headers=headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["total_calls"] == 0
    assert data["total_duration_seconds"] == 0
    assert data["avg_duration_seconds"] == 0.0


@pytest.mark.asyncio
async def test_call_list_outcome_filter(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    await _make_call(db, doctor.id, CallOutcome.booked)
    await _make_call(db, doctor.id, CallOutcome.failed)
    await db.commit()

    resp = await async_client.get(
        "/api/v1/calls", headers=auth_headers, params={"outcome": "booked"}
    )
    assert resp.status_code == 200
    data = resp.json()
    assert all(item["outcome"] == "booked" for item in data["items"])
