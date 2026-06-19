import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-7">
        <span className="eyebrow">Sign in</span>
        <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.2rem]">
          Welcome back.
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-ink-4">
          Manage bookings, review call logs, and tune your AI receptionist.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
