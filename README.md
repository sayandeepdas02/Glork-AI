# Glork — AI Receptionist for Medical Clinics

Glork is an AI-powered voice receptionist SaaS that answers patient calls 24/7, books appointments directly to Google Calendar, and sends SMS & email confirmations — so doctors can focus on medicine, not admin.

## Repository Structure

```
glork/
├── glork-backend/    # FastAPI Python backend (AI agent, webhooks, booking API)
└── glork-frontend/   # Next.js 14 dashboard (doctor UI)
```

## Quick Start

```bash
# Backend
cd glork-backend
cp .env.example .env   # fill in your keys
docker-compose up

# Frontend
cd glork-frontend
npm install
cp .env.local.example .env.local
npm run dev
```

See individual READMEs for full setup instructions:
- [`glork-backend/README.md`](./glork-backend/README.md)
- [`glork-frontend/README.md`](./glork-frontend/README.md)

## Tech Stack

| Layer | Technology |
|---|---|
| AI Voice | Retell AI |
| Backend | Python 3.12, FastAPI, PostgreSQL, Redis, Celery |
| Frontend | Next.js 14, TypeScript, Tailwind CSS, TanStack Query |
| Calendar | Google Calendar API (OAuth 2.0) |
| SMS / Email | Twilio, SendGrid |
| Deployment | Docker Compose |
