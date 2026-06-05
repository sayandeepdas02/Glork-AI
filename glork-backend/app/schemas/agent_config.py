from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class WorkingHourDay(BaseModel):
    start: str
    end: str
    enabled: bool


class AgentConfigUpdate(BaseModel):
    working_hours: dict[str, WorkingHourDay] | None = None
    slot_duration_mins: int | None = None
    buffer_mins: int | None = None
    greeting_message: str | None = None
    language: str | None = None
    emergency_transfer_number: str | None = None
    max_advance_booking_days: int | None = None
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
