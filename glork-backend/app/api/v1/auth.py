from __future__ import annotations

from fastapi import APIRouter, Depends, Query, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.limiter import limiter
from app.dependencies import get_db
from app.schemas.auth import (
    GoogleAuthUrlResponse,
    LoginRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.schemas.common import MessageResponse
from app.services import auth_service as svc

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
@limiter.limit("5/minute")
async def register(request: Request, body: RegisterRequest, db: AsyncSession = Depends(get_db)):
    return await svc.register_doctor(body, db)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("10/minute")
async def login(request: Request, body: LoginRequest, db: AsyncSession = Depends(get_db)):
    return await svc.login_doctor(body.email, body.password, db)


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
async def refresh(request: Request, body: RefreshRequest, db: AsyncSession = Depends(get_db)):
    return await svc.refresh_access_token(body.refresh_token, db)


@router.post("/logout", response_model=MessageResponse)
async def logout():
    return MessageResponse(message="Logged out successfully")


@router.get("/google", response_model=GoogleAuthUrlResponse)
@limiter.limit("10/minute")
async def google_auth(request: Request):
    auth_url = await svc.get_google_signin_url()
    return GoogleAuthUrlResponse(auth_url=auth_url)


@router.get("/google/callback")
async def google_callback(
    code: str = Query(None),
    state: str = Query(None),
    error: str = Query(None),
    db: AsyncSession = Depends(get_db),
):
    frontend_callback = f"{settings.FRONTEND_URL}/google-callback"

    if error:
        return RedirectResponse(f"{frontend_callback}?error={error}", status_code=302)

    if not code or not state:
        return RedirectResponse(f"{frontend_callback}?error=missing_params", status_code=302)

    try:
        token_response, is_new = await svc.handle_google_signin_callback(code, state, db)
    except Exception:
        return RedirectResponse(f"{frontend_callback}?error=signin_failed", status_code=302)

    is_new_str = "true" if is_new else "false"
    return RedirectResponse(
        f"{frontend_callback}"
        f"?access_token={token_response.access_token}"
        f"&refresh_token={token_response.refresh_token}"
        f"&is_new={is_new_str}",
        status_code=302,
    )
