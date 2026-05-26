from __future__ import annotations

import copy

import structlog
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.models.agent_config import AgentConfig, DEFAULT_WORKING_HOURS
from app.models.doctor import Doctor
from app.schemas.auth import RegisterRequest, TokenResponse

logger = structlog.get_logger()


def _build_token_response(doctor: Doctor) -> TokenResponse:
    data = {"sub": str(doctor.id)}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


async def register_doctor(request: RegisterRequest, db: AsyncSession) -> TokenResponse:
    result = await db.execute(select(Doctor).where(Doctor.email == request.email))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    doctor = Doctor(
        email=request.email,
        password_hash=hash_password(request.password),
        name=request.name,
        clinic_name=request.clinic_name,
        specialty=request.specialty,
    )
    db.add(doctor)
    await db.flush()

    agent_config = AgentConfig(
        doctor_id=doctor.id,
        working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS),
        greeting_message=f"Hello, you've reached {request.clinic_name}. I'm an AI assistant. How can I help you today?",
    )
    db.add(agent_config)
    await db.commit()
    await db.refresh(doctor)

    logger.info("doctor_registered", doctor_id=str(doctor.id), email=doctor.email)
    return _build_token_response(doctor)


async def login_doctor(email: str, password: str, db: AsyncSession) -> TokenResponse:
    result = await db.execute(select(Doctor).where(Doctor.email == email))
    doctor = result.scalar_one_or_none()

    if not doctor or not verify_password(password, doctor.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    logger.info("doctor_logged_in", doctor_id=str(doctor.id))
    return _build_token_response(doctor)


async def refresh_access_token(refresh_token: str, db: AsyncSession) -> TokenResponse:
    from app.core.security import decode_token

    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    doctor_id = payload.get("sub")
    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()

    if not doctor or not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Doctor not found or inactive",
        )

    return _build_token_response(doctor)
