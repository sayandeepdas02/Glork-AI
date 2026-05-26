from __future__ import annotations

from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel


class RetellCallMetadata(BaseModel):
    doctor_id: str | None = None


class RetellCallObject(BaseModel):
    call_id: str | None = None
    agent_id: str | None = None
    from_number: str | None = None
    to_number: str | None = None
    metadata: dict[str, Any] | None = None


class RetellCallAnalysis(BaseModel):
    call_successful: bool | None = None
    call_summary: str | None = None
    user_sentiment: str | None = None
    custom_analysis_data: dict[str, Any] | None = None


class RetellCallStartedEvent(BaseModel):
    event: str
    call: RetellCallObject


class RetellCallEndedEvent(BaseModel):
    event: str
    call: RetellCallObject
    duration_seconds: int | None = None
    transcript: str | None = None
    recording_url: str | None = None
    ended_at: datetime | None = None
    call_analysis: RetellCallAnalysis | None = None


class RetellCallAnalyzedEvent(BaseModel):
    event: str
    call: RetellCallObject
    call_analysis: RetellCallAnalysis | None = None


class RetellWebhookEvent(BaseModel):
    event: str
    call: RetellCallObject
    duration_seconds: int | None = None
    transcript: str | None = None
    recording_url: str | None = None
    ended_at: datetime | None = None
    call_analysis: RetellCallAnalysis | None = None


class RetellToolRequest(BaseModel):
    call: RetellCallObject
    args: dict[str, Any]
    name: str | None = None


class CheckAvailabilityRequest(BaseModel):
    doctor_id: str
    date: str
    preferred_time: str = "any"


class CheckAvailabilityResponse(BaseModel):
    slots: list[str]
    date: str
    doctor_timezone: str
    message: str | None = None


class CreateBookingRequest(BaseModel):
    doctor_id: str
    patient_name: str
    patient_phone: str
    slot_datetime: str
    reason: str | None = None


class CreateBookingResponse(BaseModel):
    booking_id: str
    confirmed: bool
    appointment_datetime: str
    message: str


class GetPatientBookingsRequest(BaseModel):
    doctor_id: str
    patient_phone: str


class SimpleBooking(BaseModel):
    id: str
    appointment_start: str
    appointment_end: str
    status: str
    reason: str | None = None


class GetPatientBookingsResponse(BaseModel):
    bookings: list[SimpleBooking]
    patient_name: str | None = None
