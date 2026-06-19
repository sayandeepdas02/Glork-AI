import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Create account</span>
        <h1 className="mt-5 font-serif text-[2.8rem] leading-[0.95] tracking-tight text-ink">
          Launch a better front desk in minutes.
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-ink-4">
          Start the clinic workspace, connect your calendar, and hand routine calls to the agent.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
