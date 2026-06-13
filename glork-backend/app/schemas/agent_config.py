from __future__ import annotations

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.schemas.validators import BufferMins, MaxAdvanceBookingDays, PhoneNumber, SlotDurationMins

SupportedLanguage = Literal["en", "hi", "ta"]


class WorkingHourDay(BaseModel):
    start: str
    end: str
    enabled: bool

    @model_validator(mode="after")
    def end_after_start(self) -> "WorkingHourDay":
        if self.start >= self.end:
            raise ValueError(f"end ({self.end}) must be after start ({self.start})")
        return self


class AgentConfigUpdate(BaseModel):
    working_hours: dict[str, WorkingHourDay] | None = None
    slot_duration_mins: SlotDurationMins | None = None
    buffer_mins: BufferMins | None = None
    greeting_message: str | None = Field(None, max_length=500)
    language: SupportedLanguage | None = None
    emergency_transfer_number: PhoneNumber | None = None
    max_advance_booking_days: MaxAdvanceBookingDays | None = None
    timezone: str | None = None


class AgentConfigResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    doctor_id: UUID
    retell_agent_id: str | None = None
    glork_phone_number: str | None = None
    greeting_message: str
    working_hours: dict
    slot_duration_mins: int
    buffer_mins: int
    language: str
    emergency_transfer_number: str | None = None
    max_advance_booking_days: int
    timezone: str = "Asia/Kolkata"
    created_at: datetime
    updated_at: datetime | None = None
