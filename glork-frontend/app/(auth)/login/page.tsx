import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#0A0A0A] tracking-tight">Welcome back</h1>
        <p className="text-[13.5px] text-[#888] mt-1.5">Sign in to your Hyperglork dashboard</p>
      </div>
      {/* Suspense required: LoginForm uses useSearchParams() for auth redirect reason */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
