from __future__ import annotations

import asyncio
import copy
from datetime import datetime, timezone

import httpx
import structlog
from fastapi import HTTPException, status
from google_auth_oauthlib.flow import Flow
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.security import (
    create_access_token,
    create_exchange_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.agent_config import AgentConfig, DEFAULT_WORKING_HOURS
from app.models.doctor import Doctor
from app.models.refresh_token import RevokedToken
from app.schemas.auth import RegisterRequest, TokenResponse

logger = structlog.get_logger()

_GOOGLE_SIGNIN_SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]


def _build_token_response(doctor: Doctor) -> TokenResponse:
    data = {"sub": str(doctor.id)}
    return TokenResponse(
        access_token=create_access_token(data),
        refresh_token=create_refresh_token(data),
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


def _build_google_signin_flow() -> Flow:
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": [settings.GOOGLE_AUTH_REDIRECT_URI],
        }
    }
    return Flow.from_client_config(
        client_config,
        scopes=_GOOGLE_SIGNIN_SCOPES,
        redirect_uri=settings.GOOGLE_AUTH_REDIRECT_URI,
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

    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not doctor.password_hash:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="This account uses Google sign-in. Please use the Sign in with Google button.",
        )

    if not verify_password(password, doctor.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    if not doctor.is_active:
        # Log internally but return the same generic 401 to prevent email enumeration
        logger.warning("inactive_account_login_attempt", doctor_id=str(doctor.id))
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    logger.info("doctor_logged_in", doctor_id=str(doctor.id))
    return _build_token_response(doctor)


async def refresh_access_token(refresh_token: str, db: AsyncSession) -> TokenResponse:
    payload = decode_token(refresh_token)

    if payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
        )

    jti = payload.get("jti")
    if not jti:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
        )

    result = await db.execute(select(RevokedToken).where(RevokedToken.jti == jti))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked",
        )

    doctor_id = payload.get("sub")
    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()

    if not doctor or not doctor.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Doctor not found or inactive",
        )

    # Rotate: revoke the consumed token so it cannot be replayed
    expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    db.add(RevokedToken(jti=jti, expires_at=expires_at))
    await db.commit()

    return _build_token_response(doctor)


async def revoke_refresh_token(refresh_token: str, db: AsyncSession) -> None:
    """Add the refresh token's jti to the denylist. Safe to call with an invalid token."""
    try:
        payload = decode_token(refresh_token)
    except HTTPException:
        return

    if payload.get("type") != "refresh":
        return

    jti = payload.get("jti")
    if not jti:
        return

    result = await db.execute(select(RevokedToken).where(RevokedToken.jti == jti))
    if result.scalar_one_or_none():
        return

    expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    db.add(RevokedToken(jti=jti, expires_at=expires_at))
    await db.commit()


async def get_google_signin_url() -> str:
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Google OAuth not configured",
        )

    state_token = create_access_token({"purpose": "google_signin"})
    flow = _build_google_signin_flow()
    auth_url, _ = flow.authorization_url(
        access_type="online",
        state=state_token,
    )
    return auth_url


async def handle_google_signin_callback(
    code: str,
    state: str,
    db: AsyncSession,
) -> tuple[Doctor, bool]:
    """Validate the Google OAuth callback and return the authenticated Doctor.

    Returns the Doctor ORM object (not a TokenResponse) so the caller can decide
    whether to issue an exchange code (callback endpoint) or tokens directly.
    """
    # Validate the state token
    try:
        payload = decode_token(state)
        if payload.get("purpose") != "google_signin":
            raise HTTPException(status_code=400, detail="Invalid state token")
    except HTTPException:
        raise HTTPException(status_code=400, detail="Invalid state token")

    # Exchange authorization code for Google tokens
    try:
        flow = _build_google_signin_flow()
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: flow.fetch_token(code=code))
        creds = flow.credentials
    except Exception as exc:
        logger.error("google_signin_token_exchange_failed", error=str(exc))
        raise HTTPException(status_code=400, detail="Failed to exchange Google authorization code")

    # Fetch user info from Google
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                "https://www.googleapis.com/oauth2/v1/userinfo",
                headers={"Authorization": f"Bearer {creds.token}"},
            )
            resp.raise_for_status()
            user_info = resp.json()
    except Exception as exc:
        logger.error("google_userinfo_fetch_failed", error=str(exc))
        raise HTTPException(status_code=400, detail="Failed to fetch Google user info")

    google_id = user_info.get("id")
    email = user_info.get("email")
    name = user_info.get("name") or ""
    verified_email = user_info.get("verified_email", False)

    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Google did not return required user info")

    if not verified_email:
        raise HTTPException(status_code=400, detail="Google account email is not verified")

    # Find existing account by google_id first, then by email
    result = await db.execute(select(Doctor).where(Doctor.google_id == google_id))
    doctor = result.scalar_one_or_none()
    is_new = False

    if not doctor:
        result = await db.execute(select(Doctor).where(Doctor.email == email))
        doctor = result.scalar_one_or_none()

        if doctor:
            # An account with this email already exists.
            # If it has a password hash it was created via email/password — block silent linking
            # to prevent account takeover. The user must prove ownership by logging in with
            # their password first, then linking Google from account settings.
            if doctor.password_hash:
                logger.warning(
                    "google_link_blocked_existing_password_account",
                    email=email,
                )
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "An account with this email already exists. "
                        "Please sign in with your email and password."
                    ),
                )
            # Account exists with Google ID missing (edge case); safe to link
            doctor.google_id = google_id
            try:
                await db.commit()
                await db.refresh(doctor)
                logger.info("google_account_linked", doctor_id=str(doctor.id))
            except Exception as exc:
                await db.rollback()
                logger.error("google_account_link_failed", error=str(exc))
                raise HTTPException(status_code=500, detail="Failed to link Google account")
        else:
            # Create new doctor via Google sign-in
            is_new = True
            display_name = name or email.split("@")[0]
            doctor = Doctor(
                email=email,
                password_hash=None,
                name=display_name,
                clinic_name=f"{display_name}'s Clinic",
                google_id=google_id,
            )
            db.add(doctor)
            await db.flush()

            agent_config = AgentConfig(
                doctor_id=doctor.id,
                working_hours=copy.deepcopy(DEFAULT_WORKING_HOURS),
                greeting_message="Hello, I'm an AI assistant. How can I help you today?",
            )
            db.add(agent_config)
            try:
                await db.commit()
                await db.refresh(doctor)
                logger.info("doctor_registered_google", doctor_id=str(doctor.id), email=email)
            except Exception as exc:
                await db.rollback()
                logger.error("google_doctor_creation_failed", error=str(exc))
                raise HTTPException(status_code=500, detail="Failed to create account")

    if not doctor.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    logger.info("doctor_logged_in_google", doctor_id=str(doctor.id))
    return doctor, is_new


def create_google_exchange_code(doctor: Doctor, is_new: bool) -> str:
    """Return a 60-second exchange JWT that the frontend trades for real auth tokens."""
    return create_exchange_token(str(doctor.id), is_new)


async def handle_google_exchange(exchange_code: str, db: AsyncSession) -> tuple[TokenResponse, bool]:
    """Validate a Google exchange code and issue real access + refresh tokens."""
    try:
        payload = decode_token(exchange_code)
        if payload.get("purpose") != "google_exchange":
            raise HTTPException(status_code=400, detail="Invalid exchange code")
    except HTTPException:
        raise HTTPException(status_code=400, detail="Invalid or expired exchange code")

    doctor_id = payload.get("sub")
    is_new: bool = bool(payload.get("is_new", False))

    result = await db.execute(select(Doctor).where(Doctor.id == doctor_id))
    doctor = result.scalar_one_or_none()

    if not doctor or not doctor.is_active:
        raise HTTPException(status_code=401, detail="Doctor not found or inactive")

    return _build_token_response(doctor), is_new
