import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Create account</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-[var(--text-primary)]">Set up your clinic workspace</h1>
        <p className="mt-2 text-[15px] leading-7 text-[var(--text-muted)]">
          Create the account, connect your tools, and get your AI receptionist ready to go live.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
