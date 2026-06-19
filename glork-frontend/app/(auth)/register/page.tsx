import type { Metadata } from "next"
import { RegisterForm } from "@/components/auth/register-form"

export const metadata: Metadata = { title: "Create Account" }

export default function RegisterPage() {
  return (
    <div>
      <div className="mb-7">
        <span className="eyebrow">Create account</span>
        <h1 className="mt-4 font-serif text-[2rem] font-semibold leading-tight tracking-tight text-ink sm:text-[2.2rem]">
          Set up your clinic.
        </h1>
        <p className="mt-2 text-[14px] leading-6 text-ink-4">
          Connect your calendar and hand routine calls to the AI receptionist.
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
