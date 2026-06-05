from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch
from uuid import uuid4

import pytest

from app.services.calendar_service import CalendarService


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
