from __future__ import annotations

from datetime import datetime, timezone
from uuid import UUID

import structlog
from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.booking import Booking, BookingStatus
from app.models.calendar_integration import CalendarIntegration

logger = structlog.get_logger()


async def _check_conflict(
    doctor_id: UUID,
    start: datetime,
    end: datetime,
    db: AsyncSession,
    exclude_booking_id: UUID | None = None,
) -> bool:
    query = select(Booking).where(
        and_(
            Booking.doctor_id == doctor_id,
            Booking.status.notin_([BookingStatus.cancelled]),
            Booking.appointment_start < end,
            Booking.appointment_end > start,
        )
    )
    if exclude_booking_id:
        query = query.where(Booking.id != exclude_booking_id)
    result = await db.execute(query)
    return result.scalar_one_or_none() is not None


class BookingService:
    async def create_booking(
        self,
        doctor_id: UUID,
        patient_name: str,
        patient_phone: str,
        appointment_start: datetime,
        appointment_end: datetime,
        patient_email: str | None = None,
        reason: str | None = None,
        notes: str | None = None,
        call_log_id: UUID | None = None,
        google_event_id: str | None = None,
        db: AsyncSession = None,
    ) -> Booking:
        if await _check_conflict(doctor_id, appointment_start, appointment_end, db):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Time slot is already booked",
            )

        booking = Booking(
            doctor_id=doctor_id,
            call_log_id=call_log_id,
            patient_name=patient_name,
            patient_phone=patient_phone,
            patient_email=patient_email,
            appointment_start=appointment_start,
            appointment_end=appointment_end,
            reason=reason,
            notes=notes,
            google_event_id=google_event_id,
            status=BookingStatus.confirmed,
        )
        db.add(booking)
        try:
            await db.commit()
            await db.refresh(booking)
        except Exception as exc:
            await db.rollback()
            logger.error("booking_create_failed", error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create booking",
            )
        return booking

    async def reschedule_booking(
        self,
        booking_id: UUID,
        new_start: datetime,
        new_end: datetime,
        doctor_id: UUID,
        db: AsyncSession,
    ) -> Booking:
        result = await db.execute(
            select(Booking).where(
                and_(Booking.id == booking_id, Booking.doctor_id == doctor_id)
            )
        )
        booking = result.scalar_one_or_none()
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        if await _check_conflict(doctor_id, new_start, new_end, db, exclude_booking_id=booking_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="New time slot is already booked",
            )

        booking.appointment_start = new_start
        booking.appointment_end = new_end
        booking.status = BookingStatus.confirmed

        try:
            await db.commit()
            await db.refresh(booking)
        except Exception as exc:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to reschedule booking",
            )
        return booking

    async def cancel_booking(
        self, booking_id: UUID, doctor_id: UUID, db: AsyncSession
    ) -> Booking:
        result = await db.execute(
            select(Booking).where(
                and_(Booking.id == booking_id, Booking.doctor_id == doctor_id)
            )
        )
        booking = result.scalar_one_or_none()
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")

        booking.status = BookingStatus.cancelled

        try:
            await db.commit()
            await db.refresh(booking)
        except Exception as exc:
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to cancel booking",
            )
        return booking

    async def get_bookings(
        self,
        doctor_id: UUID,
        date: str | None = None,
        status_filter: BookingStatus | None = None,
        search: str | None = None,
        page: int = 1,
        limit: int = 20,
        db: AsyncSession = None,
    ) -> tuple[list[Booking], int]:
        query = select(Booking).where(Booking.doctor_id == doctor_id)
        count_query = select(func.count(Booking.id)).where(Booking.doctor_id == doctor_id)

        if date:
            try:
                date_obj = datetime.strptime(date, "%Y-%m-%d").date()
                day_start = datetime(date_obj.year, date_obj.month, date_obj.day, tzinfo=timezone.utc)
                day_end = datetime(date_obj.year, date_obj.month, date_obj.day, 23, 59, 59, tzinfo=timezone.utc)
                query = query.where(
                    and_(
                        Booking.appointment_start >= day_start,
                        Booking.appointment_start <= day_end,
                    )
                )
                count_query = count_query.where(
                    and_(
                        Booking.appointment_start >= day_start,
                        Booking.appointment_start <= day_end,
                    )
                )
            except ValueError:
                pass

        if status_filter:
            query = query.where(Booking.status == status_filter)
            count_query = count_query.where(Booking.status == status_filter)

        if search:
            search_term = f"%{search}%"
            search_filter = or_(
                Booking.patient_name.ilike(search_term),
                Booking.patient_phone.ilike(search_term),
            )
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)

        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        query = (
            query.order_by(Booking.appointment_start.desc())
            .offset((page - 1) * limit)
            .limit(limit)
        )
        result = await db.execute(query)
        bookings = list(result.scalars().all())

        return bookings, total


booking_service = BookingService()
