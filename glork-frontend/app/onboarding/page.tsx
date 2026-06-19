"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
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

  fire(0.25, { spread: 26, startVelocity: 55, colors: ["#1c80f2", "#8fc6ff"] })
  fire(0.2, { spread: 60, colors: ["#1c80f2", "#dceeff", "#ffffff"] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#1568cc", "#8fc6ff"] })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const next = useCallback(() => setStep((current) => Math.min(current + 1, TOTAL_STEPS)), [])
  const back = useCallback(() => setStep((current) => Math.max(current - 1, 1)), [])
  const skip = useCallback(() => next(), [next])

  const handleComplete = useCallback(() => {
    fireConfetti()
    setTimeout(() => router.push("/dashboard"), 1800)
  }, [router])

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9 rounded-lg" />
            <div>
              <p className="text-[14px] font-medium tracking-tight text-[#111111]">Hyperglork</p>
              <p className="text-[11px] uppercase tracking-[0.16em] text-[#9CA3AF]">Onboarding</p>
            </div>
          </div>
          <p className="text-sm text-[#9CA3AF]">Step {step} of {TOTAL_STEPS}</p>
        </div>
      </header>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div className="section-frame px-6 py-7">
          <span className="eyebrow">Setup</span>
          <h1 className="mt-5 text-[18px] font-medium text-[#111111] leading-tight">
            Build the front desk before the first call hits.
          </h1>
          <p className="mt-3 max-w-2xl text-[12px] font-light leading-relaxed text-[#9CA3AF]">
            This flow wires together clinic identity, calendar access, call behavior, and operating hours so the agent launches with context.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="surface-card p-6">
            <StepIndicator currentStep={step} />
          </div>

          <div className="surface-card p-8">
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
