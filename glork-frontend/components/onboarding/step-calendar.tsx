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
      <div className="text-center">
        <h2 className="text-[14px] font-medium text-[#111111]">Connect Google Calendar</h2>
        <p className="text-sm text-gray-500 mt-1">
          Required so the AI can check your availability and create appointments.
        </p>
      </div>

      <GoogleCalendarConnect />

      <div className="flex flex-col gap-3">
        <Button
          onClick={onNext}
          disabled={!isConnected || isLoading}
          className="w-full bg-[#1d6b4a] hover:bg-[#155638] text-white"
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
          className="text-sm text-gray-400 hover:text-gray-600 text-center"
        >
          Skip for now — I&apos;ll connect later
        </button>
      </div>
    </div>
  )
}
