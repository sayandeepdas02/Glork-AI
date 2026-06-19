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
      <div className="text-center">
        <h2 className="text-[14px] font-medium text-[#111111]">Set your working hours</h2>
        <p className="text-sm text-gray-500 mt-1">
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
          className="flex-1 bg-[#1d6b4a] hover:bg-[#155638] text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
