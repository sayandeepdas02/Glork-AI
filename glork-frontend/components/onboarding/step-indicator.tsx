import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const STEPS = [
  { label: "Profile" },
  { label: "Calendar" },
  { label: "Agent" },
  { label: "Hours" },
  { label: "Go Live" },
]

interface StepIndicatorProps {
  currentStep: number
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="panel-surface rounded-[28px] p-5">
      <div className="space-y-4">
      {STEPS.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={stepNum} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-all",
                  isCompleted
                    ? "border-[#111111] bg-[#111111] text-white"
                    : isActive
                      ? "border-[var(--brand-border)] bg-[var(--brand-dim)] text-[var(--text-primary)]"
                      : "border-[var(--edge)] bg-white text-[var(--text-faint)]"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mt-2 h-8 w-px transition-colors",
                    stepNum < currentStep ? "bg-[#111111]" : "bg-[var(--edge)]"
                  )}
                />
              )}
            </div>

            <div className="pt-1">
              <p
                className={cn(
                  "text-sm font-semibold",
                  isActive ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
                )}
              >
                {step.label}
              </p>
              <p className="mt-1 text-[12px] text-[var(--text-faint)]">
                {isCompleted ? "Completed" : isActive ? "In progress" : `Step ${stepNum}`}
              </p>
            </div>
          </div>
        )
      })}
      </div>
    </div>
  )
}
