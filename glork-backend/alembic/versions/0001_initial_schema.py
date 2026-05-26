"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "doctors",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.Text(), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("clinic_name", sa.String(200), nullable=False),
        sa.Column("phone_number", sa.String(20), nullable=True),
        sa.Column("specialty", sa.String(100), nullable=True),
        sa.Column("clinic_address", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("is_agent_active", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_doctors_email", "doctors", ["email"], unique=True)

    op.create_table(
        "agent_configs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("doctor_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("retell_agent_id", sa.String(100), nullable=True),
        sa.Column("retell_llm_id", sa.String(100), nullable=True),
        sa.Column("glork_phone_number", sa.String(20), nullable=True),
        sa.Column("greeting_message", sa.Text(), nullable=False),
        sa.Column("working_hours", sa.JSON(), nullable=False),
        sa.Column("slot_duration_mins", sa.Integer(), nullable=False, server_default=sa.text("30")),
        sa.Column("buffer_mins", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("language", sa.String(10), nullable=False, server_default=sa.text("'en'")),
        sa.Column("emergency_transfer_number", sa.String(20), nullable=True),
        sa.Column("max_advance_booking_days", sa.Integer(), nullable=False, server_default=sa.text("30")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["doctor_id"], ["doctors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("doctor_id"),
    )
    op.create_index("ix_agent_configs_doctor_id", "agent_configs", ["doctor_id"])

    op.create_table(
        "calendar_integrations",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("doctor_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("google_calendar_id", sa.Text(), nullable=False, server_default=sa.text("'primary'")),
        sa.Column("access_token_encrypted", sa.Text(), nullable=True),
        sa.Column("refresh_token_encrypted", sa.Text(), nullable=True),
        sa.Column("token_expiry", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_connected", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["doctor_id"], ["doctors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("doctor_id"),
    )
    op.create_index("ix_calendar_integrations_doctor_id", "calendar_integrations", ["doctor_id"])

    booking_status_enum = postgresql.ENUM(
        "confirmed", "cancelled", "rescheduled", "completed", "no_show",
        name="bookingstatus",
    )
    booking_status_enum.create(op.get_bind())

    call_outcome_enum = postgresql.ENUM(
        "booked", "enquiry", "cancelled", "rescheduled", "transferred", "failed", "unanswered",
        name="calloutcome",
    )
    call_outcome_enum.create(op.get_bind())

    op.create_table(
        "call_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("doctor_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("retell_call_id", sa.String(100), nullable=True),
        sa.Column("caller_phone", sa.String(20), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("transcript", sa.Text(), nullable=True),
        sa.Column("outcome", sa.Enum("booked", "enquiry", "cancelled", "rescheduled", "transferred", "failed", "unanswered", name="calloutcome"), nullable=False, server_default=sa.text("'failed'")),
        sa.Column("recording_url", sa.Text(), nullable=True),
        sa.Column("agent_summary", sa.Text(), nullable=True),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("ended_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["doctor_id"], ["doctors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_call_logs_doctor_id", "call_logs", ["doctor_id"])
    op.create_index("ix_call_logs_retell_call_id", "call_logs", ["retell_call_id"], unique=True)

    op.create_table(
        "bookings",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("doctor_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("call_log_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("patient_name", sa.String(200), nullable=False),
        sa.Column("patient_phone", sa.String(20), nullable=False),
        sa.Column("patient_email", sa.String(255), nullable=True),
        sa.Column("appointment_start", sa.DateTime(timezone=True), nullable=False),
        sa.Column("appointment_end", sa.DateTime(timezone=True), nullable=False),
        sa.Column("reason", sa.Text(), nullable=True),
        sa.Column("status", sa.Enum("confirmed", "cancelled", "rescheduled", "completed", "no_show", name="bookingstatus"), nullable=False, server_default=sa.text("'confirmed'")),
        sa.Column("google_event_id", sa.Text(), nullable=True),
        sa.Column("sms_sent", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("reminder_sent", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["call_log_id"], ["call_logs.id"], ondelete="SET NULL"),
        sa.ForeignKeyConstraint(["doctor_id"], ["doctors.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_bookings_doctor_id", "bookings", ["doctor_id"])
    op.create_index("ix_bookings_doctor_start", "bookings", ["doctor_id", "appointment_start"])
    op.create_index("ix_bookings_patient_phone", "bookings", ["patient_phone"])
    op.create_index("ix_bookings_appointment_start", "bookings", ["appointment_start"])


def downgrade() -> None:
    op.drop_table("bookings")
    op.drop_table("call_logs")
    op.drop_table("calendar_integrations")
    op.drop_table("agent_configs")
    op.drop_table("doctors")

    sa.Enum(name="bookingstatus").drop(op.get_bind())
    sa.Enum(name="calloutcome").drop(op.get_bind())
