from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_current_active_doctor, get_db
from app.models.agent_config import AgentConfig
from app.models.booking import Booking, BookingStatus
from app.models.call_log import CallLog
from app.models.doctor import Doctor
from app.schemas.booking import (
    BookingCreate,
    BookingListResponse,
    BookingResponse,
    BookingStatsResponse,
    BookingUpdate,
)
from app.services.booking_service import booking_service
from app.tasks.celery_tasks import send_sms_confirmation

router = APIRouter(prefix="/bookings", tags=["bookings"])


@router.get("/stats", response_model=BookingStatsResponse)
async def get_booking_stats(
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    cfg_result = await db.execute(
        select(AgentConfig.timezone).where(AgentConfig.doctor_id == doctor.id)
    )
    tz_name = cfg_result.scalar_one_or_none() or "UTC"
    try:
        clinic_tz = ZoneInfo(tz_name)
    except (ZoneInfoNotFoundError, KeyError):
        clinic_tz = ZoneInfo("UTC")

    now_local = datetime.now(clinic_tz)
    month_start_local = now_local.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    month_start = month_start_local.astimezone(timezone.utc)

    base = select(func.count(Booking.id)).where(
        and_(
            Booking.doctor_id == doctor.id,
            Booking.appointment_start >= month_start,
        )
    )

    total_result = await db.execute(base)
    total = total_result.scalar_one()

    confirmed_result = await db.execute(
        base.where(Booking.status == BookingStatus.confirmed)
    )
    confirmed = confirmed_result.scalar_one()

    cancelled_result = await db.execute(
        base.where(Booking.status == BookingStatus.cancelled)
    )
    cancelled = cancelled_result.scalar_one()

    no_show_result = await db.execute(
        base.where(Booking.status == BookingStatus.no_show)
    )
    no_show = no_show_result.scalar_one()

    calls_result = await db.execute(
        select(func.count(CallLog.id)).where(
            and_(
                CallLog.doctor_id == doctor.id,
                CallLog.created_at >= month_start,
            )
        )
    )
    total_calls = calls_result.scalar_one()

    conversion_rate = (total / total_calls * 100) if total_calls > 0 else 0.0

    return BookingStatsResponse(
        total_this_month=total,
        confirmed_this_month=confirmed,
        cancelled_this_month=cancelled,
        no_show_this_month=no_show,
        conversion_rate=round(conversion_rate, 2),
    )


@router.get("", response_model=BookingListResponse)
async def list_bookings(
    date: str | None = Query(None),
    status: BookingStatus | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    if date is not None:
        try:
            datetime.strptime(date, "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=422,
                detail="Invalid date format. Use YYYY-MM-DD.",
            )

    bookings, total = await booking_service.get_bookings(
        doctor_id=doctor.id,
        date=date,
        status_filter=status,
        search=search,
        page=page,
        limit=limit,
        db=db,
    )
    return BookingListResponse(
        items=[BookingResponse.model_validate(b) for b in bookings],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: UUID,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking).where(
            and_(Booking.id == booking_id, Booking.doctor_id == doctor.id)
        )
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    return BookingResponse.model_validate(booking)


@router.post("", response_model=BookingResponse, status_code=201)
async def create_booking(
    payload: BookingCreate,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    booking = await booking_service.create_booking(
        doctor_id=doctor.id,
        patient_name=payload.patient_name,
        patient_phone=payload.patient_phone,
        patient_email=payload.patient_email,
        appointment_start=payload.appointment_start,
        appointment_end=payload.appointment_end,
        reason=payload.reason,
        notes=payload.notes,
        db=db,
    )

    send_sms_confirmation.delay(str(booking.id))
    return BookingResponse.model_validate(booking)


@router.patch("/{booking_id}", response_model=BookingResponse)
async def update_booking(
    booking_id: UUID,
    payload: BookingUpdate,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking).where(
            and_(Booking.id == booking_id, Booking.doctor_id == doctor.id)
        )
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    is_rescheduling = (
        payload.appointment_start is not None or payload.appointment_end is not None
    )
    is_cancelling = payload.status == BookingStatus.cancelled

    if is_rescheduling and is_cancelling:
        raise HTTPException(
            status_code=422,
            detail="Rescheduling and cancelling the same booking in one request is not supported",
        )

    if is_rescheduling:
        new_start = payload.appointment_start or booking.appointment_start
        new_end = payload.appointment_end or booking.appointment_end
        booking = await booking_service.reschedule_booking(
            booking_id=booking_id,
            new_start=new_start,
            new_end=new_end,
            doctor_id=doctor.id,
            db=db,
        )
    elif is_cancelling:
        booking = await booking_service.cancel_booking(booking_id, doctor.id, db)
    elif payload.notes is not None or payload.status is not None:
        booking = await booking_service.update_booking_details(
            booking_id=booking_id,
            doctor_id=doctor.id,
            status_value=payload.status,
            notes=payload.notes,
            db=db,
        )

    return BookingResponse.model_validate(booking)


@router.delete("/{booking_id}", status_code=204)
async def delete_booking(
    booking_id: UUID,
    doctor: Doctor = Depends(get_current_active_doctor),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(Booking).where(
            and_(Booking.id == booking_id, Booking.doctor_id == doctor.id)
        )
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.status != BookingStatus.cancelled:
        await booking_service.cancel_booking(booking_id, doctor.id, db)
    else:
        await db.delete(booking)
        await db.commit()
