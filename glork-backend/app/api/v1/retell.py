from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import structlog
from fastapi import APIRouter, HTTPException, Request, status
from pydantic import ValidationError
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.session import AsyncSessionLocal
from app.models.agent_config import AgentConfig
from app.models.booking import Booking, BookingStatus
from app.models.calendar_integration import CalendarIntegration
from app.models.call_log import CallLog, CallOutcome
from app.models.doctor import Doctor
from app.schemas.retell import (
    CancelBookingToolRequest,
    CheckAvailabilityToolRequest,
    CreateBookingToolRequest,
    GetPatientBookingsToolRequest,
    RetellWebhookEvent,
)
from app.services.booking_service import booking_service
from app.services.calendar_service import calendar_service
from app.services.retell_service import retell_service
from app.tasks.celery_tasks import process_call_ended, send_sms_confirmation

logger = structlog.get_logger()

router = APIRouter(prefix="/retell", tags=["retell"])

# ── Nonce TTL for webhook replay protection (seconds) ─────────────────────────
_NONCE_TTL = 3600  # 1 hour


async def _check_replay(call_id: str, event: str) -> bool:
    """Return True if request is a replay (already seen). Store nonce in Redis."""
    try:
        import redis.asyncio as aioredis
        r = aioredis.from_url(settings.REDIS_URL, socket_connect_timeout=2)
        key = f"retell:nonce:{call_id}:{event}"
        added = await r.set(key, "1", ex=_NONCE_TTL, nx=True)  # nx=True means only set if not exists
        await r.aclose()
        return added is None  # None means key already existed → replay
    except Exception as exc:
        # If Redis is unavailable, allow the request but log the warning
        logger.warning("retell_nonce_redis_unavailable", error=str(exc))
        return False


async def _verify_tool_request(request: Request) -> bytes:
    """Validate Retell HMAC signature on tool requests. Returns raw body."""
    body = await request.body()
    signature = request.headers.get("X-Retell-Signature", "")
    if not retell_service.verify_webhook_signature(body, signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid signature",
        )
    return body


def _require_metadata_doctor_id(metadata: dict) -> str:
    """Extract doctor_id from trusted call metadata only. Never from AI-supplied args."""
    doctor_id = metadata.get("doctor_id")
    if not doctor_id:
        raise ValueError("Authorization context missing — doctor_id not in call metadata")
    try:
        UUID(str(doctor_id))
    except (ValueError, AttributeError):
        raise ValueError("Invalid authorization context")
    return str(doctor_id)


def _ok(result: dict) -> dict:
    return {"result": result}


def _err(message: str) -> dict:
    return {"result": {"error": message, "success": False}}


async def _get_doctor_and_config(
    doctor_id: str, db: AsyncSession
) -> tuple[Doctor, AgentConfig, CalendarIntegration | None]:
    try:
        uid = UUID(doctor_id)
    except (ValueError, AttributeError):
        raise ValueError("Invalid doctor_id")

    result = await db.execute(select(Doctor).where(Doctor.id == uid))
    doctor = result.scalar_one_or_none()
    if not doctor:
        raise ValueError("Doctor not found")

    config_result = await db.execute(
        select(AgentConfig).where(AgentConfig.doctor_id == uid)
    )
    config = config_result.scalar_one_or_none()
    if not config:
        raise ValueError("Agent config not found")

    cal_result = await db.execute(
        select(CalendarIntegration).where(CalendarIntegration.doctor_id == uid)
    )
    cal = cal_result.scalar_one_or_none()

    return doctor, config, cal


@router.post("/webhook")
async def retell_webhook(request: Request):
    body = await request.body()
    signature = request.headers.get("X-Retell-Signature", "")

    if not retell_service.verify_webhook_signature(body, signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid signature")

    try:
        data = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON payload")

    event_type = data.get("event", "")
    call_data = data.get("call", {})
    retell_call_id = call_data.get("call_id")
    from_number = call_data.get("from_number")
    agent_id = call_data.get("agent_id")

    # Replay protection: reject duplicate call_id+event combinations
    if retell_call_id and event_type:
        if await _check_replay(retell_call_id, event_type):
            logger.warning("retell_webhook_replay_detected", call_id=retell_call_id, event=event_type)
            return {"received": True}

    async with AsyncSessionLocal() as db:
        if event_type == "call_started":
            doctor_result = await db.execute(
                select(Doctor).join(AgentConfig).where(
                    AgentConfig.retell_agent_id == agent_id
                )
            )
            doctor = doctor_result.scalar_one_or_none()
            if not doctor:
                logger.warning("retell_webhook_unknown_agent", agent_id=agent_id)
                return {"received": True}

            started_at_raw = call_data.get("start_timestamp")
            started_at = (
                datetime.fromtimestamp(started_at_raw / 1000, tz=timezone.utc)
                if started_at_raw
                else datetime.now(timezone.utc)
            )

            call_log = CallLog(
                doctor_id=doctor.id,
                retell_call_id=retell_call_id,
                caller_phone=from_number,
                outcome=CallOutcome.failed,
                started_at=started_at,
            )
            db.add(call_log)
            try:
                await db.commit()
                logger.info("call_started", retell_call_id=retell_call_id)
            except Exception as exc:
                await db.rollback()
                logger.error("call_started_db_error", error=str(exc))

        elif event_type == "call_ended":
            result = await db.execute(
                select(CallLog).where(CallLog.retell_call_id == retell_call_id)
            )
            call_log = result.scalar_one_or_none()
            if not call_log:
                logger.warning("call_ended_not_found", retell_call_id=retell_call_id)
                return {"received": True}

            duration_ms = data.get("duration_ms")
            duration_sec = data.get("duration_seconds")
            if duration_ms is not None:
                call_log.duration_seconds = int(duration_ms) // 1000
            elif duration_sec is not None:
                call_log.duration_seconds = int(duration_sec)
            call_log.transcript = data.get("transcript")
            call_log.recording_url = data.get("recording_url")

            ended_raw = data.get("end_timestamp") or call_data.get("end_timestamp")
            if ended_raw:
                call_log.ended_at = datetime.fromtimestamp(ended_raw / 1000, tz=timezone.utc)
            else:
                call_log.ended_at = datetime.now(timezone.utc)

            analysis = data.get("call_analysis", {}) or {}
            call_successful = analysis.get("call_successful")
            custom = analysis.get("custom_analysis_data", {}) or {}
            outcome_str = custom.get("outcome", "")

            outcome_map = {
                "booked": CallOutcome.booked,
                "enquiry": CallOutcome.enquiry,
                "cancelled": CallOutcome.cancelled,
                "rescheduled": CallOutcome.rescheduled,
                "transferred": CallOutcome.transferred,
                "unanswered": CallOutcome.unanswered,
            }
            call_log.outcome = outcome_map.get(outcome_str, CallOutcome.failed)

            try:
                await db.commit()
                process_call_ended.delay(str(call_log.id))
                logger.info("call_ended", retell_call_id=retell_call_id, outcome=call_log.outcome)
            except Exception as exc:
                await db.rollback()
                logger.error("call_ended_db_error", error=str(exc))

        elif event_type == "call_analyzed":
            result = await db.execute(
                select(CallLog).where(CallLog.retell_call_id == retell_call_id)
            )
            call_log = result.scalar_one_or_none()
            if call_log:
                analysis = data.get("call_analysis", {}) or {}
                call_log.agent_summary = analysis.get("call_summary")
                try:
                    await db.commit()
                except Exception as exc:
                    await db.rollback()
                    logger.error("call_analyzed_db_error", error=str(exc))

    return {"received": True}


@router.post("/tools/check-availability")
async def tool_check_availability(request: Request):
    try:
        body = await _verify_tool_request(request)
        payload = CheckAvailabilityToolRequest.model_validate(json.loads(body))
    except HTTPException:
        raise
    except ValidationError as exc:
        return _err(exc.errors()[0]["msg"])
    except Exception:
        return _err("Invalid request body")

    metadata = payload.call.metadata or {}

    try:
        doctor_id = _require_metadata_doctor_id(metadata)
    except ValueError as exc:
        return _err(str(exc))

    date = payload.args.date
    preferred_time = payload.args.preferred_time

    try:
        async with AsyncSessionLocal() as db:
            doctor, config, cal = await _get_doctor_and_config(doctor_id, db)

            if not cal or not cal.is_connected:
                return _ok({
                    "slots": [],
                    "date": date,
                    "timezone": config.timezone,
                    "message": "Calendar not connected",
                })

            slots = await calendar_service.get_free_slots(
                doctor_id=doctor.id,
                date=date,
                slot_duration_mins=config.slot_duration_mins,
                buffer_mins=config.buffer_mins,
                working_hours=config.working_hours,
                preferred_time=preferred_time,
                calendar_id=cal.google_calendar_id or "primary",
                db=db,
                doctor_timezone=config.timezone,
            )

            message = None if slots else "No slots available on this date. Please try another date."
            return _ok({
                "slots": slots,
                "date": date,
                "timezone": config.timezone,
                "message": message,
            })
    except ValueError as exc:
        return _err(str(exc))
    except Exception as exc:
        logger.error("tool_check_availability_error", error=str(exc))
        return _err("Internal error checking availability")


@router.post("/tools/create-booking")
async def tool_create_booking(request: Request):
    try:
        body = await _verify_tool_request(request)
        payload = CreateBookingToolRequest.model_validate(json.loads(body))
    except HTTPException:
        raise
    except ValidationError as exc:
        return _err(exc.errors()[0]["msg"])
    except Exception:
        return _err("Invalid request body")

    metadata = payload.call.metadata or {}

    try:
        doctor_id = _require_metadata_doctor_id(metadata)
    except ValueError as exc:
        return _err(str(exc))

    retell_call_id = payload.call.call_id
    patient_name = payload.args.patient_name
    patient_phone = payload.args.patient_phone
    slot_dt = payload.args.slot_datetime
    reason = payload.args.reason
    if slot_dt.tzinfo is None or slot_dt.utcoffset() is None:
        slot_dt = slot_dt.replace(tzinfo=timezone.utc)

    try:
        async with AsyncSessionLocal() as db:
            doctor, config, cal = await _get_doctor_and_config(doctor_id, db)
            slot_end = slot_dt + timedelta(minutes=config.slot_duration_mins)

            call_log_id = None
            if retell_call_id:
                cl_result = await db.execute(
                    select(CallLog).where(CallLog.retell_call_id == retell_call_id)
                )
                cl = cl_result.scalar_one_or_none()
                if cl:
                    call_log_id = cl.id

            booking = await booking_service.create_booking(
                doctor_id=doctor.id,
                patient_name=patient_name,
                patient_phone=patient_phone,
                appointment_start=slot_dt,
                appointment_end=slot_end,
                reason=reason,
                call_log_id=call_log_id,
                db=db,
            )

            if call_log_id:
                cl_update_result = await db.execute(
                    select(CallLog).where(CallLog.id == call_log_id)
                )
                cl_update = cl_update_result.scalar_one_or_none()
                if cl_update:
                    cl_update.outcome = CallOutcome.booked
                    await db.commit()

            send_sms_confirmation.delay(str(booking.id))

            try:
                doctor_tz = ZoneInfo(config.timezone)
            except (ZoneInfoNotFoundError, KeyError):
                doctor_tz = ZoneInfo("UTC")
            local_dt = slot_dt.astimezone(doctor_tz)
            readable_dt = local_dt.strftime("%B %-d at %-I:%M %p")

            return _ok({
                "booking_id": str(booking.id),
                "confirmed": True,
                "appointment_datetime": readable_dt,
                "message": f"Appointment booked successfully for {readable_dt}.",
            })

    except HTTPException as exc:
        return _err(exc.detail)
    except ValueError as exc:
        return _err(str(exc))
    except Exception as exc:
        logger.error("tool_create_booking_error", error=str(exc))
        return _err("Internal error creating booking")


@router.post("/tools/get-patient-bookings")
async def tool_get_patient_bookings(request: Request):
    try:
        body = await _verify_tool_request(request)
        payload = GetPatientBookingsToolRequest.model_validate(json.loads(body))
    except HTTPException:
        raise
    except ValidationError as exc:
        return _err(exc.errors()[0]["msg"])
    except Exception:
        return _err("Invalid request body")

    metadata = payload.call.metadata or {}

    try:
        doctor_id = _require_metadata_doctor_id(metadata)
    except ValueError as exc:
        return _err(str(exc))

    patient_phone = payload.args.patient_phone

    try:
        async with AsyncSessionLocal() as db:
            try:
                uid = UUID(doctor_id)
            except ValueError:
                return _err("Invalid doctor_id")

            result = await db.execute(
                select(Booking)
                .where(
                    and_(
                        Booking.doctor_id == uid,
                        Booking.patient_phone == patient_phone,
                        Booking.status.notin_([BookingStatus.cancelled]),
                    )
                )
                .order_by(Booking.appointment_start.desc())
                .limit(3)
            )
            bookings = list(result.scalars().all())

            patient_name = bookings[0].patient_name if bookings else None
            simplified = [
                {
                    "id": str(b.id),
                    "appointment_start": b.appointment_start.isoformat(),
                    "appointment_end": b.appointment_end.isoformat(),
                    "status": b.status.value,
                    "reason": b.reason,
                }
                for b in bookings
            ]

            return _ok({"bookings": simplified, "patient_name": patient_name})

    except Exception as exc:
        logger.error("tool_get_patient_bookings_error", error=str(exc))
        return _err("Internal error fetching patient bookings")


@router.post("/tools/cancel-booking")
async def tool_cancel_booking(request: Request):
    try:
        body = await _verify_tool_request(request)
        payload = CancelBookingToolRequest.model_validate(json.loads(body))
    except HTTPException:
        raise
    except ValidationError as exc:
        return _err(exc.errors()[0]["msg"])
    except Exception:
        return _err("Invalid request body")

    metadata = payload.call.metadata or {}

    # doctor_id MUST come from trusted call metadata only — never from AI-supplied args
    try:
        doctor_id = _require_metadata_doctor_id(metadata)
        doctor_uid = UUID(doctor_id)
    except ValueError as exc:
        return _err(str(exc))

    booking_uid = payload.args.booking_id
    booking_id_str = str(booking_uid)

    try:
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Booking).where(Booking.id == booking_uid))
            booking = result.scalar_one_or_none()
            if not booking:
                return _err("Booking not found")

            # Mandatory ownership check — no optional bypass
            if booking.doctor_id != doctor_uid:
                logger.warning(
                    "retell_cancel_booking_ownership_violation",
                    booking_id=booking_id_str,
                    booking_doctor=str(booking.doctor_id),
                    caller_doctor=doctor_id,
                )
                return _err("Booking does not belong to this doctor")

            await booking_service.cancel_booking(booking_uid, doctor_uid, db)

            return _ok({
                "success": True,
                "booking_id": booking_id_str,
                "message": "Appointment cancelled successfully.",
            })

    except HTTPException as exc:
        return _err(exc.detail)
    except Exception as exc:
        logger.error("tool_cancel_booking_error", error=str(exc))
        return _err("Internal error cancelling booking")
