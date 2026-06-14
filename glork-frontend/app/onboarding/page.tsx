"use client"

import { useCallback, useEffect, useState } from "react"
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

  fire(0.25, { spread: 26, startVelocity: 55, colors: ["#1d6b4a", "#c8e6d4"] })
  fire(0.2, { spread: 60, colors: ["#1d6b4a", "#e6f4ed", "#ffffff"] })
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#1d6b4a", "#c8e6d4"] })
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
  fire(0.1, { spread: 120, startVelocity: 45 })
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const requestedStep = Number(params.get("step") ?? "1")
    if (Number.isFinite(requestedStep)) {
      setStep(Math.min(Math.max(requestedStep, 1), TOTAL_STEPS))
    }
  }, [])

  const next = useCallback(() => setStep((s) => Math.min(s + 1, TOTAL_STEPS)), [])
  const back = useCallback(() => setStep((s) => Math.max(s - 1, 1)), [])
  const skip = useCallback(() => next(), [next])

  const handleComplete = useCallback(() => {
    fireConfetti()
    setTimeout(() => router.push("/dashboard"), 1800)
  }, [router])

  return (
    <div className="min-h-screen bg-[var(--bg-surface)]">
      <header className="border-b border-[var(--edge)] bg-white/70 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5">
          <Logo className="h-8 w-8 rounded-lg" />
          <span className="font-semibold tracking-tight text-[var(--text-primary)]">Hyperglork</span>
          <span className="ml-auto text-sm text-[var(--text-faint)]">Setup</span>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="space-y-5">
          <div className="panel-surface rounded-[28px] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">
              Onboarding
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
              Get your receptionist live with a cleaner setup flow.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">
              Confirm your clinic details, connect your scheduling system, and
              enable the AI agent with the right guardrails.
            </p>
          </div>

          <StepIndicator currentStep={step} />
        </aside>

        <div className="panel-surface rounded-[32px] p-6 sm:p-8">
          {step === 1 && <StepProfile onNext={next} />}
          {step === 2 && <StepCalendar onNext={next} onSkip={skip} />}
          {step === 3 && <StepAgent onNext={next} onBack={back} />}
          {step === 4 && <StepHours onNext={next} onBack={back} />}
          {step === 5 && <StepGoLive onBack={back} onComplete={handleComplete} />}
          </div>
      </div>
    </div>
  )
}
