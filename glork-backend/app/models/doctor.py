from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, DateTime, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base

if TYPE_CHECKING:
    from app.models.agent_config import AgentConfig
    from app.models.booking import Booking
    from app.models.calendar_integration import CalendarIntegration
    from app.models.call_log import CallLog


class Doctor(Base):
    __tablename__ = "doctors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str] = mapped_column(Text, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    clinic_name: Mapped[str] = mapped_column(String(200), nullable=False)
    phone_number: Mapped[str | None] = mapped_column(String(20), nullable=True)
    specialty: Mapped[str | None] = mapped_column(String(100), nullable=True)
    clinic_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_agent_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), onupdate=func.now(), nullable=True
    )

    agent_config: Mapped[AgentConfig | None] = relationship(
        "AgentConfig", back_populates="doctor", uselist=False, cascade="all, delete-orphan"
    )
    bookings: Mapped[list[Booking]] = relationship(
        "Booking", back_populates="doctor", cascade="all, delete-orphan"
    )
    call_logs: Mapped[list[CallLog]] = relationship(
        "CallLog", back_populates="doctor", cascade="all, delete-orphan"
    )
    calendar_integration: Mapped[CalendarIntegration | None] = relationship(
        "CalendarIntegration", back_populates="doctor", uselist=False, cascade="all, delete-orphan"
    )
