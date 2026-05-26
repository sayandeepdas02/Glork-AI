from __future__ import annotations

import base64
from datetime import datetime, timezone

import pytz
import structlog
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (
    Attachment,
    Disposition,
    FileContent,
    FileName,
    FileType,
    Mail,
)
from twilio.rest import Client as TwilioClient

from app.config import settings
from app.models.booking import Booking
from app.models.doctor import Doctor

logger = structlog.get_logger()

IST = pytz.timezone("Asia/Kolkata")


def format_appointment_datetime(dt: datetime, tz_name: str = "Asia/Kolkata") -> str:
    try:
        tz = pytz.timezone(tz_name)
    except Exception:
        tz = IST
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    local_dt = dt.astimezone(tz)
    return local_dt.strftime("%A, %B %-d at %-I:%M %p")


def _build_ics(booking: Booking, doctor: Doctor) -> bytes:
    fmt = "%Y%m%dT%H%M%SZ"
    start = booking.appointment_start
    end = booking.appointment_end
    if start.tzinfo is not None:
        start = start.astimezone(timezone.utc).replace(tzinfo=None)
    if end.tzinfo is not None:
        end = end.astimezone(timezone.utc).replace(tzinfo=None)

    content = "\r\n".join([
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Glork AI//EN",
        "BEGIN:VEVENT",
        f"UID:{booking.id}@glork.ai",
        f"DTSTART:{start.strftime(fmt)}",
        f"DTEND:{end.strftime(fmt)}",
        f"SUMMARY:Appointment at {doctor.clinic_name}",
        f"DESCRIPTION:{booking.reason or 'General consultation'}",
        f"LOCATION:{doctor.clinic_address or ''}",
        "END:VEVENT",
        "END:VCALENDAR",
    ])
    return content.encode()


class NotificationService:
    def _get_twilio(self) -> TwilioClient:
        return TwilioClient(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    def _get_sendgrid(self) -> SendGridAPIClient:
        return SendGridAPIClient(settings.SENDGRID_API_KEY)

    async def send_sms_confirmation(self, booking: Booking, doctor: Doctor) -> bool:
        if not settings.TWILIO_ACCOUNT_SID or not booking.patient_phone:
            return False

        dt_str = format_appointment_datetime(booking.appointment_start)
        address = doctor.clinic_address or "our clinic"
        cancel_contact = doctor.phone_number or "us"

        message_body = (
            f"Hi {booking.patient_name}, your appointment with {doctor.clinic_name} "
            f"is confirmed for {dt_str}. Address: {address}. "
            f"To cancel, reply CANCEL or call {cancel_contact}."
        )

        try:
            client = self._get_twilio()
            client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=booking.patient_phone,
            )
            logger.info("sms_confirmation_sent", booking_id=str(booking.id))
            return True
        except Exception as exc:
            logger.error(
                "sms_confirmation_failed",
                booking_id=str(booking.id),
                error=str(exc),
            )
            return False

    async def send_sms_reminder(self, booking: Booking, doctor: Doctor) -> bool:
        if not settings.TWILIO_ACCOUNT_SID or not booking.patient_phone:
            return False

        dt_str = format_appointment_datetime(booking.appointment_start)
        message_body = (
            f"Reminder: Your appointment with {doctor.clinic_name} is tomorrow at "
            f"{dt_str.split(' at ')[-1]}. Reply CANCEL to cancel."
        )

        try:
            client = self._get_twilio()
            client.messages.create(
                body=message_body,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=booking.patient_phone,
            )
            logger.info("sms_reminder_sent", booking_id=str(booking.id))
            return True
        except Exception as exc:
            logger.error(
                "sms_reminder_failed",
                booking_id=str(booking.id),
                error=str(exc),
            )
            return False

    async def send_email_confirmation(self, booking: Booking, doctor: Doctor) -> bool:
        if not booking.patient_email or not settings.SENDGRID_API_KEY:
            return False

        dt_str = format_appointment_datetime(booking.appointment_start)
        html_content = f"""
        <html><body>
        <h2>Appointment Confirmed</h2>
        <p>Dear {booking.patient_name},</p>
        <p>Your appointment has been confirmed:</p>
        <ul>
          <li><strong>Clinic:</strong> {doctor.clinic_name}</li>
          <li><strong>Date & Time:</strong> {dt_str}</li>
          <li><strong>Reason:</strong> {booking.reason or 'General consultation'}</li>
          {'<li><strong>Address:</strong> ' + doctor.clinic_address + '</li>' if doctor.clinic_address else ''}
        </ul>
        <p>If you need to cancel or reschedule, please call {doctor.phone_number or 'the clinic'}.</p>
        <p>Best regards,<br>{doctor.clinic_name}</p>
        </body></html>
        """

        mail = Mail(
            from_email=settings.SENDGRID_FROM_EMAIL,
            to_emails=booking.patient_email,
            subject=f"Appointment Confirmed – {doctor.clinic_name}",
            html_content=html_content,
        )

        ics_bytes = _build_ics(booking, doctor)
        attachment = Attachment(
            FileContent(base64.b64encode(ics_bytes).decode()),
            FileName("appointment.ics"),
            FileType("text/calendar"),
            Disposition("attachment"),
        )
        mail.attachment = attachment

        try:
            sg = self._get_sendgrid()
            sg.send(mail)
            logger.info("email_confirmation_sent", booking_id=str(booking.id))
            return True
        except Exception as exc:
            logger.error(
                "email_confirmation_failed",
                booking_id=str(booking.id),
                error=str(exc),
            )
            return False


notification_service = NotificationService()
