from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.call_log import CallLog
    from app.models.doctor import Doctor


class BookingStatus(str, enum.Enum):
    confirmed = "confirmed"
    cancelled = "cancelled"
    rescheduled = "rescheduled"
    completed = "completed"
    no_show = "no_show"


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = (
        Index("ix_bookings_doctor_start", "doctor_id", "appointment_start"),
        Index("ix_bookings_patient_phone", "patient_phone"),
    )

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    doctor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True
    )
    call_log_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("call_logs.id", ondelete="SET NULL"), nullable=True
    )
    patient_name: Mapped[str] = mapped_column(String(200), nullable=False)
    patient_phone: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    patient_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    appointment_start: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, index=True
    )
    appointment_end: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    reason: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[BookingStatus] = mapped_column(
        Enum(BookingStatus), default=BookingStatus.confirmed, nullable=False
    )
    google_event_id: Mapped[str | None] = mapped_column(Text, nullable=True)
    sms_sent: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    reminder_sent: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    doctor: Mapped[Doctor] = relationship("Doctor", back_populates="bookings")
    call_log: Mapped[CallLog | None] = relationship("CallLog", back_populates="bookings")
