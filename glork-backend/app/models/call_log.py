from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.booking import Booking
    from app.models.doctor import Doctor


class CallOutcome(str, enum.Enum):
    booked = "booked"
    enquiry = "enquiry"
    cancelled = "cancelled"
    rescheduled = "rescheduled"
    transferred = "transferred"
    failed = "failed"
    unanswered = "unanswered"


class CallLog(Base):
    __tablename__ = "call_logs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    doctor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    retell_call_id: Mapped[str | None] = mapped_column(String(100), unique=True, nullable=True, index=True)
    caller_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)
    transcript: Mapped[str | None] = mapped_column(Text, nullable=True)
    outcome: Mapped[CallOutcome] = mapped_column(
        Enum(CallOutcome), default=CallOutcome.failed, nullable=False
    )
    recording_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    agent_summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    doctor: Mapped[Doctor] = relationship("Doctor", back_populates="call_logs")
    bookings: Mapped[list[Booking]] = relationship("Booking", back_populates="call_log")
