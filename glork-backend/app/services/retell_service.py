from __future__ import annotations

import hashlib
import hmac
from typing import Any

import httpx
import structlog

from app.config import settings
from app.models.agent_config import AgentConfig
from app.models.doctor import Doctor

logger = structlog.get_logger()

RETELL_BASE_URL = "https://api.retellai.com"


class RetellService:
    def _headers(self) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {settings.RETELL_API_KEY}",
            "Content-Type": "application/json",
        }

    def build_system_prompt(self, doctor: Doctor, agent_config: AgentConfig) -> str:
        language_instructions = {
            "en": "Communicate exclusively in English.",
            "hi": "Communicate in Hindi. Hinglish (mixing Hindi and English) is acceptable and often preferred.",
            "ta": "Communicate in Tamil. Use polite and formal Tamil.",
        }

        day_map = {
            "mon": "Monday", "tue": "Tuesday", "wed": "Wednesday",
            "thu": "Thursday", "fri": "Friday", "sat": "Saturday", "sun": "Sunday",
        }

        working_hours_lines = []
        for day_key, hours in agent_config.working_hours.items():
            if hours.get("enabled"):
                working_hours_lines.append(
                    f"  - {day_map.get(day_key, day_key)}: {hours['start']} to {hours['end']}"
                )
        working_hours_text = "\n".join(working_hours_lines) if working_hours_lines else "  - Not available"

        language_instruction = language_instructions.get(agent_config.language, language_instructions["en"])

        prompt = f"""You are an AI receptionist for {doctor.clinic_name}, managed by Dr. {doctor.name}.

ROLE AND PERSONALITY:
- You are professional, warm, empathetic, and concise. This is a voice call, so keep responses short and natural.
- Never use markdown, bullet points, or lists in your responses. Speak naturally.
- Do not repeat yourself unnecessarily.
- {language_instruction}

CLINIC INFORMATION:
- Clinic Name: {doctor.clinic_name}
- Doctor: Dr. {doctor.name}
{f"- Specialty: {doctor.specialty}" if doctor.specialty else ""}
{f"- Address: {doctor.clinic_address}" if doctor.clinic_address else ""}
- Appointment Duration: {agent_config.slot_duration_mins} minutes per appointment

WORKING HOURS:
{working_hours_text}

CAPABILITIES:
You can help patients with:
1. Booking a new appointment
2. Rescheduling an existing appointment
3. Cancelling an existing appointment
4. Answering general questions about the clinic

BOOKING FLOW - ALWAYS follow this order:
1. Greet the patient warmly and ask how you can help.
2. If they want an appointment, ask for the purpose/reason of their visit.
3. Ask for their preferred date (and morning/afternoon/evening preference if not specified).
4. ALWAYS call check_availability before offering any time slots. NEVER make up slots.
5. Offer up to 3 available slots from the results. If no slots are available, suggest a different date.
6. Once the patient selects a slot, ask for their full name and phone number (if not already known).
7. Confirm all details with the patient before booking.
8. Call create_booking to finalize.
9. End with: "Your appointment is confirmed. You'll receive an SMS confirmation shortly. Is there anything else I can help you with?"

RETURNING PATIENT FLOW:
- When a patient calls, call get_patient_bookings with their phone number (available in call metadata as from_number).
- If they are a returning patient, greet them by name and offer to help with their existing appointment or book a new one.

CANCELLATION FLOW:
- Retrieve their existing bookings using get_patient_bookings.
- Confirm which appointment to cancel.
- Call cancel_booking to process the cancellation.
- Confirm cancellation to the patient.

EMERGENCY HANDLING:
- If the patient mentions chest pain, difficulty breathing, severe bleeding, loss of consciousness, or any life-threatening emergency, immediately say: "This sounds like a medical emergency. Please call emergency services at 112 immediately. I am transferring you now." Then end the call.
{f"- For urgent but non-emergency situations, offer to transfer: 'Let me transfer you to someone who can help immediately.' Transfer to {agent_config.emergency_transfer_number}." if agent_config.emergency_transfer_number else ""}

IMPORTANT RULES:
- NEVER confirm a slot without calling check_availability first.
- NEVER invent appointment times. Only use slots returned by check_availability.
- If the patient requests a date more than {agent_config.max_advance_booking_days} days in advance, politely decline and ask for a closer date.
- Keep responses under 3 sentences for voice clarity.
- If unsure, ask a clarifying question rather than guessing.
"""
        return prompt.strip()

    def build_tool_definitions(self, tools_base_url: str, doctor_id: str) -> list[dict]:
        base = tools_base_url.rstrip("/")
        return [
            {
                "type": "webhook",
                "name": "check_availability",
                "description": (
                    "Check available appointment slots for a given date. "
                    "MUST be called before offering any time slots to the patient."
                ),
                "url": f"{base}/api/v1/retell/tools/check-availability",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "date": {
                            "type": "string",
                            "description": "Date in YYYY-MM-DD format, e.g. 2025-06-15",
                        },
                        "preferred_time": {
                            "type": "string",
                            "enum": ["morning", "afternoon", "evening", "any"],
                            "description": "Patient's preferred time of day",
                        },
                    },
                    "required": ["date"],
                },
                "metadata": {"doctor_id": doctor_id},
            },
            {
                "type": "webhook",
                "name": "create_booking",
                "description": "Create a confirmed appointment booking after the patient agrees to a specific slot.",
                "url": f"{base}/api/v1/retell/tools/create-booking",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "patient_name": {
                            "type": "string",
                            "description": "Full name of the patient",
                        },
                        "patient_phone": {
                            "type": "string",
                            "description": "Patient's phone number with country code",
                        },
                        "slot_datetime": {
                            "type": "string",
                            "description": "ISO 8601 datetime of the appointment, e.g. 2025-06-15T10:00:00+05:30",
                        },
                        "reason": {
                            "type": "string",
                            "description": "Reason or purpose of the visit",
                        },
                    },
                    "required": ["patient_name", "patient_phone", "slot_datetime"],
                },
                "metadata": {"doctor_id": doctor_id},
            },
            {
                "type": "webhook",
                "name": "get_patient_bookings",
                "description": (
                    "Retrieve recent bookings for a patient by phone number. "
                    "Use at the start of the call to check if the caller is a returning patient."
                ),
                "url": f"{base}/api/v1/retell/tools/get-patient-bookings",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "patient_phone": {
                            "type": "string",
                            "description": "Patient's phone number",
                        }
                    },
                    "required": ["patient_phone"],
                },
                "metadata": {"doctor_id": doctor_id},
            },
            {
                "type": "webhook",
                "name": "cancel_booking",
                "description": "Cancel an existing appointment by booking ID.",
                "url": f"{base}/api/v1/retell/tools/cancel-booking",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "booking_id": {
                            "type": "string",
                            "description": "The UUID of the booking to cancel",
                        }
                    },
                    "required": ["booking_id"],
                },
                "metadata": {"doctor_id": doctor_id},
            },
        ]

    async def create_llm(
        self,
        doctor: Doctor,
        agent_config: AgentConfig,
        tools_base_url: str,
        doctor_id: str,
    ) -> dict:
        prompt = self.build_system_prompt(doctor, agent_config)
        tools = self.build_tool_definitions(tools_base_url, doctor_id)

        payload = {
            "model": "gpt-4o-mini",
            "general_prompt": prompt,
            "general_tools": tools,
            "begin_message": agent_config.greeting_message.replace(
                "{clinic_name}", doctor.clinic_name
            ),
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{RETELL_BASE_URL}/create-retell-llm",
                headers=self._headers(),
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    async def create_agent(
        self,
        doctor: Doctor,
        agent_config: AgentConfig,
        webhook_url: str,
        llm_id: str,
    ) -> dict:
        payload = {
            "agent_name": f"Glork - {doctor.clinic_name}",
            "voice_id": "11labs-Adrian",
            "response_engine": {
                "type": "retell-llm",
                "llm_id": llm_id,
            },
            "webhook_url": webhook_url,
            "enable_backchannel": True,
            "backchannel_frequency": 0.9,
            "interruption_sensitivity": 0.8,
            "responsiveness": 1.0,
            "voice_speed": 1.0,
            "voice_temperature": 1.0,
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(
                f"{RETELL_BASE_URL}/create-agent",
                headers=self._headers(),
                json=payload,
            )
            resp.raise_for_status()
            return resp.json()

    async def update_agent_prompt(self, retell_llm_id: str, new_prompt: str) -> bool:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.patch(
                    f"{RETELL_BASE_URL}/update-retell-llm/{retell_llm_id}",
                    headers=self._headers(),
                    json={"general_prompt": new_prompt},
                )
                resp.raise_for_status()
                return True
        except Exception as exc:
            logger.error("retell_update_prompt_failed", llm_id=retell_llm_id, error=str(exc))
            return False

    async def delete_agent(self, retell_agent_id: str) -> bool:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                resp = await client.delete(
                    f"{RETELL_BASE_URL}/delete-agent/{retell_agent_id}",
                    headers=self._headers(),
                )
                resp.raise_for_status()
                return True
        except Exception as exc:
            logger.error("retell_delete_agent_failed", agent_id=retell_agent_id, error=str(exc))
            return False

    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        if not settings.RETELL_WEBHOOK_SECRET:
            return True
        secret = settings.RETELL_WEBHOOK_SECRET.encode()
        computed = hmac.HMAC(secret, payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(computed, signature)


retell_service = RetellService()
