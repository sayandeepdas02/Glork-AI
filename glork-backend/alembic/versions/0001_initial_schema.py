"""initial schema

Revision ID: 0001
Revises:
Create Date: 2024-01-01 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

    op.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email           VARCHAR(255) NOT NULL UNIQUE,
            password_hash   TEXT NOT NULL,
            name            VARCHAR(200) NOT NULL,
            clinic_name     VARCHAR(200) NOT NULL,
            phone_number    VARCHAR(20),
            specialty       VARCHAR(100),
            clinic_address  TEXT,
            is_active       BOOLEAN NOT NULL DEFAULT TRUE,
            is_agent_active BOOLEAN NOT NULL DEFAULT FALSE,
            created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at      TIMESTAMPTZ
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_doctors_email ON doctors (email)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS agent_configs (
            id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            doctor_id                 UUID NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
            retell_agent_id           VARCHAR(100),
            retell_llm_id             VARCHAR(100),
            glork_phone_number        VARCHAR(20),
            greeting_message          TEXT NOT NULL,
            working_hours             JSONB NOT NULL,
            slot_duration_mins        INTEGER NOT NULL DEFAULT 30,
            buffer_mins               INTEGER NOT NULL DEFAULT 0,
            language                  VARCHAR(10) NOT NULL DEFAULT 'en',
            emergency_transfer_number VARCHAR(20),
            max_advance_booking_days  INTEGER NOT NULL DEFAULT 30,
            created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at                TIMESTAMPTZ
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_agent_configs_doctor_id ON agent_configs (doctor_id)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS calendar_integrations (
            id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            doctor_id               UUID NOT NULL UNIQUE REFERENCES doctors(id) ON DELETE CASCADE,
            google_calendar_id      TEXT NOT NULL DEFAULT 'primary',
            access_token_encrypted  TEXT,
            refresh_token_encrypted TEXT,
            token_expiry            TIMESTAMPTZ,
            is_connected            BOOLEAN NOT NULL DEFAULT FALSE,
            calendar_name           TEXT,
            created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at              TIMESTAMPTZ
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_calendar_integrations_doctor_id ON calendar_integrations (doctor_id)")

    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'calloutcome') THEN
                CREATE TYPE calloutcome AS ENUM (
                    'booked', 'enquiry', 'cancelled', 'rescheduled',
                    'transferred', 'failed', 'unanswered'
                );
            END IF;
        END $$
    """)

    op.execute("""
        DO $$ BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'bookingstatus') THEN
                CREATE TYPE bookingstatus AS ENUM (
                    'confirmed', 'cancelled', 'rescheduled', 'completed', 'no_show'
                );
            END IF;
        END $$
    """)

    op.execute("""
        CREATE TABLE IF NOT EXISTS call_logs (
            id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            doctor_id        UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
            retell_call_id   VARCHAR(100) UNIQUE,
            caller_phone     VARCHAR(20),
            duration_seconds INTEGER,
            transcript       TEXT,
            outcome          calloutcome NOT NULL DEFAULT 'failed',
            recording_url    TEXT,
            agent_summary    TEXT,
            started_at       TIMESTAMPTZ,
            ended_at         TIMESTAMPTZ,
            created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_call_logs_doctor_id ON call_logs (doctor_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_call_logs_retell_call_id ON call_logs (retell_call_id)")

    op.execute("""
        CREATE TABLE IF NOT EXISTS bookings (
            id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            doctor_id         UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
            call_log_id       UUID REFERENCES call_logs(id) ON DELETE SET NULL,
            patient_name      VARCHAR(200) NOT NULL,
            patient_phone     VARCHAR(20) NOT NULL,
            patient_email     VARCHAR(255),
            appointment_start TIMESTAMPTZ NOT NULL,
            appointment_end   TIMESTAMPTZ NOT NULL,
            reason            TEXT,
            status            bookingstatus NOT NULL DEFAULT 'confirmed',
            google_event_id   TEXT,
            sms_sent          BOOLEAN NOT NULL DEFAULT FALSE,
            reminder_sent     BOOLEAN NOT NULL DEFAULT FALSE,
            notes             TEXT,
            created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at        TIMESTAMPTZ
        )
    """)
    op.execute("CREATE INDEX IF NOT EXISTS ix_bookings_doctor_id ON bookings (doctor_id)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_bookings_doctor_start ON bookings (doctor_id, appointment_start)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_bookings_patient_phone ON bookings (patient_phone)")
    op.execute("CREATE INDEX IF NOT EXISTS ix_bookings_appointment_start ON bookings (appointment_start)")


def downgrade() -> None:
    op.execute("DROP TABLE IF EXISTS bookings CASCADE")
    op.execute("DROP TABLE IF EXISTS call_logs CASCADE")
    op.execute("DROP TABLE IF EXISTS calendar_integrations CASCADE")
    op.execute("DROP TABLE IF EXISTS agent_configs CASCADE")
    op.execute("DROP TABLE IF EXISTS doctors CASCADE")
    op.execute("DROP TYPE IF EXISTS bookingstatus CASCADE")
    op.execute("DROP TYPE IF EXISTS calloutcome CASCADE")
