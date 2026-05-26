from __future__ import annotations

from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_active_doctor, get_db
from app.models.call_log import CallLog, CallOutcome
from app.models.doctor import Doctor
from app.schemas.call_log import CallLogListResponse, CallLogResponse, CallStatsResponse

router = APIRouter(prefix="/calls", tags=["calls"])


@router.get("/stats", response_model=CallStatsResponse)
async def get_call_stats(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    week_start = datetime.now(timezone.utc) - timedelta(days=7)

    all_result = await db.execute(
        select(CallLog).where(CallLog.doctor_id == doctor.id)
    )
    all_calls = list(all_result.scalars().all())

    total_duration = sum(c.duration_seconds or 0 for c in all_calls)
    calls_with_duration = [c for c in all_calls if c.duration_seconds is not None]
    avg_duration = total_duration / len(calls_with_duration) if calls_with_duration else 0.0

    by_outcome: dict[str, int] = {outcome.value: 0 for outcome in CallOutcome}
    for call in all_calls:
        by_outcome[call.outcome.value] += 1

    week_result = await db.execute(
        select(func.count(CallLog.id)).where(
            and_(
                CallLog.doctor_id == doctor.id,
                CallLog.created_at >= week_start,
            )
        )
    )
    calls_this_week = week_result.scalar_one()

    return CallStatsResponse(
        total_calls=len(all_calls),
        total_duration_seconds=total_duration,
        calls_by_outcome=by_outcome,
        avg_duration_seconds=round(avg_duration, 2),
        calls_this_week=calls_this_week,
    )


@router.get("", response_model=CallLogListResponse)
async def list_calls(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    outcome: CallOutcome | None = Query(None),
    date_from: datetime | None = Query(None),
    date_to: datetime | None = Query(None),
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    query = select(CallLog).where(CallLog.doctor_id == doctor.id)
    count_query = select(func.count(CallLog.id)).where(CallLog.doctor_id == doctor.id)

    if outcome:
        query = query.where(CallLog.outcome == outcome)
        count_query = count_query.where(CallLog.outcome == outcome)
    if date_from:
        query = query.where(CallLog.created_at >= date_from)
        count_query = count_query.where(CallLog.created_at >= date_from)
    if date_to:
        query = query.where(CallLog.created_at <= date_to)
        count_query = count_query.where(CallLog.created_at <= date_to)

    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    result = await db.execute(
        query.order_by(CallLog.created_at.desc()).offset((page - 1) * limit).limit(limit)
    )
    calls = list(result.scalars().all())

    return CallLogListResponse(
        items=[CallLogResponse.model_validate(c) for c in calls],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{call_id}", response_model=CallLogResponse)
async def get_call(
    call_id: UUID,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(CallLog).where(
            and_(CallLog.id == call_id, CallLog.doctor_id == doctor.id)
        )
    )
    call = result.scalar_one_or_none()
    if not call:
        raise HTTPException(status_code=404, detail="Call log not found")
    return CallLogResponse.model_validate(call)
