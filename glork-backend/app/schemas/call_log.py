from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.models.call_log import CallOutcome


class CallLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    doctor_id: UUID
    retell_call_id: str | None = None
    caller_phone: str | None = None
    duration_seconds: int | None = None
    transcript: str | None = None
    outcome: CallOutcome
    recording_url: str | None = None
    agent_summary: str | None = None
    started_at: datetime | None = None
    ended_at: datetime | None = None
    created_at: datetime


class CallLogListResponse(BaseModel):
    items: list[CallLogResponse]
    total: int
    page: int
    limit: int


class CallStatsResponse(BaseModel):
    total_calls: int
    total_duration_seconds: int
    calls_by_outcome: dict[str, int]
    avg_duration_seconds: float
    calls_this_week: int
