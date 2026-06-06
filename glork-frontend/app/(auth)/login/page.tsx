import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-[#111] tracking-tight">Welcome back</h1>
        <p className="text-[14px] text-[#777] mt-1.5">Sign in to your Hyperglork dashboard</p>
      </div>
      {/* Suspense required: LoginForm uses useSearchParams() for auth redirect reason */}
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  )
}
