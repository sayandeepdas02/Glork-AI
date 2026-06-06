"use client"

import { useCallback, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import confetti from "canvas-confetti"
import { Logo } from "@/components/ui/logo"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { StepProfile } from "@/components/onboarding/step-profile"
import { StepCalendar } from "@/components/onboarding/step-calendar"
import { StepAgent } from "@/components/onboarding/step-agent"
import { StepHours } from "@/components/onboarding/step-hours"
import { StepGoLive } from "@/components/onboarding/step-go-live"

const TOTAL_STEPS = 5

function fireConfetti() {
  const count = 200
  const defaults = { origin: { y: 0.7 } }

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio) })
  }

  fire(0.25, { spread: 26, startVelocity: 55, colors: ["#1d6b4a", "#c8e6d4"] })
  fire(0.2, { spread: 60, colors: ["#1d6b4a", "#e6f4ed", "#ffffff"] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#1d6b4a", "#c8e6d4"] })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), [])
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])
  const skip = useCallback(() => next(), [next])

  const handleComplete = useCallback(() => {
    fireConfetti()
    setTimeout(() => router.push("/dashboard"), 1800)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2.5 max-w-xl mx-auto">
          <Logo className="w-8 h-8 rounded-lg" />
          <span className="font-semibold text-[#111] tracking-tight">Hyperglork</span>
          <span className="text-gray-400 text-sm ml-auto">Setup</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-start pt-10 px-4">
        <div className="w-full max-w-xl space-y-8">
          <StepIndicator currentStep={step} />

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {step === 1 && <StepProfile onNext={next} />}
            {step === 2 && <StepCalendar onNext={next} onSkip={skip} />}
            {step === 3 && <StepAgent onNext={next} onBack={back} />}
            {step === 4 && <StepHours onNext={next} onBack={back} />}
            {step === 5 && <StepGoLive onBack={back} onComplete={handleComplete} />}
          </div>
        </div>
      </div>
    </div>
  )
}
