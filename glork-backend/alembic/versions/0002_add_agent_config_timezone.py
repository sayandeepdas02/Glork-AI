"""add timezone to agent_configs

Revision ID: 0002
Revises: 0001
Create Date: 2026-06-05 00:00:00.000000

"""
from __future__ import annotations

from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "agent_configs",
        sa.Column(
            "timezone",
            sa.String(50),
            nullable=False,
            server_default="Asia/Kolkata",
        ),
    )


def downgrade() -> None:
    op.drop_column("agent_configs", "timezone")
