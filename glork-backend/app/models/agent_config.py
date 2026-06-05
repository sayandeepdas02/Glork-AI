from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.doctor import Doctor

DEFAULT_WORKING_HOURS: dict = {
    "mon": {"start": "09:00", "end": "18:00", "enabled": True},
    "tue": {"start": "09:00", "end": "18:00", "enabled": True},
    "wed": {"start": "09:00", "end": "18:00", "enabled": True},
    "thu": {"start": "09:00", "end": "18:00", "enabled": True},
    "fri": {"start": "09:00", "end": "18:00", "enabled": True},
    "sat": {"start": "09:00", "end": "18:00", "enabled": True},
    "sun": {"start": "09:00", "end": "18:00", "enabled": False},
}


class AgentConfig(Base):
    __tablename__ = "agent_configs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    doctor_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("doctors.id", ondelete="CASCADE"), unique=True, nullable=False, index=True
    )
    retell_agent_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    retell_llm_id: Mapped[str | None] = mapped_column(String(100), nullable=True)
    glork_phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    greeting_message: Mapped[str] = mapped_column(
        Text,
        default="Hello, you've reached {clinic_name}. I'm an AI assistant. How can I help you today?",
        nullable=False,
    )
    working_hours: Mapped[dict] = mapped_column(JSON, nullable=False)
    slot_duration_mins: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    buffer_mins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    language: Mapped[str] = mapped_column(String(10), default="en", nullable=False)
    emergency_transfer_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    max_advance_booking_days: Mapped[int] = mapped_column(Integer, default=30, nullable=False)
    timezone: Mapped[str] = mapped_column(String(50), default="Asia/Kolkata", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    doctor: Mapped[Doctor] = relationship("Doctor", back_populates="agent_config")
