from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, Request, Response, status
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

_COOKIE_ACCESS = "glork-token"
_COOKIE_REFRESH = "glork-refresh"


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str) -> None:
    is_prod = settings.ENVIRONMENT == "production"
    base = dict(
        httponly=True,
        samesite="strict" if is_prod else "lax",
        secure=is_prod,
        path="/",
    )
    response.set_cookie(
        _COOKIE_ACCESS,
        access_token,
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        **base,
    )
    response.set_cookie(
        _COOKIE_REFRESH,
        refresh_token,
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        # Scope refresh cookie to auth routes only to limit exposure
        path="/api/v1/auth",
        httponly=True,
        samesite="strict" if is_prod else "lax",
        secure=is_prod,
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie(_COOKIE_ACCESS, path="/")
    response.delete_cookie(_COOKIE_REFRESH, path="/api/v1/auth")


@router.post("/register", response_model=TokenResponse, status_code=201)
@limiter.limit("5/minute")
async def register(
    request: Request,
    response: Response,
    body: RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await svc.register_doctor(body, db)
    _set_auth_cookies(response, result.access_token, result.refresh_token)
    return result


@router.post("/login", response_model=TokenResponse)
@limiter.limit("5/minute")
async def login(
    request: Request,
    response: Response,
    body: LoginRequest,
    db: AsyncSession = Depends(get_db),
):
    result = await svc.login_doctor(body.email, body.password, db)
    _set_auth_cookies(response, result.access_token, result.refresh_token)
    return result


@router.post("/refresh", response_model=TokenResponse)
@limiter.limit("20/minute")
async def refresh(
    request: Request,
    response: Response,
    body: RefreshRequest | None = None,
    db: AsyncSession = Depends(get_db),
):
    # Prefer httpOnly cookie; fall back to request body for backward compat
    token = request.cookies.get(_COOKIE_REFRESH)
    if not token and body:
        token = body.refresh_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token provided",
        )
    result = await svc.refresh_access_token(token, db)
    _set_auth_cookies(response, result.access_token, result.refresh_token)
    return result


@router.post("/logout", response_model=MessageResponse)
async def logout(response: Response):
    _clear_auth_cookies(response)
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
