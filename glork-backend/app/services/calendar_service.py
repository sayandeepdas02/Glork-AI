from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import UUID
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

import structlog
from fastapi import HTTPException, status
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.core.encryption import decrypt, encrypt
from app.models.calendar_integration import CalendarIntegration

logger = structlog.get_logger()

SCOPES = [
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.readonly",
]

DAY_KEY_MAP = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

PREFERRED_TIME_WINDOWS = {
    "morning": (9, 12),
    "afternoon": (12, 17),
    "evening": (17, 20),
    "any": (0, 24),
}


class CalendarService:
    async def get_integration(self, doctor_id: UUID, db: AsyncSession) -> CalendarIntegration:
        result = await db.execute(
            select(CalendarIntegration).where(CalendarIntegration.doctor_id == doctor_id)
        )
        integration = result.scalar_one_or_none()
        if not integration or not integration.is_connected:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Google Calendar not connected",
            )
        return integration

    async def get_credentials(self, doctor_id: UUID, db: AsyncSession) -> Credentials:
        integration = await self.get_integration(doctor_id, db)

        if not integration.access_token_encrypted or not integration.refresh_token_encrypted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Calendar tokens missing",
            )

        access_token = decrypt(integration.access_token_encrypted)
        refresh_token = decrypt(integration.refresh_token_encrypted)

        creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=settings.GOOGLE_CLIENT_ID,
            client_secret=settings.GOOGLE_CLIENT_SECRET,
            scopes=SCOPES,
        )

        if integration.token_expiry:
            expiry = integration.token_expiry
            if expiry.tzinfo is None:
                expiry = expiry.replace(tzinfo=timezone.utc)
            creds.expiry = expiry

        if creds.expired or not creds.valid:
            # Re-fetch with row lock to prevent concurrent refreshes from overwriting each other
            locked = await db.execute(
                select(CalendarIntegration)
                .where(CalendarIntegration.doctor_id == doctor_id)
                .with_for_update()
            )
            integration = locked.scalar_one_or_none()
            if not integration:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Calendar not connected")

            # Re-check expiry after acquiring lock — another worker may have already refreshed
            if integration.token_expiry:
                fresh_expiry = integration.token_expiry
                if fresh_expiry.tzinfo is None:
                    fresh_expiry = fresh_expiry.replace(tzinfo=timezone.utc)
                creds.expiry = fresh_expiry

            if creds.expired or not creds.valid:
                try:
                    loop = asyncio.get_event_loop()
                    await loop.run_in_executor(None, lambda: creds.refresh(Request()))

                    integration.access_token_encrypted = encrypt(creds.token)
                    # Persist rotated refresh token if Google issued a new one
                    if creds.refresh_token:
                        integration.refresh_token_encrypted = encrypt(creds.refresh_token)
                    if creds.expiry:
                        expiry = creds.expiry
                        if expiry.tzinfo is None:
                            expiry = expiry.replace(tzinfo=timezone.utc)
                        integration.token_expiry = expiry
                    await db.commit()
                    await db.refresh(integration)
                except Exception as exc:
                    logger.error("calendar_token_refresh_failed", doctor_id=str(doctor_id), error=str(exc))
                    integration.is_connected = False
                    await db.commit()
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Failed to refresh Google Calendar token. Please reconnect.",
                    )

        return creds

    def _build_service(self, creds: Credentials):
        return build("calendar", "v3", credentials=creds, cache_discovery=False)

    async def get_free_slots(
        self,
        doctor_id: UUID,
        date: str,
        slot_duration_mins: int,
        buffer_mins: int,
        working_hours: dict,
        preferred_time: str,
        calendar_id: str,
        db: AsyncSession,
        doctor_timezone: str = "Asia/Kolkata",
    ) -> list[str]:
        try:
            creds = await self.get_credentials(doctor_id, db)
        except HTTPException:
            return []

        try:
            date_obj = datetime.strptime(date, "%Y-%m-%d").date()
        except ValueError:
            return []

        day_key = DAY_KEY_MAP[date_obj.weekday()]
        day_config = working_hours.get(day_key, {})

        if not day_config.get("enabled", False):
            return []

        try:
            work_start_h, work_start_m = map(int, day_config["start"].split(":"))
            work_end_h, work_end_m = map(int, day_config["end"].split(":"))
        except (KeyError, ValueError):
            return []

        try:
            tz = ZoneInfo(doctor_timezone)
        except (ZoneInfoNotFoundError, KeyError):
            logger.warning("unknown_timezone", timezone=doctor_timezone)
            tz = ZoneInfo("UTC")

        # Freebusy query covers full day in doctor's local timezone
        day_start = datetime(date_obj.year, date_obj.month, date_obj.day, 0, 0, 0, tzinfo=tz)
        day_end = datetime(date_obj.year, date_obj.month, date_obj.day, 23, 59, 59, tzinfo=tz)

        try:
            loop = asyncio.get_event_loop()
            service = await loop.run_in_executor(None, lambda: self._build_service(creds))

            freebusy_body = {
                "timeMin": day_start.isoformat(),
                "timeMax": day_end.isoformat(),
                "items": [{"id": calendar_id}],
            }

            def _query_freebusy():
                return service.freebusy().query(body=freebusy_body).execute()

            freebusy_result = await loop.run_in_executor(None, _query_freebusy)
            busy_periods = freebusy_result.get("calendars", {}).get(calendar_id, {}).get("busy", [])
        except HttpError as exc:
            logger.error("freebusy_query_failed", doctor_id=str(doctor_id), error=str(exc))
            return []

        busy_ranges = []
        for period in busy_periods:
            bs = datetime.fromisoformat(period["start"].replace("Z", "+00:00"))
            be = datetime.fromisoformat(period["end"].replace("Z", "+00:00"))
            busy_ranges.append((bs, be))

        # Working hours expressed in doctor's local timezone
        work_start = datetime(
            date_obj.year, date_obj.month, date_obj.day,
            work_start_h, work_start_m, tzinfo=tz
        )
        work_end = datetime(
            date_obj.year, date_obj.month, date_obj.day,
            work_end_h, work_end_m, tzinfo=tz
        )

        pref_start_h, pref_end_h = PREFERRED_TIME_WINDOWS.get(preferred_time, (0, 24))

        now = datetime.now(tz)
        slots = []
        current = work_start

        while current + timedelta(minutes=slot_duration_mins) <= work_end:
            slot_end = current + timedelta(minutes=slot_duration_mins)
            buffered_end = slot_end + timedelta(minutes=buffer_mins)

            if current <= now:
                current += timedelta(minutes=slot_duration_mins)
                continue

            if not (pref_start_h <= current.hour < pref_end_h):
                current += timedelta(minutes=slot_duration_mins)
                continue

            overlaps = any(
                current < (be + timedelta(minutes=buffer_mins)) and buffered_end > bs
                for bs, be in busy_ranges
            )

            if not overlaps:
                slots.append(current.strftime("%H:%M"))

            current += timedelta(minutes=slot_duration_mins)

        return slots[:5]

    async def create_event(
        self,
        doctor_id: UUID,
        patient_name: str,
        patient_phone: str,
        start_datetime: datetime,
        end_datetime: datetime,
        reason: str | None,
        calendar_id: str,
        db: AsyncSession,
    ) -> str:
        creds = await self.get_credentials(doctor_id, db)

        event = {
            "summary": f"Appointment: {patient_name}",
            "description": (
                f"Patient: {patient_name}\n"
                f"Phone: {patient_phone[-4:].rjust(len(patient_phone), '*')}\n"
                f"Reason: {reason or 'General consultation'}"
            ),
            "start": {
                "dateTime": start_datetime.isoformat(),
                "timeZone": "UTC",
            },
            "end": {
                "dateTime": end_datetime.isoformat(),
                "timeZone": "UTC",
            },
            "reminders": {
                "useDefault": False,
                "overrides": [{"method": "popup", "minutes": 30}],
            },
        }

        try:
            loop = asyncio.get_event_loop()
            service = await loop.run_in_executor(None, lambda: self._build_service(creds))

            def _insert():
                return service.events().insert(calendarId=calendar_id, body=event).execute()

            created_event = await loop.run_in_executor(None, _insert)
            return created_event["id"]
        except HttpError as exc:
            logger.error("calendar_event_create_failed", doctor_id=str(doctor_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to create Google Calendar event",
            )

    async def delete_event(
        self, doctor_id: UUID, event_id: str, calendar_id: str, db: AsyncSession
    ) -> bool:
        try:
            creds = await self.get_credentials(doctor_id, db)
            loop = asyncio.get_event_loop()
            service = await loop.run_in_executor(None, lambda: self._build_service(creds))

            def _delete():
                service.events().delete(calendarId=calendar_id, eventId=event_id).execute()

            await loop.run_in_executor(None, _delete)
            return True
        except HttpError as exc:
            if exc.resp.status == 404:
                return False
            logger.error("calendar_event_delete_failed", event_id=event_id, error=str(exc))
            return False
        except Exception as exc:
            logger.error("calendar_event_delete_error", event_id=event_id, error=str(exc))
            return False

    async def update_event(
        self,
        doctor_id: UUID,
        event_id: str,
        start: datetime,
        end: datetime,
        calendar_id: str,
        db: AsyncSession,
    ) -> bool:
        try:
            creds = await self.get_credentials(doctor_id, db)
            loop = asyncio.get_event_loop()
            service = await loop.run_in_executor(None, lambda: self._build_service(creds))

            def _get():
                return service.events().get(calendarId=calendar_id, eventId=event_id).execute()

            event = await loop.run_in_executor(None, _get)
            event["start"] = {"dateTime": start.isoformat(), "timeZone": "UTC"}
            event["end"] = {"dateTime": end.isoformat(), "timeZone": "UTC"}

            def _update():
                return (
                    service.events()
                    .update(calendarId=calendar_id, eventId=event_id, body=event)
                    .execute()
                )

            await loop.run_in_executor(None, _update)
            return True
        except HttpError as exc:
            logger.error("calendar_event_update_failed", event_id=event_id, error=str(exc))
            return False

    async def list_calendars(self, doctor_id: UUID, db: AsyncSession) -> list[dict]:
        creds = await self.get_credentials(doctor_id, db)
        loop = asyncio.get_event_loop()
        service = await loop.run_in_executor(None, lambda: self._build_service(creds))

        def _list():
            return service.calendarList().list().execute()

        try:
            result = await loop.run_in_executor(None, _list)
            calendars = []
            for item in result.get("items", []):
                calendars.append({
                    "id": item["id"],
                    "name": item.get("summary", item["id"]),
                    "primary": item.get("primary", False),
                })
            return calendars
        except HttpError as exc:
            logger.error("calendar_list_failed", doctor_id=str(doctor_id), error=str(exc))
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Failed to list Google Calendars",
            )

    async def get_calendar_name(self, doctor_id: UUID, calendar_id: str, db: AsyncSession) -> str | None:
        try:
            creds = await self.get_credentials(doctor_id, db)
            loop = asyncio.get_event_loop()
            service = await loop.run_in_executor(None, lambda: self._build_service(creds))

            def _get():
                return service.calendarList().get(calendarId=calendar_id).execute()

            cal = await loop.run_in_executor(None, _get)
            return cal.get("summary")
        except Exception:
            return None


calendar_service = CalendarService()
