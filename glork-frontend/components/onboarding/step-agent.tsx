"use client"

import { Button } from "@/components/ui/button"
import { AgentConfigForm } from "@/components/agent/agent-config-form"

interface StepAgentProps {
  onNext: () => void
  onBack: () => void
}

export function StepAgent({ onNext, onBack }: StepAgentProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-[14px] font-medium text-[#111111]">Configure your AI agent</h2>
        <p className="text-sm text-gray-500 mt-1">
          Set a name, language, and greeting for your receptionist.
        </p>
      </div>

      <AgentConfigForm />

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
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
