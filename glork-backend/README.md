# Glork Backend

AI Voice Agent SaaS for Doctors — Python/FastAPI backend that powers Glork's inbound call automation, appointment booking, and Google Calendar integration.

---

## What it does

- Answers inbound patient calls via a Retell AI voice agent
- Books, reschedules, and cancels appointments through natural voice conversation
- Syncs appointments to the doctor's Google Calendar in real-time
- Sends SMS confirmations and 24h reminders via Twilio
- Sends email confirmations with ICS calendar attachments via SendGrid
- Provides a REST API for the doctor dashboard (bookings, call logs, agent configuration)

---

## Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.12+ |
| PostgreSQL | 16+ |
| Redis | 7+ |
| Docker + Docker Compose | Latest |

External accounts required:
- [Retell AI](https://retellai.com) — voice agent platform
- [Google Cloud Console](https://console.cloud.google.com) — Calendar API OAuth
- [Twilio](https://twilio.com) — SMS
- [SendGrid](https://sendgrid.com) — email

---

## Local Setup

### 1. Clone and create virtual environment

```bash
git clone <repo-url> glork-backend
cd glork-backend
python3.12 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your actual credentials
```

### 3. Start infrastructure with Docker Compose

```bash
docker compose up db redis -d
```

### 4. Run database migrations

```bash
alembic upgrade head
```

### 5. Start the API server

```bash
uvicorn app.main:app --reload --port 8000
```

### 6. Start Celery worker and beat (separate terminals)

```bash
celery -A celery_worker worker --loglevel=info
celery -A celery_worker beat --loglevel=info
```

### Full Docker Compose (all services)

```bash
docker compose up --build
```

This starts: PostgreSQL, Redis, API server, Celery worker, Celery beat.

---

## Environment Variable Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL async connection string | `postgresql+asyncpg://glork:glork@localhost:5432/glork` |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379/0` |
| `SECRET_KEY` | JWT signing secret (keep long and random) | `openssl rand -hex 32` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Access token TTL | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Refresh token TTL | `30` |
| `RETELL_API_KEY` | Retell API key from dashboard | `key_xxx` |
| `RETELL_WEBHOOK_SECRET` | Retell webhook signing secret | `whsec_xxx` |
| `GOOGLE_CLIENT_ID` | Google OAuth 2.0 client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 2.0 client secret | `GOCSPX-xxx` |
| `GOOGLE_REDIRECT_URI` | OAuth callback URL | `http://localhost:8000/api/v1/calendar/callback` |
| `ENCRYPTION_KEY` | Fernet key for token encryption | `python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `xxx` |
| `TWILIO_PHONE_NUMBER` | Twilio sending number | `+1XXXXXXXXXX` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxx` |
| `SENDGRID_FROM_EMAIL` | Verified sender email | `noreply@glork.ai` |
| `FRONTEND_URL` | Frontend origin for CORS + redirects | `http://localhost:3000` |
| `BACKEND_URL` | This server's public URL | `https://api.glork.ai` |
| `ENVIRONMENT` | `development` or `production` | `development` |

---

## Configuring Retell

### Webhook URL

Set this in your Retell dashboard under Agent Settings → Webhook:

```
https://your-backend-url/api/v1/retell/webhook
```

### Tool URLs

Glork registers these tool endpoints automatically when you provision an agent via the API, but if configuring manually in Retell:

| Tool | URL |
|------|-----|
| `check_availability` | `POST https://your-backend-url/api/v1/retell/tools/check-availability` |
| `create_booking` | `POST https://your-backend-url/api/v1/retell/tools/create-booking` |
| `get_patient_bookings` | `POST https://your-backend-url/api/v1/retell/tools/get-patient-bookings` |
| `cancel_booking` | `POST https://your-backend-url/api/v1/retell/tools/cancel-booking` |

Each tool call includes `call.metadata.doctor_id` which routes the request to the correct doctor's configuration.

### Provisioning an agent

After a doctor connects their Google Calendar, call:

```bash
POST /api/v1/doctors/me/agent/toggle
Authorization: Bearer <token>
```

This activates the agent. To provision a fresh Retell agent for a new doctor, you can call the Retell API directly using `retell_service.create_llm()` + `retell_service.create_agent()`.

---

## Setting up Google Cloud OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a project (or use existing)
3. Enable the **Google Calendar API**
4. Go to **APIs & Services → Credentials → Create OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorised redirect URIs: add `http://localhost:8000/api/v1/calendar/callback` (and your production URL)
7. Copy **Client ID** and **Client Secret** into `.env`
8. Go to **OAuth consent screen** and add your app details; add test users if in testing mode

---

## Running Tests

```bash
# Make sure a test database is available
# The test suite uses DATABASE_URL with "_test" suffix

pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=term-missing
```

Tests require a running PostgreSQL instance. They use a separate `glork_test` database which is created/dropped automatically.

---

## API Overview

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/v1/auth/register` | No | Register a new doctor account |
| `POST` | `/api/v1/auth/login` | No | Login and receive JWT tokens |
| `POST` | `/api/v1/auth/refresh` | No | Refresh access token |
| `POST` | `/api/v1/auth/logout` | No | Logout (client-side token discard) |
| `GET` | `/api/v1/doctors/me` | Yes | Get doctor profile |
| `PATCH` | `/api/v1/doctors/me` | Yes | Update doctor profile |
| `GET` | `/api/v1/doctors/me/agent-config` | Yes | Get agent configuration |
| `PUT` | `/api/v1/doctors/me/agent-config` | Yes | Update agent configuration |
| `POST` | `/api/v1/doctors/me/agent/toggle` | Yes | Toggle AI agent on/off |
| `GET` | `/api/v1/bookings` | Yes | List bookings (with filters) |
| `POST` | `/api/v1/bookings` | Yes | Create manual booking |
| `GET` | `/api/v1/bookings/stats` | Yes | Booking statistics |
| `GET` | `/api/v1/bookings/{id}` | Yes | Get booking detail |
| `PATCH` | `/api/v1/bookings/{id}` | Yes | Update / reschedule / cancel booking |
| `DELETE` | `/api/v1/bookings/{id}` | Yes | Delete booking |
| `GET` | `/api/v1/calls` | Yes | List call logs |
| `GET` | `/api/v1/calls/stats` | Yes | Call statistics |
| `GET` | `/api/v1/calls/{id}` | Yes | Get call log with transcript |
| `GET` | `/api/v1/calendar/auth-url` | Yes | Get Google OAuth URL |
| `GET` | `/api/v1/calendar/callback` | No | Google OAuth callback |
| `GET` | `/api/v1/calendar/status` | Yes | Check calendar connection status |
| `GET` | `/api/v1/calendar/list` | Yes | List available Google Calendars |
| `PATCH` | `/api/v1/calendar/select` | Yes | Select which calendar to use |
| `DELETE` | `/api/v1/calendar` | Yes | Disconnect Google Calendar |
| `POST` | `/api/v1/retell/webhook` | HMAC | Retell lifecycle event webhook |
| `POST` | `/api/v1/retell/tools/check-availability` | None* | Check available slots (called by Retell) |
| `POST` | `/api/v1/retell/tools/create-booking` | None* | Create booking mid-call |
| `POST` | `/api/v1/retell/tools/get-patient-bookings` | None* | Fetch patient history mid-call |
| `POST` | `/api/v1/retell/tools/cancel-booking` | None* | Cancel booking mid-call |
| `GET` | `/health` | No | Health check |

*Retell tool endpoints are not JWT-authenticated; they are called by Retell mid-call. They validate `doctor_id` against the database instead.

---

## Architecture

```
Patient Call → Retell AI Agent
                   ↓
           Voice conversation (LLM)
                   ↓
        Tool calls → Glork Backend
           ↙              ↘
  Google Calendar      PostgreSQL (bookings)
                   ↓
           SMS (Twilio) + Email (SendGrid)
                   ↓
         Doctor Dashboard (frontend)
```

## Security Notes

- All Google OAuth tokens are Fernet-encrypted at rest
- JWT secrets must be strong random values in production (`openssl rand -hex 32`)
- Retell webhook calls are verified with HMAC-SHA256 before processing
- Patient phone numbers are partially masked in logs
- Rate limiting (100 req/min) is applied on auth endpoints via slowapi
