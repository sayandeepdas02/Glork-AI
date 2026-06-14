import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Sign in</p>
        <h1 className="mt-3 text-[2rem] font-semibold tracking-tight text-[var(--text-primary)]">Welcome back</h1>
        <p className="mt-2 text-[15px] leading-7 text-[var(--text-muted)]">
          Sign in to manage calls, bookings, and your clinic setup from one dashboard.
        </p>
      </div>
      {/* Suspense required: LoginForm uses useSearchParams() for auth redirect reason */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
