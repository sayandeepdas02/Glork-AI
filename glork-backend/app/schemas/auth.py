from __future__ import annotations

from pydantic import BaseModel, EmailStr, field_validator

from app.schemas.validators import ClinicName, PersonName


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: PersonName
    clinic_name: ClinicName
    specialty: str | None = None

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    refresh_token: str | None = None


class GoogleAuthUrlResponse(BaseModel):
    auth_url: str


class GoogleExchangeRequest(BaseModel):
    exchange_code: str
