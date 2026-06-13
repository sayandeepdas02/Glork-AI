"""add composite indexes for reminder schedule and booking conflict queries

Revision ID: 0003
Revises: 0002
Create Date: 2026-06-05 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002b"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Composite index for hourly reminder scheduler: WHERE status=confirmed AND reminder_sent=false AND appointment_start BETWEEN ...
    op.create_index(
        "ix_bookings_reminder_schedule",
        "bookings",
        ["status", "reminder_sent", "appointment_start"],
    )
    # Composite index for booking conflict detection: WHERE doctor_id=? AND status!=cancelled AND time overlaps
    op.create_index(
        "ix_bookings_doctor_status_time",
        "bookings",
        ["doctor_id", "status", "appointment_start", "appointment_end"],
    )


def downgrade() -> None:
    op.drop_index("ix_bookings_reminder_schedule", table_name="bookings")
    op.drop_index("ix_bookings_doctor_status_time", table_name="bookings")
