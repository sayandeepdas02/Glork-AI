import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-normal tracking-[0.06em] uppercase text-[#9CA3AF] mb-3">
          Sign in
        </p>
        <h1 className="text-[2rem] font-light tracking-[-0.03em] text-[#111111] leading-tight">
          Welcome back.
        </h1>
        <p className="mt-2 text-[13px] font-light text-[#9CA3AF]">
          Manage bookings, review call logs, and tune your AI receptionist.
        </p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
