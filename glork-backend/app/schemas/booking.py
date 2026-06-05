from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.booking import BookingStatus
from app.schemas.validators import PersonName, PhoneNumber


class BookingCreate(BaseModel):
    patient_name: PersonName
    patient_phone: PhoneNumber
    patient_email: EmailStr | None = None
    appointment_start: datetime
    appointment_end: datetime
    reason: str | None = None
    notes: str | None = None


class BookingUpdate(BaseModel):
    status: BookingStatus | None = None
    appointment_start: datetime | None = None
    appointment_end: datetime | None = None
    notes: str | None = None


class BookingResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    doctor_id: UUID
    call_log_id: UUID | None = None
    patient_name: str
    patient_phone: str
    patient_email: str | None = None
    appointment_start: datetime
    appointment_end: datetime
    reason: str | None = None
    status: BookingStatus
    google_event_id: str | None = None
    sms_sent: bool
    reminder_sent: bool
    notes: str | None = None
    created_at: datetime
    updated_at: datetime | None = None


class BookingListResponse(BaseModel):
    items: list[BookingResponse]
    total: int
    page: int
    limit: int


class BookingStatsResponse(BaseModel):
    total_this_month: int
    confirmed_this_month: int
    cancelled_this_month: int
    no_show_this_month: int
    conversion_rate: float
