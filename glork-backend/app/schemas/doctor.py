from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.schemas.agent_config import AgentConfigResponse
from app.schemas.validators import ClinicName, PersonName


class DoctorUpdate(BaseModel):
    name: PersonName | None = None
    clinic_name: ClinicName | None = None
    phone_number: str | None = None
    specialty: str | None = None
    clinic_address: str | None = None


class DoctorResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    name: str
    clinic_name: str
    phone_number: str | None = None
    specialty: str | None = None
    clinic_address: str | None = None
    is_active: bool
    is_agent_active: bool
    created_at: datetime
    updated_at: datetime | None = None
    agent_config: AgentConfigResponse | None = None
    calendar_connected: bool = False


class AgentToggleResponse(BaseModel):
    is_agent_active: bool
    message: str
