"use client"

import { CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"
import { useCalendarStatus } from "@/hooks/use-calendar"

interface StepCalendarProps {
  onNext: () => void
  onSkip: () => void
}

export function StepCalendar({ onNext, onSkip }: StepCalendarProps) {
  const { data: status, isLoading } = useCalendarStatus()
  const isConnected = status?.is_connected ?? false

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Step 2</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">Connect Google Calendar</h2>
        <p className="mt-2 text-sm leading-7 text-gray-500">
          Required so the AI can check your availability and create appointments.
        </p>
      </div>

      <GoogleCalendarConnect />

      <div className="flex flex-col gap-3">
        <Button
          onClick={onNext}
          disabled={!isConnected || isLoading}
          className="w-full rounded-full bg-[#111111] text-white hover:bg-[#232323]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : isConnected ? (
            <><CheckCircle2 className="h-4 w-4 mr-2" /> Continue</>
          ) : "Continue"}
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="text-center text-sm text-gray-400 hover:text-gray-600"
        >
          Skip for now — I&apos;ll connect later
        </button>
      </div>
    </div>
  )
}
