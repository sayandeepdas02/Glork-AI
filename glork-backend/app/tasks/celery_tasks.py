from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone

import structlog
from celery import Celery
from celery.schedules import crontab

from app.config import settings

logger = structlog.get_logger()

celery_app = Celery(
    "glork",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_acks_late=True,
    worker_prefetch_multiplier=1,
)

celery_app.conf.beat_schedule = {
    "schedule-reminders": {
        "task": "app.tasks.celery_tasks.schedule_reminders",
        "schedule": crontab(minute=0),
    },
    "refresh-calendar-tokens": {
        "task": "app.tasks.celery_tasks.refresh_calendar_tokens",
        "schedule": crontab(minute="*/30"),
    },
}


def _run_async(coro):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()
        asyncio.set_event_loop(None)  # Clear thread-local state to prevent closed-loop reuse


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="app.tasks.celery_tasks.send_sms_confirmation")
def send_sms_confirmation(self, booking_id: str):
    async def _inner():
        from sqlalchemy import select
        from app.db.session import AsyncSessionLocal
        from app.models.agent_config import AgentConfig
        from app.models.booking import Booking
        from app.models.doctor import Doctor
        from app.services.notification_service import notification_service

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Booking).where(Booking.id == booking_id))
            booking = result.scalar_one_or_none()
            if not booking:
                logger.warning("sms_confirmation_booking_not_found", booking_id=booking_id)
                return

            doc_result = await db.execute(select(Doctor).where(Doctor.id == booking.doctor_id))
            doctor = doc_result.scalar_one_or_none()
            if not doctor:
                return

            cfg_result = await db.execute(
                select(AgentConfig).where(AgentConfig.doctor_id == booking.doctor_id)
            )
            config = cfg_result.scalar_one_or_none()
            clinic_timezone = config.timezone if config else "UTC"

            sent = await notification_service.send_sms_confirmation(booking, doctor, clinic_timezone)
            if sent:
                booking.sms_sent = True
                await db.commit()

    try:
        _run_async(_inner())
    except Exception as exc:
        logger.error("send_sms_confirmation_failed", booking_id=booking_id, error=str(exc))
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="app.tasks.celery_tasks.send_sms_reminder")
def send_sms_reminder(self, booking_id: str):
    async def _inner():
        from sqlalchemy import select
        from app.db.session import AsyncSessionLocal
        from app.models.agent_config import AgentConfig
        from app.models.booking import Booking, BookingStatus
        from app.models.doctor import Doctor
        from app.services.notification_service import notification_service

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Booking).where(Booking.id == booking_id))
            booking = result.scalar_one_or_none()
            if not booking or booking.status != BookingStatus.confirmed:
                return

            doc_result = await db.execute(select(Doctor).where(Doctor.id == booking.doctor_id))
            doctor = doc_result.scalar_one_or_none()
            if not doctor:
                return

            cfg_result = await db.execute(
                select(AgentConfig).where(AgentConfig.doctor_id == booking.doctor_id)
            )
            config = cfg_result.scalar_one_or_none()
            clinic_timezone = config.timezone if config else "UTC"

            sent = await notification_service.send_sms_reminder(booking, doctor, clinic_timezone)
            if sent:
                booking.reminder_sent = True
                await db.commit()

    try:
        _run_async(_inner())
    except Exception as exc:
        logger.error("send_sms_reminder_failed", booking_id=booking_id, error=str(exc))
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3, default_retry_delay=300, name="app.tasks.celery_tasks.schedule_reminders")
def schedule_reminders(self):
    async def _inner():
        from sqlalchemy import and_, select
        from app.db.session import AsyncSessionLocal
        from app.models.booking import Booking, BookingStatus

        now = datetime.now(timezone.utc)
        window_start = now + timedelta(hours=23)
        window_end = now + timedelta(hours=25)

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(Booking).where(
                    and_(
                        Booking.status == BookingStatus.confirmed,
                        Booking.reminder_sent.is_(False),
                        Booking.appointment_start >= window_start,
                        Booking.appointment_start <= window_end,
                    )
                )
            )
            bookings = list(result.scalars().all())
            for booking in bookings:
                send_sms_reminder.delay(str(booking.id))
                logger.info("reminder_scheduled", booking_id=str(booking.id))

    try:
        _run_async(_inner())
    except Exception as exc:
        logger.error("schedule_reminders_failed", error=str(exc))
        raise self.retry(exc=exc, countdown=300 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60, name="app.tasks.celery_tasks.process_call_ended")
def process_call_ended(self, call_log_id: str):
    async def _inner():
        from sqlalchemy import select
        from app.db.session import AsyncSessionLocal
        from app.models.booking import Booking
        from app.models.call_log import CallLog, CallOutcome

        async with AsyncSessionLocal() as db:
            result = await db.execute(select(CallLog).where(CallLog.id == call_log_id))
            call_log = result.scalar_one_or_none()
            if not call_log:
                logger.warning("process_call_ended_not_found", call_log_id=call_log_id)
                return

            if call_log.outcome == CallOutcome.booked:
                booking_result = await db.execute(
                    select(Booking).where(Booking.call_log_id == call_log.id)
                )
                booking = booking_result.scalar_one_or_none()
                if booking:
                    logger.info(
                        "call_linked_to_booking",
                        call_log_id=call_log_id,
                        booking_id=str(booking.id),
                    )

    try:
        _run_async(_inner())
    except Exception as exc:
        logger.error("process_call_ended_failed", call_log_id=call_log_id, error=str(exc))
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(bind=True, max_retries=3, default_retry_delay=300, name="app.tasks.celery_tasks.refresh_calendar_tokens")
def refresh_calendar_tokens(self):
    async def _inner():
        from sqlalchemy import and_, select
        from app.db.session import AsyncSessionLocal
        from app.models.calendar_integration import CalendarIntegration
        from app.services.calendar_service import calendar_service

        now = datetime.now(timezone.utc)
        expiry_threshold = now + timedelta(minutes=10)

        async with AsyncSessionLocal() as db:
            result = await db.execute(
                select(CalendarIntegration).where(
                    and_(
                        CalendarIntegration.is_connected.is_(True),
                        CalendarIntegration.token_expiry <= expiry_threshold,
                    )
                )
            )
            integrations = list(result.scalars().all())
            for integration in integrations:
                try:
                    await calendar_service.get_credentials(integration.doctor_id, db)
                    logger.info("token_refreshed", doctor_id=str(integration.doctor_id))
                except Exception as exc:
                    logger.error(
                        "token_refresh_failed",
                        doctor_id=str(integration.doctor_id),
                        error=str(exc),
                    )

    try:
        _run_async(_inner())
    except Exception as exc:
        logger.error("refresh_calendar_tokens_failed", error=str(exc))
        raise self.retry(exc=exc, countdown=300 * (2 ** self.request.retries))
