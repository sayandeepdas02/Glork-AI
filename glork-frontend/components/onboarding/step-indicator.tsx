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
    <div className="flex items-center justify-center gap-0">
      {STEPS.map((step, i) => {
        const stepNum = i + 1
        const isCompleted = stepNum < currentStep
        const isActive = stepNum === currentStep

        return (
          <div key={stepNum} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                  isCompleted
                    ? "border-[#1d6b4a] bg-[#1d6b4a] text-white"
                    : isActive
                      ? "border-[#1d6b4a] bg-white text-[#1d6b4a]"
                      : "border-gray-200 bg-white text-gray-400"
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isActive ? "text-[#1d6b4a]" : "text-gray-400"
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-0.5 w-12 mb-5 mx-1 transition-colors",
                  stepNum < currentStep ? "bg-[#1d6b4a]" : "bg-gray-200"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
