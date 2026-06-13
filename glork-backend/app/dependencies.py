from __future__ import annotations

from typing import AsyncGenerator
from uuid import UUID

import structlog
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token
from app.db.session import AsyncSessionLocal
from app.models.doctor import Doctor

logger = structlog.get_logger()

# auto_error=False so we can fall back to cookie without a 403
_bearer_scheme = HTTPBearer(auto_error=False)

_COOKIE_ACCESS = "glork-token"


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def get_current_doctor(
    request: Request,
    db: AsyncSession = Depends(get_db),
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> Doctor:
    # Prefer explicit Authorization: Bearer header; fall back to httpOnly cookie.
    # Bearer is an intentional signal from the client; a cookie may be stale from
    # a previous session and should never silently override a fresh bearer token.
    token: str | None = credentials.credentials if credentials else None
    if not token:
        token = request.cookies.get(_COOKIE_ACCESS)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_token(token)

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    doctor_id_str = payload.get("sub")
    if not doctor_id_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        doctor_id = UUID(doctor_id_str)
    except (ValueError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Doctor not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return doctor


async def get_current_active_doctor(
    doctor: Doctor = Depends(get_current_doctor),
) -> Doctor:
    if not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    return doctor
