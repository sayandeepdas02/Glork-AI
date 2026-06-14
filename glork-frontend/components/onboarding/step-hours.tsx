"use client"

import { Button } from "@/components/ui/button"
import { WorkingHoursEditor } from "@/components/agent/working-hours-editor"

interface StepHoursProps {
  onNext: () => void
  onBack: () => void
}

export function StepHours({ onNext, onBack }: StepHoursProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Step 4</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">Set your working hours</h2>
        <p className="mt-2 text-sm leading-7 text-gray-500">
          The AI will only book appointments within these hours.
        </p>
      </div>

      <WorkingHoursEditor />

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-full bg-[#111111] text-white hover:bg-[#232323]"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
