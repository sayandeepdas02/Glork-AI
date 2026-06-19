import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-8">
        <p className="text-[11px] font-normal tracking-[0.06em] uppercase text-[#9CA3AF] mb-3">
          Create account
        </p>
        <h1 className="text-[2rem] font-light tracking-[-0.03em] text-[#111111] leading-tight">
          Set up your clinic.
        </h1>
        <p className="mt-2 text-[13px] font-light text-[#9CA3AF]">
          Connect your calendar and hand routine calls to the AI receptionist.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
