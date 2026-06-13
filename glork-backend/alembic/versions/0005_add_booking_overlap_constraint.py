"""prevent overlapping active bookings per doctor

Revision ID: 0005
Revises: 0004
Create Date: 2026-06-14 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS btree_gist")
    op.execute(
        """
        ALTER TABLE bookings
        ADD CONSTRAINT bookings_doctor_time_no_overlap
        EXCLUDE USING gist (
            doctor_id WITH =,
            tstzrange(appointment_start, appointment_end, '[)') WITH &&
        )
        WHERE (status <> 'cancelled'::bookingstatus)
        """
    )


def downgrade() -> None:
    op.execute(
        "ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_doctor_time_no_overlap"
    )
