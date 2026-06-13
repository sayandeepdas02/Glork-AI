from __future__ import annotations

import structlog
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.config import settings
from app.dependencies import get_current_active_doctor, get_db
from app.models.agent_config import AgentConfig
from app.models.calendar_integration import CalendarIntegration
from app.models.doctor import Doctor
from app.schemas.agent_config import AgentConfigResponse, AgentConfigUpdate
from app.schemas.doctor import AgentToggleResponse, DoctorResponse, DoctorUpdate
from app.services.retell_service import retell_service

logger = structlog.get_logger()

router = APIRouter(prefix="/doctors", tags=["doctors"])


async def _load_doctor_full(doctor_id, db: AsyncSession) -> Doctor:
    result = await db.execute(
        select(Doctor)
        .options(selectinload(Doctor.agent_config), selectinload(Doctor.calendar_integration))
        .where(Doctor.id == doctor_id)
    )
    return result.scalar_one_or_none()


def _agent_nickname(doctor: Doctor) -> str:
    return f"Glork - {doctor.clinic_name}"


def _require_retell_config() -> None:
    if not settings.RETELL_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Retell is not configured",
        )


async def _ensure_agent_resources(
    doctor: Doctor,
    config: AgentConfig,
    cleanup: dict[str, str | bool | None],
) -> None:
    _require_retell_config()

    if not config.retell_llm_id:
        llm = await retell_service.create_llm(
            doctor=doctor,
            agent_config=config,
            tools_base_url=settings.BACKEND_URL,
            doctor_id=str(doctor.id),
        )
        config.retell_llm_id = llm.get("llm_id")
        cleanup["created_llm_id"] = config.retell_llm_id
        if not config.retell_llm_id:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Retell LLM provisioning returned no id",
            )

    if not config.retell_agent_id:
        agent = await retell_service.create_agent(
            doctor=doctor,
            agent_config=config,
            webhook_url=f"{settings.BACKEND_URL.rstrip('/')}/api/v1/retell/webhook",
            llm_id=config.retell_llm_id,
        )
        config.retell_agent_id = agent.get("agent_id")
        cleanup["created_agent_id"] = config.retell_agent_id
        if not config.retell_agent_id:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Retell agent provisioning returned no id",
            )

        agent_version = int(agent.get("version", 0))
        published = await retell_service.publish_agent(
            config.retell_agent_id,
            agent_version,
        )
        if not published:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to publish Retell agent",
            )
    else:
        agent = await retell_service.get_agent(config.retell_agent_id)
        agent_version = int(agent.get("version", 0))
        if not agent.get("is_published", False):
            published = await retell_service.publish_agent(
                config.retell_agent_id,
                agent_version,
            )
            if not published:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to publish Retell agent",
                )

    inbound_agents = [
        {
            "agent_id": config.retell_agent_id,
            "agent_version": agent_version,
            "weight": 1,
        }
    ]

    if config.glork_phone_number:
        await retell_service.update_phone_number(
            config.glork_phone_number,
            inbound_agents,
            nickname=_agent_nickname(doctor),
        )
        cleanup["bound_existing_phone"] = True
    else:
        phone = await retell_service.create_phone_number(
            retell_agent_id=config.retell_agent_id,
            agent_version=agent_version,
            nickname=_agent_nickname(doctor),
        )
        config.glork_phone_number = phone.get("phone_number")
        cleanup["created_phone_number"] = config.glork_phone_number
        if not config.glork_phone_number:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Retell phone provisioning returned no number",
            )


async def _rollback_remote_activation(
    doctor: Doctor,
    config: AgentConfig,
    cleanup: dict[str, str | bool | None],
) -> None:
    created_phone_number = cleanup.get("created_phone_number")
    if isinstance(created_phone_number, str) and created_phone_number:
        await retell_service.delete_phone_number(created_phone_number)
    elif cleanup.get("bound_existing_phone") and config.glork_phone_number:
        try:
            await retell_service.update_phone_number(
                config.glork_phone_number,
                [],
                nickname=_agent_nickname(doctor),
            )
        except Exception as exc:
            logger.warning(
                "retell_phone_unbind_rollback_failed",
                doctor_id=str(doctor.id),
                error=str(exc),
            )

    created_agent_id = cleanup.get("created_agent_id")
    if isinstance(created_agent_id, str) and created_agent_id:
        await retell_service.delete_agent(created_agent_id)

    created_llm_id = cleanup.get("created_llm_id")
    if isinstance(created_llm_id, str) and created_llm_id:
        await retell_service.delete_llm(created_llm_id)


async def _deactivate_agent_resources(doctor: Doctor, config: AgentConfig) -> None:
    if not config.glork_phone_number:
        return

    _require_retell_config()
    await retell_service.update_phone_number(
        config.glork_phone_number,
        [],
        nickname=_agent_nickname(doctor),
    )


async def _rollback_remote_deactivation(doctor: Doctor, config: AgentConfig) -> None:
    if not config.glork_phone_number or not config.retell_agent_id:
        return

    try:
        agent = await retell_service.get_agent(config.retell_agent_id)
        agent_version = int(agent.get("version", 0))
        await retell_service.update_phone_number(
            config.glork_phone_number,
            [
                {
                    "agent_id": config.retell_agent_id,
                    "agent_version": agent_version,
                    "weight": 1,
                }
            ],
            nickname=_agent_nickname(doctor),
        )
    except Exception as exc:
        logger.warning(
            "retell_phone_rebind_rollback_failed",
            doctor_id=str(doctor.id),
            error=str(exc),
        )


@router.get("/me", response_model=DoctorResponse)
async def get_me(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    full = await _load_doctor_full(doctor.id, db)
    response = DoctorResponse.model_validate(full)
    response.calendar_connected = (
        full.calendar_integration is not None and full.calendar_integration.is_connected
    )
    response.has_password = full.password_hash is not None
    return response


@router.patch("/me", response_model=DoctorResponse)
async def update_me(
    payload: DoctorUpdate,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(doctor, field, value)

    try:
        await db.commit()
        await db.refresh(doctor)
    except Exception as exc:
        await db.rollback()
        logger.error("doctor_update_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to update profile")

    full = await _load_doctor_full(doctor.id, db)
    response = DoctorResponse.model_validate(full)
    response.calendar_connected = (
        full.calendar_integration is not None and full.calendar_integration.is_connected
    )
    response.has_password = full.password_hash is not None
    return response


@router.get("/me/agent-config", response_model=AgentConfigResponse)
async def get_agent_config(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == doctor.id)
    )
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")
    return AgentConfigResponse.model_validate(config)


@router.put("/me/agent-config", response_model=AgentConfigResponse)
async def update_agent_config(
    payload: AgentConfigUpdate,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == doctor.id)
    )
    config = result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "working_hours" and value is not None:
            setattr(config, field, {k: v.model_dump() for k, v in value.items()})
        else:
            setattr(config, field, value)

    try:
        await db.commit()
        await db.refresh(config)
    except Exception as exc:
        await db.rollback()
        logger.error("agent_config_update_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to update agent config")

    if config.retell_llm_id:
        full_doctor = await _load_doctor_full(doctor.id, db)
        new_prompt = retell_service.build_system_prompt(full_doctor, config)
        await retell_service.update_agent_prompt(config.retell_llm_id, new_prompt)

    return AgentConfigResponse.model_validate(config)


@router.post("/me/agent/toggle", response_model=AgentToggleResponse)
async def toggle_agent(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    # Lock the row to prevent concurrent toggles producing inconsistent state
    locked = await db.execute(
        select(Doctor).where(Doctor.id == doctor.id).with_for_update()
    )
    locked_doctor = locked.scalar_one()

    config_result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == locked_doctor.id).with_for_update()
    )
    config = config_result.scalar_one_or_none()
    if not config:
        raise HTTPException(status_code=404, detail="Agent config not found")

    activating = not locked_doctor.is_agent_active
    activation_cleanup: dict[str, str | bool | None] | None = None

    try:
        if activating:
            cal_result = await db.execute(
                select(CalendarIntegration).where(CalendarIntegration.doctor_id == locked_doctor.id)
            )
            cal = cal_result.scalar_one_or_none()
            if not cal or not cal.is_connected:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Connect Google Calendar first",
                )
            full_doctor = await _load_doctor_full(locked_doctor.id, db)
            activation_cleanup = {
                "created_llm_id": None,
                "created_agent_id": None,
                "created_phone_number": None,
                "bound_existing_phone": False,
            }
            await _ensure_agent_resources(full_doctor, config, activation_cleanup)
        else:
            await _deactivate_agent_resources(locked_doctor, config)
    except HTTPException:
        if activating and activation_cleanup is not None:
            await _rollback_remote_activation(locked_doctor, config, activation_cleanup)
        raise
    except Exception as exc:
        if activating and activation_cleanup is not None:
            await _rollback_remote_activation(locked_doctor, config, activation_cleanup)
        logger.error("agent_remote_toggle_failed", doctor_id=str(doctor.id), error=str(exc))
        detail = "Failed to provision Retell agent" if activating else "Failed to deactivate Retell agent"
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=detail)

    locked_doctor.is_agent_active = activating

    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        if activating and activation_cleanup is not None:
            await _rollback_remote_activation(locked_doctor, config, activation_cleanup)
        elif not activating:
            await _rollback_remote_deactivation(locked_doctor, config)
        logger.error("agent_toggle_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to toggle agent")

    msg = "AI agent activated" if activating else "AI agent deactivated"
    return AgentToggleResponse(is_agent_active=activating, message=msg)
