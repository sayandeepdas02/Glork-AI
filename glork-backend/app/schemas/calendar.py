from __future__ import annotations

from pydantic import BaseModel


class CalendarAuthUrlResponse(BaseModel):
    auth_url: str


class CalendarStatusResponse(BaseModel):
    is_connected: bool
    calendar_id: str | None = None
    calendar_name: str | None = None


class CalendarListItem(BaseModel):
    id: str
    name: str
    primary: bool


class CalendarSelectRequest(BaseModel):
    calendar_id: str


class CalendarSelectedResponse(BaseModel):
    calendar_id: str
    message: str
