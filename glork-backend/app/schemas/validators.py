from __future__ import annotations

import re
from typing import Annotated

from pydantic import AfterValidator, BeforeValidator, Field

_PHONE_RE = re.compile(r"^\+?\d{7,15}$")


def _strip_str(v: object) -> object:
    return v.strip() if isinstance(v, str) else v


def _validate_phone(v: str) -> str:
    normalized = re.sub(r"[\s\-\(\)\.x#]", "", v)
    if not _PHONE_RE.match(normalized):
        raise ValueError(
            "Invalid phone number. Provide a 7-15 digit number, "
            "optionally starting with + (e.g., +919876543210)."
        )
    return normalized


PhoneNumber = Annotated[str, AfterValidator(_validate_phone)]
PersonName = Annotated[str, BeforeValidator(_strip_str), Field(min_length=1, max_length=100)]
ClinicName = Annotated[str, BeforeValidator(_strip_str), Field(min_length=1, max_length=100)]

SlotDurationMins = Annotated[int, Field(ge=5, le=180)]
BufferMins = Annotated[int, Field(ge=0, le=60)]
MaxAdvanceBookingDays = Annotated[int, Field(ge=1, le=365)]
