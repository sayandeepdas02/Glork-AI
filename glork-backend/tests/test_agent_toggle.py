from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.agent_config import AgentConfig
from app.models.calendar_integration import CalendarIntegration
from app.models.doctor import Doctor
from app.services.retell_service import retell_service


@pytest.mark.asyncio
async def test_toggle_agent_provisions_resources_on_first_activation(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    db.add(
        CalendarIntegration(
            doctor_id=doctor.id,
            google_calendar_id="primary",
            access_token_encrypted="enc_access",
            refresh_token_encrypted="enc_refresh",
            is_connected=True,
        )
    )
    await db.commit()

    with (
        patch.object(
            retell_service,
            "create_llm",
            new=AsyncMock(return_value={"llm_id": "llm_123"}),
        ) as create_llm,
        patch.object(
            retell_service,
            "create_agent",
            new=AsyncMock(return_value={"agent_id": "agent_123", "version": 3}),
        ) as create_agent,
        patch.object(
            retell_service,
            "publish_agent",
            new=AsyncMock(return_value=True),
        ) as publish_agent,
        patch.object(
            retell_service,
            "create_phone_number",
            new=AsyncMock(return_value={"phone_number": "+14155550123"}),
        ) as create_phone_number,
    ):
        resp = await async_client.post(
            "/api/v1/doctors/me/agent/toggle",
            headers=auth_headers,
        )

    assert resp.status_code == 200
    assert resp.json()["is_agent_active"] is True

    await db.refresh(doctor)
    assert doctor.is_agent_active is True

    result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == doctor.id)
    )
    config = result.scalar_one()
    assert config.retell_llm_id == "llm_123"
    assert config.retell_agent_id == "agent_123"
    assert config.glork_phone_number == "+14155550123"

    create_llm.assert_awaited_once()
    create_agent.assert_awaited_once()
    publish_agent.assert_awaited_once_with("agent_123", 3)
    create_phone_number.assert_awaited_once_with(
        retell_agent_id="agent_123",
        agent_version=3,
        nickname="Glork - Test Clinic",
    )


@pytest.mark.asyncio
async def test_toggle_agent_deactivation_unbinds_phone_number(
    async_client: AsyncClient,
    auth_headers: dict,
    doctor: Doctor,
    db: AsyncSession,
):
    doctor.is_agent_active = True
    result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == doctor.id)
    )
    config = result.scalar_one()
    config.retell_llm_id = "llm_live"
    config.retell_agent_id = "agent_live"
    config.glork_phone_number = "+14155550123"
    await db.commit()

    with patch.object(
        retell_service,
        "update_phone_number",
        new=AsyncMock(return_value={"phone_number": "+14155550123"}),
    ) as update_phone_number:
        resp = await async_client.post(
            "/api/v1/doctors/me/agent/toggle",
            headers=auth_headers,
        )

    assert resp.status_code == 200
    assert resp.json()["is_agent_active"] is False

    await db.refresh(doctor)
    assert doctor.is_agent_active is False

    update_phone_number.assert_awaited_once_with(
        "+14155550123",
        [],
        nickname="Glork - Test Clinic",
    )
