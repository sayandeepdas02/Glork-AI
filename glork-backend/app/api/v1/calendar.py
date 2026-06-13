from __future__ import annotations

import asyncio
from datetime import datetime, timezone

import structlog
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from fastapi.responses import RedirectResponse
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert as pg_insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.encryption import decrypt, encrypt
from app.core.security import create_access_token, decode_token
from app.dependencies import get_current_active_doctor, get_db
from app.models.agent_config import AgentConfig
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
from app.services.retell_service import retell_service

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
async def get_auth_url(
    doctor: Doctor = Depends(get_current_active_doctor),
    return_to: str = Query("/onboarding"),
):
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth not configured",
        )

    flow = _build_flow()
    state_token = create_access_token({
        "sub": str(doctor.id),
        "purpose": "calendar_oauth",
        "return_to": return_to,
    })

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
        return_to = payload.get("return_to", "/onboarding")
    except HTTPException:
        return RedirectResponse(f"{settings.FRONTEND_URL}/onboarding?calendar=error&reason=invalid_state")

    # Safety: only allow relative paths as return_to to prevent open-redirect
    if not return_to.startswith("/"):
        return_to = "/onboarding"

    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()
    if not doctor:
        return RedirectResponse(f"{settings.FRONTEND_URL}{return_to}?calendar=error&reason=doctor_not_found")

    try:
        flow = _build_flow()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: flow.fetch_token(code=code))
        creds: Credentials = flow.credentials
    except Exception as exc:
        logger.error("calendar_oauth_exchange_failed", doctor_id=doctor_id, error=str(exc))
        return RedirectResponse(f"{settings.FRONTEND_URL}{return_to}?calendar=error&reason=token_exchange")

    access_token_encrypted = encrypt(creds.token)
    refresh_token_encrypted = encrypt(creds.refresh_token) if creds.refresh_token else None

    token_expiry = creds.expiry
    if token_expiry and token_expiry.tzinfo is None:
        token_expiry = token_expiry.replace(tzinfo=timezone.utc)

    # Atomic upsert — prevents duplicate-insert race on concurrent OAuth callbacks
    update_cols: dict = {
        "access_token_encrypted": access_token_encrypted,
        "token_expiry": token_expiry,
        "is_connected": True,
    }
    if refresh_token_encrypted is not None:
        update_cols["refresh_token_encrypted"] = refresh_token_encrypted

    stmt = (
        pg_insert(CalendarIntegration)
        .values(
            doctor_id=doctor_id,
            google_calendar_id="primary",
            access_token_encrypted=access_token_encrypted,
            refresh_token_encrypted=refresh_token_encrypted,
            token_expiry=token_expiry,
            is_connected=True,
        )
        .on_conflict_do_update(
            index_elements=["doctor_id"],
            set_=update_cols,
        )
    )

    try:
        await db.execute(stmt)
        await db.commit()
        logger.info("calendar_connected", doctor_id=str(doctor_id))
    except Exception as exc:
        await db.rollback()
        logger.error("calendar_save_failed", doctor_id=str(doctor_id), error=str(exc))
        return RedirectResponse(f"{settings.FRONTEND_URL}{return_to}?calendar=error&reason=save_failed")

    return RedirectResponse(f"{settings.FRONTEND_URL}{return_to}?calendar=connected")


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

    # Revoke the refresh token so Google terminates long-term access.
    # Revoking the refresh token also invalidates any outstanding access tokens.
    try:
        revoke_token = None
        if integration.refresh_token_encrypted:
            revoke_token = decrypt(integration.refresh_token_encrypted)
        elif integration.access_token_encrypted:
            revoke_token = decrypt(integration.access_token_encrypted)

        if revoke_token:
            import httpx
            async with httpx.AsyncClient() as client:
                await client.post(
                    "https://oauth2.googleapis.com/revoke",
                    params={"token": revoke_token},
                )
    except Exception as exc:
        logger.warning("calendar_revoke_failed", doctor_id=str(doctor.id), error=str(exc))

    # Unbind the Retell phone so it stops routing calls to the agent while the
    # calendar is disconnected (the agent cannot book without calendar access).
    if doctor.is_agent_active:
        config_result = await db.execute(
            select(AgentConfig).where(AgentConfig.doctor_id == doctor.id)
        )
        config = config_result.scalar_one_or_none()
        if config and config.glork_phone_number and settings.RETELL_API_KEY:
            try:
                await retell_service.update_phone_number(
                    config.glork_phone_number,
                    [],
                    nickname=f"Glork - {doctor.clinic_name}",
                )
            except Exception as exc:
                logger.warning(
                    "calendar_disconnect_retell_unbind_failed",
                    doctor_id=str(doctor.id),
                    error=str(exc),
                )

    await db.delete(integration)
    doctor.is_agent_active = False
    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error("calendar_disconnect_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to disconnect calendar")

    return MessageResponse(message="Calendar disconnected successfully")
