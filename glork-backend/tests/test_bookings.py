from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest
from httpx import AsyncClient

from app.models.doctor import Doctor


def future_slot(days_ahead: int = 1, hour: int = 10) -> dict:
    start = datetime.now(timezone.utc) + timedelta(days=days_ahead)
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
