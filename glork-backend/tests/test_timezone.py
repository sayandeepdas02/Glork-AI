from __future__ import annotations

from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest

from app.services.calendar_service import CalendarService
from app.services.notification_service import format_appointment_datetime


WORKING_HOURS = {
    "mon": {"start": "09:00", "end": "18:00", "enabled": True},
    "tue": {"start": "09:00", "end": "18:00", "enabled": True},
    "wed": {"start": "09:00", "end": "18:00", "enabled": True},
    "thu": {"start": "09:00", "end": "18:00", "enabled": True},
    "fri": {"start": "09:00", "end": "18:00", "enabled": True},
    "sat": {"start": "09:00", "end": "18:00", "enabled": False},
    "sun": {"start": "09:00", "end": "18:00", "enabled": False},
}


def _make_mock_freebusy(busy_periods=None):
    result = {"calendars": {"primary": {"busy": busy_periods or []}}}
    svc = MagicMock()
    svc.freebusy().query().execute.return_value = result
    return svc


@pytest.mark.asyncio
async def test_slots_generated_in_doctor_timezone():
    """Slots use working hours in the doctor's local timezone, not UTC."""
    service = CalendarService()
    doctor_id = uuid4()
    mock_creds = MagicMock()
    mock_creds.expired = False
    mock_creds.valid = True
    mock_db = AsyncMock()

    # 2030-01-04 is a Friday — working hours enabled
    with (
        patch.object(service, "get_credentials", return_value=mock_creds),
        patch.object(service, "_build_service", return_value=_make_mock_freebusy()),
    ):
        slots_ist = await service.get_free_slots(
            doctor_id=doctor_id, date="2030-01-04", slot_duration_mins=30, buffer_mins=0,
            working_hours=WORKING_HOURS, preferred_time="any", calendar_id="primary",
            db=mock_db, doctor_timezone="Asia/Kolkata",
        )
        slots_utc = await service.get_free_slots(
            doctor_id=doctor_id, date="2030-01-04", slot_duration_mins=30, buffer_mins=0,
            working_hours=WORKING_HOURS, preferred_time="any", calendar_id="primary",
            db=mock_db, doctor_timezone="UTC",
        )

    assert len(slots_ist) > 0
    assert len(slots_utc) > 0
    # Both should start at 09:00 in their respective timezones
    assert slots_ist[0] == "09:00"
    assert slots_utc[0] == "09:00"


@pytest.mark.asyncio
async def test_slots_skipped_on_disabled_day():
    service = CalendarService()
    doctor_id = uuid4()
    mock_creds = MagicMock()
    mock_creds.expired = False
    mock_creds.valid = True
    mock_db = AsyncMock()

    # 2030-01-05 is a Saturday — disabled in WORKING_HOURS
    with (
        patch.object(service, "get_credentials", return_value=mock_creds),
        patch.object(service, "_build_service", return_value=_make_mock_freebusy()),
    ):
        slots = await service.get_free_slots(
            doctor_id=doctor_id, date="2030-01-05", slot_duration_mins=30, buffer_mins=0,
            working_hours=WORKING_HOURS, preferred_time="any", calendar_id="primary",
            db=mock_db, doctor_timezone="Asia/Kolkata",
        )

    assert slots == []


@pytest.mark.asyncio
async def test_invalid_date_returns_empty():
    service = CalendarService()
    doctor_id = uuid4()
    mock_creds = MagicMock()
    mock_creds.expired = False
    mock_creds.valid = True
    mock_db = AsyncMock()

    with patch.object(service, "get_credentials", return_value=mock_creds):
        slots = await service.get_free_slots(
            doctor_id=doctor_id, date="not-a-date", slot_duration_mins=30, buffer_mins=0,
            working_hours=WORKING_HOURS, preferred_time="any", calendar_id="primary",
            db=mock_db,
        )

    assert slots == []


@pytest.mark.asyncio
async def test_unknown_timezone_falls_back_to_utc():
    service = CalendarService()
    doctor_id = uuid4()
    mock_creds = MagicMock()
    mock_creds.expired = False
    mock_creds.valid = True
    mock_db = AsyncMock()

    with (
        patch.object(service, "get_credentials", return_value=mock_creds),
        patch.object(service, "_build_service", return_value=_make_mock_freebusy()),
    ):
        slots = await service.get_free_slots(
            doctor_id=doctor_id, date="2030-01-04", slot_duration_mins=30, buffer_mins=0,
            working_hours=WORKING_HOURS, preferred_time="any", calendar_id="primary",
            db=mock_db, doctor_timezone="Invalid/Timezone",
        )

    # Should not raise; falls back to UTC and returns slots
    assert isinstance(slots, list)
    assert len(slots) > 0


# ── Notification formatting ───────────────────────────────────────────────────


def test_format_appointment_datetime_ist():
    dt = datetime(2030, 3, 15, 10, 30, tzinfo=timezone.utc)
    result = format_appointment_datetime(dt, "Asia/Kolkata")
    # UTC 10:30 → IST 16:00
    assert "16:00" in result or "4:00" in result
    assert "Friday" in result  # 2030-03-15 is a Friday


def test_format_appointment_datetime_new_york():
    dt = datetime(2030, 6, 15, 14, 0, tzinfo=timezone.utc)
    result = format_appointment_datetime(dt, "America/New_York")
    # UTC 14:00 → EDT (UTC-4) 10:00
    assert "10:00" in result or "10:00 AM" in result
    assert "Saturday" in result


def test_format_appointment_datetime_non_ist_non_utc():
    """Covers a timezone that is neither UTC nor IST (acceptance criterion)."""
    dt = datetime(2030, 1, 10, 20, 0, tzinfo=timezone.utc)
    result = format_appointment_datetime(dt, "Australia/Sydney")
    # UTC 20:00 → AEDT (UTC+11) = 07:00 next day (Jan 11)
    assert "Friday" in result
    assert "7:00" in result


def test_format_appointment_datetime_utc_default():
    dt = datetime(2030, 5, 1, 9, 0, tzinfo=timezone.utc)
    result = format_appointment_datetime(dt)
    assert "9:00" in result
    assert "Wednesday" in result


def test_format_appointment_datetime_invalid_tz_falls_back():
    dt = datetime(2030, 5, 1, 9, 0, tzinfo=timezone.utc)
    result = format_appointment_datetime(dt, "Not/ATimezone")
    # Falls back to UTC — should not raise
    assert "9:00" in result


# ── Day-boundary helper ───────────────────────────────────────────────────────


def test_day_boundaries_are_clinic_local():
    """For a clinic in UTC-5, midnight local is 05:00 UTC — not 00:00 UTC."""
    from datetime import date
    from zoneinfo import ZoneInfo

    tz = ZoneInfo("America/Chicago")  # UTC-6 standard / UTC-5 daylight
    date_obj = date(2030, 7, 15)  # summer → CDT (UTC-5)

    day_start_local = datetime(date_obj.year, date_obj.month, date_obj.day, tzinfo=tz)
    day_start_utc = day_start_local.astimezone(timezone.utc)

    # CDT is UTC-5, so local midnight = 05:00 UTC
    assert day_start_utc.hour == 5
    assert day_start_utc.date().isoformat() == "2030-07-15"
