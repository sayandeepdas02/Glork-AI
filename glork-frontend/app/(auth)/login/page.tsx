import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <span className="eyebrow">Sign in</span>
        <h1 className="mt-5 font-serif text-[2.8rem] leading-[0.95] tracking-tight text-ink">
          Welcome back to the clinic console.
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-ink-4">
          Review bookings, watch the live call queue, and manage your AI receptionist from one place.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
