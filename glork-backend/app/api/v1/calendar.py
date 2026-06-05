from __future__ import annotations

import asyncio
from datetime import datetime, timezone

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.encryption import decrypt, encrypt
from app.core.security import create_access_token, decode_token
from app.dependencies import get_current_active_doctor, get_db
from app.models.calendar_integration import CalendarIntegration
from app.models.doctor import Doctor
from app.schemas.calendar import (
    CalendarAuthUrlResponse,
    CalendarListItem,
    CalendarSelectRequest,
    CalendarSelectedResponse,
    CalendarStatusResponse,
)
from app.schemas.common import MessageResponse
from app.services.calendar_service import calendar_service

logger = structlog.get_logger()

router = APIRouter(prefix="/calendar", tags=["calendar"])

SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
]


def _build_flow() -> Flow:
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [settings.GOOGLE_REDIRECT_URI],
        }
    }
    return Flow.from_client_config(
        client_config,
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI,
    )


@router.get("/auth-url", response_model=CalendarAuthUrlResponse)
async def get_auth_url(doctor: Doctor = Depends(get_current_active_doctor)):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth not configured",
        )

    flow = _build_flow()
    state_token = create_access_token({"sub": str(doctor.id), "purpose": "calendar_oauth"})

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        include_granted_scopes="true",
        prompt="consent",
        state=state_token,
    )
    return CalendarAuthUrlResponse(auth_url=auth_url)


@router.get("/callback")
async def calendar_callback(
    code: str = Query(...),
    state: str = Query(...),
    db: AsyncSession = Depends(get_db),
):
    try:
        payload = decode_token(state)
        if payload.get("purpose") != "calendar_oauth":
            raise HTTPException(status_code=400, detail="Invalid state token")
        doctor_id = payload.get("sub")
    except HTTPException:
        return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=error&reason=invalid_state")

    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()
    if not doctor:
        return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=error&reason=doctor_not_found")

    try:
        flow = _build_flow()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: flow.fetch_token(code=code))
        creds: Credentials = flow.credentials
    except Exception as exc:
        logger.error("calendar_oauth_exchange_failed", doctor_id=doctor_id, error=str(exc))
        return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=error&reason=token_exchange")

    access_token_encrypted = encrypt(creds.token)
    refresh_token_encrypted = encrypt(creds.refresh_token) if creds.refresh_token else None

    token_expiry = creds.expiry
    if token_expiry and token_expiry.tzinfo is None:
        token_expiry = token_expiry.replace(tzinfo=timezone.utc)

    existing_result = await db.execute(
        select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor_id)
    )
    integration = existing_result.scalar_one_or_none()

    if integration:
        integration.access_token_encrypted = access_token_encrypted
        if refresh_token_encrypted:
            integration.refresh_token_encrypted = refresh_token_encrypted
        integration.token_expiry = token_expiry
        integration.is_connected = True
    else:
        integration = CalendarIntegration(
            doctor_id=doctor_id,
            google_calendar_id="primary",
            access_token_encrypted=access_token_encrypted,
            refresh_token_encrypted=refresh_token_encrypted,
            token_expiry=token_expiry,
            is_connected=True,
        )
        db.add(integration)

    try:
        await db.commit()
        logger.info("calendar_connected", doctor_id=str(doctor_id))
    except Exception as exc:
        await db.rollback()
        logger.error("calendar_save_failed", doctor_id=str(doctor_id), error=str(exc))
        return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=error&reason=save_failed")

    return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=connected")


@router.get("/status", response_model=CalendarStatusResponse)
async def get_calendar_status(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor.id)
    )
    integration = result.scalar_one_or_none()

    if not integration or not integration.is_connected:
        return CalendarStatusResponse(is_connected=False)

    calendar_name = await calendar_service.get_calendar_name(
        doctor.id, integration.google_calendar_id or "primary", db
    )
    return CalendarStatusResponse(
        is_connected=True,
        calendar_id=integration.google_calendar_id,
        calendar_name=calendar_name,
    )


@router.get("/list", response_model=list[CalendarListItem])
async def list_calendars(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    calendars = await calendar_service.list_calendars(doctor.id, db)
    return [CalendarListItem(**c) for c in calendars]


@router.patch("/select", response_model=CalendarSelectedResponse)
async def select_calendar(
    payload: CalendarSelectRequest,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor.id)
    )
    integration = result.scalar_one_or_none()
    if not integration or not integration.is_connected:
        raise HTTPException(status_code=400, detail="Calendar not connected")

    integration.google_calendar_id = payload.calendar_id
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error("calendar_select_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to update calendar selection")

    return CalendarSelectedResponse(calendar_id=payload.calendar_id, message="Calendar updated successfully")


@router.delete("", response_model=MessageResponse)
async def disconnect_calendar(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor.id)
    )
    integration = result.scalar_one_or_none()
    if not integration:
        raise HTTPException(status_code=404, detail="No calendar integration found")

    try:
        if integration.access_token_encrypted:
            token = decrypt(integration.access_token_encrypted)
            import httpx
            async with httpx.AsyncClient() as client:
                await client.post(
                    "https://oauth2.googleapis.com/revoke",
                    params={"token": token},
                )
    except Exception as exc:
        logger.warning("calendar_revoke_failed", doctor_id=str(doctor.id), error=str(exc))

    await db.delete(integration)
    doctor.is_agent_active = False
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error("calendar_disconnect_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to disconnect calendar")

    return MessageResponse(message="Calendar disconnected successfully")
