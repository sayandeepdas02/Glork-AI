"""add google_id and make password_hash nullable

Revision ID: 0002b
Revises: 0002
Create Date: 2026-06-05 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

from alembic import op

revision: str = "0002b"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("ALTER TABLE doctors ALTER COLUMN password_hash DROP NOT NULL")
    op.execute(
        "ALTER TABLE doctors ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE"
    )
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_doctors_google_id ON doctors (google_id)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_doctors_google_id")
    op.execute("ALTER TABLE doctors DROP COLUMN IF EXISTS google_id")
    op.execute(
        "UPDATE doctors SET password_hash = '' WHERE password_hash IS NULL"
    )
    op.execute("ALTER TABLE doctors ALTER COLUMN password_hash SET NOT NULL")
