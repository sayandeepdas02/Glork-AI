from __future__ import annotations

from datetime import datetime, timedelta, timezone

import pytest
from httpx import AsyncClient
from jose import jwt

from app.config import settings


@pytest.mark.asyncio
async def test_register_success(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/auth/register",
        json={
            "email": "newdoc@test.com",
            "password": "strongpassword",
            "name": "Dr. New",
            "clinic_name": "New Clinic",
        },
    )
    assert resp.status_code == 201
    data = resp.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"


@pytest.mark.asyncio
async def test_register_duplicate_email(async_client: AsyncClient):
    payload = {
        "email": "dup@test.com",
        "password": "strongpassword",
        "name": "Dr. Dup",
        "clinic_name": "Dup Clinic",
    }
    await async_client.post("/api/v1/auth/register", json=payload)
    resp = await async_client.post("/api/v1/auth/register", json=payload)
    assert resp.status_code == 409


@pytest.mark.asyncio
async def test_register_weak_password(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/auth/register",
        json={
            "email": "weakpw@test.com",
            "password": "short",
            "name": "Dr. Weak",
            "clinic_name": "Weak Clinic",
        },
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_login_success(async_client: AsyncClient, doctor):
    resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": doctor.email, "password": "testpassword123"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "access_token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(async_client: AsyncClient, doctor):
    resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": doctor.email, "password": "wrongpassword"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "nobody@test.com", "password": "testpassword123"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_token(async_client: AsyncClient, doctor):
    login_resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": doctor.email, "password": "testpassword123"},
    )
    refresh_token = login_resp.json()["refresh_token"]

    resp = await async_client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": refresh_token},
    )
    assert resp.status_code == 200
    assert "access_token" in resp.json()


# ─── JWT Middleware / Auth Dependency Tests ──────────────────────────────────

@pytest.mark.asyncio
async def test_protected_route_without_token(async_client: AsyncClient):
    resp = await async_client.get("/api/v1/doctors/me")
    assert resp.status_code == 403  # HTTPBearer returns 403 when no credentials


@pytest.mark.asyncio
async def test_protected_route_with_invalid_token(async_client: AsyncClient):
    resp = await async_client.get(
        "/api/v1/doctors/me",
        headers={"Authorization": "Bearer this.is.not.a.valid.jwt"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_with_expired_token(async_client: AsyncClient, doctor):
    expired_payload = {
        "sub": str(doctor.id),
        "type": "access",
        "exp": datetime.now(timezone.utc) - timedelta(hours=1),
    }
    expired_token = jwt.encode(expired_payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    resp = await async_client.get(
        "/api/v1/doctors/me",
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_with_refresh_token_as_access(async_client: AsyncClient, doctor):
    from app.core.security import create_refresh_token

    refresh_token = create_refresh_token({"sub": str(doctor.id)})
    resp = await async_client.get(
        "/api/v1/doctors/me",
        headers={"Authorization": f"Bearer {refresh_token}"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_protected_route_with_valid_token(async_client: AsyncClient, doctor, auth_headers):
    resp = await async_client.get("/api/v1/doctors/me", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json()["email"] == doctor.email


@pytest.mark.asyncio
async def test_refresh_with_invalid_token_returns_401(async_client: AsyncClient):
    resp = await async_client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": "this.is.invalid"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_refresh_with_missing_token_returns_422(async_client: AsyncClient):
    resp = await async_client.post("/api/v1/auth/refresh", json={})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_refresh_with_access_token_rejected(async_client: AsyncClient, doctor):
    from app.core.security import create_access_token

    access_token = create_access_token({"sub": str(doctor.id)})
    resp = await async_client.post(
        "/api/v1/auth/refresh",
        json={"refresh_token": access_token},
    )
    assert resp.status_code == 401
