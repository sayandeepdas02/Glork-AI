from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import structlog
from fastapi import HTTPException, status
from sqlalchemy import and_, func, or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.agent_config import AgentConfig
from app.models.booking import Booking, BookingStatus
from app.models.calendar_integration import CalendarIntegration
from app.models.doctor import Doctor
from app.services.calendar_service import DAY_KEY_MAP, calendar_service

logger = structlog.get_logger()


@dataclass
class BookingContext:
    doctor: Doctor
    config: AgentConfig
    calendar: CalendarIntegration | None


async def _check_conflict(
    doctor_id: UUID,
    start: datetime,
    end: datetime,
    db: AsyncSession,
    exclude_booking_id: UUID | None = None,
) -> bool:
    query = select(Booking.id).where(
        and_(
            Booking.doctor_id == doctor_id,
            Booking.status.notin_([BookingStatus.cancelled]),
            Booking.appointment_start < end,
            Booking.appointment_end > start,
        )
    )
    if exclude_booking_id:
        query = query.where(Booking.id != exclude_booking_id)
    result = await db.execute(query.limit(1))
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
        db: AsyncSession | None = None,
    ) -> Booking:
        context = await self._lock_context(doctor_id, db)
        start_utc, end_utc = self._validate_booking_window(
            appointment_start, appointment_end, context.config
        )

        if await _check_conflict(doctor_id, start_utc, end_utc, db):
            await db.rollback()
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
            appointment_start=start_utc,
            appointment_end=end_utc,
            reason=reason,
            notes=notes,
            status=BookingStatus.confirmed,
        )
        db.add(booking)

        remote_event_id: str | None = None

        try:
            await db.flush()

            if self._calendar_sync_enabled(context.calendar):
                remote_event_id = await self._create_calendar_event(
                    doctor_id=doctor_id,
                    booking=booking,
                    calendar_id=self._calendar_id(context.calendar),
                )
                booking.google_event_id = remote_event_id

            await db.commit()
            await db.refresh(booking)
        except HTTPException:
            await db.rollback()
            raise
        except IntegrityError as exc:
            await db.rollback()
            if remote_event_id:
                await self._delete_calendar_event_best_effort(
                    doctor_id=doctor_id,
                    event_id=remote_event_id,
                    calendar_id=self._calendar_id(context.calendar),
                )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Time slot is already booked",
            ) from exc
        except Exception as exc:
            await db.rollback()
            if remote_event_id:
                await self._delete_calendar_event_best_effort(
                    doctor_id=doctor_id,
                    event_id=remote_event_id,
                    calendar_id=self._calendar_id(context.calendar),
                )
            logger.error("booking_create_failed", doctor_id=str(doctor_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to create booking",
            ) from exc

        return booking

    async def reschedule_booking(
        self,
        booking_id: UUID,
        new_start: datetime,
        new_end: datetime,
        doctor_id: UUID,
        db: AsyncSession,
    ) -> Booking:
        context = await self._lock_context(doctor_id, db)
        booking = await self._get_locked_booking(booking_id, doctor_id, db)
        start_utc, end_utc = self._validate_booking_window(new_start, new_end, context.config)

        if await _check_conflict(doctor_id, start_utc, end_utc, db, exclude_booking_id=booking_id):
            await db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="New time slot is already booked",
            )

        old_start = booking.appointment_start
        old_end = booking.appointment_end
        booking.appointment_start = start_utc
        booking.appointment_end = end_utc
        booking.status = BookingStatus.confirmed

        remote_synced = False

        try:
            if booking.google_event_id and self._calendar_sync_enabled(context.calendar):
                await self._update_calendar_event(
                    doctor_id=doctor_id,
                    event_id=booking.google_event_id,
                    start=start_utc,
                    end=end_utc,
                    calendar_id=self._calendar_id(context.calendar),
                )
                remote_synced = True

            await db.commit()
            await db.refresh(booking)
        except HTTPException:
            await db.rollback()
            raise
        except IntegrityError as exc:
            await db.rollback()
            if remote_synced:
                await self._restore_calendar_event_best_effort(
                    doctor_id=doctor_id,
                    event_id=booking.google_event_id,
                    start=old_start,
                    end=old_end,
                    calendar_id=self._calendar_id(context.calendar),
                )
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="New time slot is already booked",
            ) from exc
        except Exception as exc:
            await db.rollback()
            if remote_synced:
                await self._restore_calendar_event_best_effort(
                    doctor_id=doctor_id,
                    event_id=booking.google_event_id,
                    start=old_start,
                    end=old_end,
                    calendar_id=self._calendar_id(context.calendar),
                )
            logger.error("booking_reschedule_failed", booking_id=str(booking_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to reschedule booking",
            ) from exc

        return booking

    async def cancel_booking(
        self, booking_id: UUID, doctor_id: UUID, db: AsyncSession
    ) -> Booking:
        context = await self._lock_context(doctor_id, db)
        booking = await self._get_locked_booking(booking_id, doctor_id, db)
        previous_status = booking.status
        remote_deleted = False

        booking.status = BookingStatus.cancelled

        try:
            if booking.google_event_id and self._calendar_sync_enabled(context.calendar):
                await self._delete_calendar_event(
                    doctor_id=doctor_id,
                    event_id=booking.google_event_id,
                    calendar_id=self._calendar_id(context.calendar),
                )
                remote_deleted = True

            await db.commit()
            await db.refresh(booking)
        except HTTPException:
            await db.rollback()
            raise
        except Exception as exc:
            await db.rollback()
            if remote_deleted:
                await self._recreate_calendar_event_best_effort(
                    doctor_id=doctor_id,
                    booking=booking,
                    calendar_id=self._calendar_id(context.calendar),
                )
            logger.error("booking_cancel_failed", booking_id=str(booking_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to cancel booking",
            ) from exc

        if previous_status != BookingStatus.cancelled:
            logger.info("booking_cancelled", booking_id=str(booking_id), doctor_id=str(doctor_id))
        return booking

    async def update_booking_details(
        self,
        booking_id: UUID,
        doctor_id: UUID,
        status_value: BookingStatus | None,
        notes: str | None,
        db: AsyncSession,
    ) -> Booking:
        booking = await self._get_locked_booking(booking_id, doctor_id, db)

        if status_value is not None:
            booking.status = status_value
        if notes is not None:
            booking.notes = notes

        try:
            await db.commit()
            await db.refresh(booking)
        except Exception as exc:
            await db.rollback()
            logger.error("booking_update_failed", booking_id=str(booking_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to update booking",
            ) from exc

        return booking

    async def get_bookings(
        self,
        doctor_id: UUID,
        date: str | None = None,
        status_filter: BookingStatus | None = None,
        search: str | None = None,
        page: int = 1,
        limit: int = 20,
        db: AsyncSession | None = None,
    ) -> tuple[list[Booking], int]:
        query = select(Booking).where(Booking.doctor_id == doctor_id)
        count_query = select(func.count(Booking.id)).where(Booking.doctor_id == doctor_id)

        if date:
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

    async def _lock_context(self, doctor_id: UUID, db: AsyncSession) -> BookingContext:
        doctor_result = await db.execute(
            select(Doctor).where(Doctor.id == doctor_id).with_for_update()
        )
        doctor = doctor_result.scalar_one_or_none()
        if not doctor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")

        config_result = await db.execute(
            select(AgentConfig).where(AgentConfig.doctor_id == doctor_id).with_for_update()
        )
        config = config_result.scalar_one_or_none()
        if not config:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Agent config not found",
            )

        calendar_result = await db.execute(
            select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor_id)
        )
        calendar = calendar_result.scalar_one_or_none()

        return BookingContext(doctor=doctor, config=config, calendar=calendar)

    async def _get_locked_booking(
        self, booking_id: UUID, doctor_id: UUID, db: AsyncSession
    ) -> Booking:
        result = await db.execute(
            select(Booking)
            .where(and_(Booking.id == booking_id, Booking.doctor_id == doctor_id))
            .with_for_update()
        )
        booking = result.scalar_one_or_none()
        if not booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
        return booking

    def _validate_booking_window(
        self,
        appointment_start: datetime,
        appointment_end: datetime,
        config: AgentConfig,
    ) -> tuple[datetime, datetime]:
        start_utc = self._normalize_datetime(appointment_start)
        end_utc = self._normalize_datetime(appointment_end)

        if end_utc <= start_utc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="appointment_end must be after appointment_start",
            )

        doctor_tz = self._doctor_timezone(config.timezone)
        now_utc = datetime.now(timezone.utc)
        if start_utc <= now_utc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Appointment start must be in the future",
            )

        local_start = start_utc.astimezone(doctor_tz)
        local_end = end_utc.astimezone(doctor_tz)
        if local_end.date() != local_start.date():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Appointments must start and end on the same local day",
            )

        local_today = now_utc.astimezone(doctor_tz).date()
        latest_allowed = local_today + timedelta(days=config.max_advance_booking_days)
        if local_start.date() > latest_allowed:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=(
                    "Appointments cannot be booked more than "
                    f"{config.max_advance_booking_days} days in advance"
                ),
            )

        day_config = config.working_hours.get(DAY_KEY_MAP[local_start.weekday()], {})
        if not day_config.get("enabled", False):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Doctor is not available on the requested day",
            )

        try:
            start_hour, start_minute = map(int, str(day_config["start"]).split(":"))
            end_hour, end_minute = map(int, str(day_config["end"]).split(":"))
        except (KeyError, TypeError, ValueError) as exc:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Doctor working hours are misconfigured",
            ) from exc

        working_start = local_start.replace(
            hour=start_hour, minute=start_minute, second=0, microsecond=0
        )
        working_end = local_start.replace(
            hour=end_hour, minute=end_minute, second=0, microsecond=0
        )

        if local_start < working_start or local_end > working_end:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Requested appointment is outside the doctor's working hours",
            )

        return start_utc, end_utc

    @staticmethod
    def _normalize_datetime(value: datetime) -> datetime:
        if value.tzinfo is None or value.utcoffset() is None:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Appointment datetimes must include a timezone",
            )
        return value.astimezone(timezone.utc)

    @staticmethod
    def _doctor_timezone(timezone_name: str) -> ZoneInfo:
        try:
            return ZoneInfo(timezone_name)
        except (ZoneInfoNotFoundError, KeyError):
            logger.warning("unknown_timezone", timezone=timezone_name)
            return ZoneInfo("UTC")

    @staticmethod
    def _calendar_sync_enabled(calendar: CalendarIntegration | None) -> bool:
        return bool(calendar and calendar.is_connected)

    @staticmethod
    def _calendar_id(calendar: CalendarIntegration | None) -> str:
        if calendar and calendar.google_calendar_id:
            return calendar.google_calendar_id
        return "primary"

    async def _create_calendar_event(
        self,
        doctor_id: UUID,
        booking: Booking,
        calendar_id: str,
        event_id: str | None = None,
    ) -> str:
        async with AsyncSessionLocal() as calendar_db:
            return await calendar_service.create_event(
                doctor_id=doctor_id,
                patient_name=booking.patient_name,
                patient_phone=booking.patient_phone,
                start_datetime=booking.appointment_start,
                end_datetime=booking.appointment_end,
                reason=booking.reason,
                calendar_id=calendar_id,
                db=calendar_db,
                event_id=event_id or booking.id.hex,
            )

    async def _update_calendar_event(
        self,
        doctor_id: UUID,
        event_id: str,
        start: datetime,
        end: datetime,
        calendar_id: str,
    ) -> None:
        async with AsyncSessionLocal() as calendar_db:
            await calendar_service.update_event(
                doctor_id=doctor_id,
                event_id=event_id,
                start=start,
                end=end,
                calendar_id=calendar_id,
                db=calendar_db,
            )

    async def _delete_calendar_event(
        self,
        doctor_id: UUID,
        event_id: str,
        calendar_id: str,
    ) -> None:
        async with AsyncSessionLocal() as calendar_db:
            await calendar_service.delete_event(
                doctor_id=doctor_id,
                event_id=event_id,
                calendar_id=calendar_id,
                db=calendar_db,
            )

    async def _delete_calendar_event_best_effort(
        self,
        doctor_id: UUID,
        event_id: str,
        calendar_id: str,
    ) -> None:
        try:
            await self._delete_calendar_event(doctor_id, event_id, calendar_id)
        except HTTPException as exc:
            logger.error(
                "booking_calendar_cleanup_failed",
                doctor_id=str(doctor_id),
                event_id=event_id,
                error=exc.detail,
            )

    async def _restore_calendar_event_best_effort(
        self,
        doctor_id: UUID,
        event_id: str | None,
        start: datetime,
        end: datetime,
        calendar_id: str,
    ) -> None:
        if not event_id:
            return

        try:
            await self._update_calendar_event(
                doctor_id=doctor_id,
                event_id=event_id,
                start=start,
                end=end,
                calendar_id=calendar_id,
            )
        except HTTPException as exc:
            logger.error(
                "booking_calendar_restore_failed",
                doctor_id=str(doctor_id),
                event_id=event_id,
                error=exc.detail,
            )

    async def _recreate_calendar_event_best_effort(
        self,
        doctor_id: UUID,
        booking: Booking,
        calendar_id: str,
    ) -> None:
        try:
            await self._create_calendar_event(
                doctor_id,
                booking,
                calendar_id,
                event_id=booking.google_event_id or booking.id.hex,
            )
        except HTTPException as exc:
            logger.error(
                "booking_calendar_recreate_failed",
                doctor_id=str(doctor_id),
                booking_id=str(booking.id),
                error=exc.detail,
            )


booking_service = BookingService()
