from __future__ import annotations

import uuid
from typing import AsyncGenerator

import structlog
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_token  # noqa: F401 — kept for when auth is restored
from app.db.session import AsyncSessionLocal
from app.models.doctor import Doctor

logger = structlog.get_logger()

bearer_scheme = HTTPBearer(auto_error=False)  # auto_error=False: missing token won't 401


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ─── AUTH BYPASS — TESTING MODE ──────────────────────────────────────────────
# Returns the first doctor row in the DB, or auto-creates a dev stub if empty.
# To restore real JWT auth: delete this function and uncomment the block below.
# ─────────────────────────────────────────────────────────────────────────────
async def get_current_doctor(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> Doctor:
    """AUTH BYPASS: returns the first doctor in DB for local testing."""
    result = await db.execute(select(Doctor).limit(1))
    doctor = result.scalar_one_or_none()

    if not doctor:
        from app.core.security import get_password_hash
        doctor = Doctor(
            id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
            email="dev@glork.local",
            password_hash=get_password_hash("devpassword"),
            name="Dev Doctor",
            clinic_name="Dev Clinic",
            is_active=True,
            is_agent_active=False,
        )
        db.add(doctor)
        await db.commit()
        await db.refresh(doctor)
        logger.info("dev_stub_doctor_created", doctor_id=str(doctor.id))

    logger.debug("auth_bypass_active", doctor_id=str(doctor.id))
    return doctor


# ─── Original JWT auth — uncomment + delete bypass above to restore ───────────
# async def get_current_doctor(
#     credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
#     db: AsyncSession = Depends(get_db),
# ) -> Doctor:
#     token = credentials.credentials
#     payload = decode_token(token)
#
#     token_type = payload.get("type")
#     if token_type != "access":
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token type",
#         )
#
#     doctor_id = payload.get("sub")
#     if not doctor_id:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Invalid token payload",
#         )
#
#     result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
#     doctor = result.scalar_one_or_none()
#
#     if not doctor:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Doctor not found",
#         )
#
#     if not doctor.is_active:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Account is inactive",
#         )
#
#     return doctor


async def get_current_active_doctor(
    doctor: Doctor = Depends(get_current_doctor),
) -> Doctor:
    if not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )
    return doctor
