"use client"

import { useRouter } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhoneNumberDisplay } from "@/components/agent/phone-number-display"
import { useToggleAgent } from "@/hooks/use-agent-config"
import { useCalendarStatus } from "@/hooks/use-calendar"

interface StepGoLiveProps {
  onBack: () => void
  onComplete: () => void
}

export function StepGoLive({ onBack, onComplete }: StepGoLiveProps) {
  const router = useRouter()
  const { mutateAsync: toggleAgent, isPending } = useToggleAgent()
  const { data: calendarStatus } = useCalendarStatus()

  const handleGoLive = async () => {
    await toggleAgent()
    onComplete()
  }

  const readyChecks = [
    { label: "Profile configured", done: true },
    { label: "Google Calendar connected", done: calendarStatus?.is_connected ?? false },
    { label: "Agent settings saved", done: true },
    { label: "Working hours set", done: true },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f0faf5]">
            <CheckCircle2 className="h-8 w-8 text-[#1d6b4a]" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Almost there!</h2>
        <p className="text-sm text-gray-500 mt-1">
          Review your setup and activate the AI receptionist.
        </p>
      </div>

      <div className="space-y-2">
        {readyChecks.map((check) => (
          <div
            key={check.label}
            className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3"
          >
            <div className={`flex h-5 w-5 items-center justify-center rounded-full ${
              check.done ? "bg-[#1d6b4a]" : "bg-gray-200"
            }`}>
              <CheckCircle2 className={`h-3.5 w-3.5 ${check.done ? "text-white" : "text-gray-400"}`} />
            </div>
            <span className={`text-sm ${check.done ? "text-gray-800" : "text-gray-400"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your agent number</p>
        <PhoneNumberDisplay />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleGoLive}
          disabled={isPending}
          className="flex-1 bg-[#1d6b4a] hover:bg-[#155638] text-white font-semibold"
        >
          {isPending ? "Activating…" : "Go Live!"}
        </Button>
      </div>

      <button
        type="button"
        onClick={() => router.push("/dashboard")}
        className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
      >
        Skip — I&apos;ll activate later from the dashboard
      </button>
    </div>
  )
}
