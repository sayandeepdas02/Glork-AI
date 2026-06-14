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
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Step 3</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900">Configure your AI agent</h2>
        <p className="mt-2 text-sm leading-7 text-gray-500">
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
          className="flex-1 rounded-full bg-[#111111] text-white hover:bg-[#232323]"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
