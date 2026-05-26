# Glork Frontend

Doctor dashboard for the Glork AI voice receptionist. Manage bookings, review call transcripts, and configure your AI agent — all in one place.

## Screenshots

_Coming soon — the app runs at http://localhost:3000 after setup._

## Prerequisites

- Node.js 18+
- npm or pnpm
- Glork backend running (see `../glork-backend/`)

## Local Setup

```bash
# Clone and install
git clone <repo-url>
cd glork-frontend
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL to your backend URL

# Start dev server
npm run dev
# App available at http://localhost:3000
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Glork backend base URL |
| `NEXT_PUBLIC_APP_NAME` | `Glork` | App display name |
| `NEXT_PUBLIC_APP_ENV` | `development` | App environment |

## Pages

| Path | Description |
|---|---|
| `/login` | Doctor sign in |
| `/register` | Account creation → redirects to onboarding |
| `/onboarding` | 5-step setup wizard |
| `/dashboard` | Overview: stats, upcoming bookings, recent calls, call chart |
| `/bookings` | Full bookings list with filters |
| `/bookings/[id]` | Booking detail: patient info, notes, reschedule/cancel |
| `/calls` | Call log with outcome filter |
| `/calls/[id]` | Call detail + transcript viewer |
| `/agent` | AI agent configuration: toggle, hours, language, calendar |
| `/settings` | Profile and account settings |

## Connecting to the Backend

1. Start the backend: `docker-compose up` in `../glork-backend/`
2. Set `NEXT_PUBLIC_API_URL=http://localhost:8000` in `.env.local`
3. Register a doctor account at `/register`
4. Complete onboarding to connect Google Calendar and activate the agent

## Building for Production

```bash
npm run build
npm start
```

**Deploy to Vercel:**

```bash
npm i -g vercel
vercel --prod
# Set NEXT_PUBLIC_API_URL to your production backend URL in Vercel dashboard
```

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Server state | TanStack Query v5 |
| Client state | Zustand + persist |
| Forms | React Hook Form + Zod |
| HTTP | Axios with JWT interceptor |
| Dates | date-fns |
| Charts | Recharts |
| Notifications | Sonner |
| Icons | Lucide React |
