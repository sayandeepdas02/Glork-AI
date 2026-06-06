import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[1.75rem] font-bold text-[#111] tracking-tight">Create your account</h1>
        <p className="text-[14px] text-[#777] mt-1.5">Set up your AI receptionist in 3 minutes</p>
      </div>
      <RegisterForm />
    </div>
  )
}
