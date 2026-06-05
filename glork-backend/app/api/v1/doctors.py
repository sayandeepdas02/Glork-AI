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

    if not locked_doctor.is_agent_active:
        cal_result = await db.execute(
            select(CalendarIntegration).where(CalendarIntegration.doctor_id == locked_doctor.id)
        )
        cal = cal_result.scalar_one_or_none()
        if not cal or not cal.is_connected:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Connect Google Calendar first",
            )

    locked_doctor.is_agent_active = not locked_doctor.is_agent_active
    new_state = locked_doctor.is_agent_active

    try:
        await db.commit()
    except Exception as exc:
        await db.rollback()
        logger.error("agent_toggle_failed", doctor_id=str(doctor.id), error=str(exc))
        raise HTTPException(status_code=500, detail="Failed to toggle agent")

    msg = "AI agent activated" if new_state else "AI agent deactivated"
    return AgentToggleResponse(is_agent_active=new_state, message=msg)
