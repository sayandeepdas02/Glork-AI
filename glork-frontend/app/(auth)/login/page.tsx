import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = { title: "Sign In" }

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1.5">Sign in to your Glork dashboard</p>
      </div>
      <LoginForm />
    </div>
  )
}
