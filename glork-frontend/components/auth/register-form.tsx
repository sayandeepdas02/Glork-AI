"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm, type UseFormRegisterReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { isAxiosError } from "axios"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { getGoogleAuthUrl } from "@/lib/api"

const schema = z.object({
  name: z.string().min(2, "Full name is required"),
  clinic_name: z.string().min(2, "Clinic name is required"),
  specialty: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
  confirm_password: z.string(),
}).refine((d) => d.password === d.confirm_password, {
  path: ["confirm_password"],
  message: "Passwords do not match",
})

type FormValues = z.infer<typeof schema>

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" }
  let s = 0
  if (pw.length >= 8) s++
  if (pw.length >= 12) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  if (s <= 1) return { score: 20, label: "Weak", color: "bg-red-400" }
  if (s === 2) return { score: 40, label: "Fair", color: "bg-orange-400" }
  if (s === 3) return { score: 60, label: "Good", color: "bg-yellow-400" }
  if (s === 4) return { score: 80, label: "Strong", color: "bg-emerald-400" }
  return { score: 100, label: "Very strong", color: "bg-emerald-500" }
}

function Field({
  id, label, type = "text", placeholder, autoComplete, register, error, rightSlot, half,
}: {
  id: string; label: string; type?: string; placeholder?: string; autoComplete?: string
  register: UseFormRegisterReturn; error?: string; rightSlot?: React.ReactNode; half?: boolean
}) {
  return (
    <div className={cn("space-y-1.5", half && "")}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        <input
          id={id} type={type} placeholder={placeholder} autoComplete={autoComplete}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400",
            "outline-none transition-all duration-150",
            "border-gray-200 hover:border-gray-300 focus:border-brand focus:ring-2 focus:ring-brand/10",
            rightSlot && "pr-11",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
          )}
          {...register}
        />
        {rightSlot && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

export function RegisterForm() {
  const router = useRouter()
  const { register: registerAccount } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const pw = watch("password") ?? ""
  const strength = passwordStrength(pw)

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await registerAccount({
        name: values.name,
        clinic_name: values.clinic_name,
        specialty: values.specialty,
        email: values.email,
        password: values.password,
      })
      router.push("/onboarding")
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err) ? (err.response?.data?.detail ?? "Registration failed. Please try again.") : "Registration failed. Please try again."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignUp = async () => {
    setIsGoogleLoading(true)
    try {
      const { auth_url } = await getGoogleAuthUrl()
      window.location.href = auth_url
    } catch {
      toast.error("Could not initiate Google sign-up. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="pb-1">
        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={isSubmitting || isGoogleLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-full",
            "border border-[var(--edge)] bg-[var(--bg-surface)] hover:bg-white",
            "py-3.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-150",
            "disabled:opacity-60 disabled:cursor-not-allowed"
          )}
        >
          {isGoogleLoading
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <GoogleIcon />}
          Sign up with Google
        </button>
      </div>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or continue with email</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field id="name" label="Full name" placeholder="Dr. Jane Smith"
          register={register("name")} error={errors.name?.message} />
        <Field id="clinic_name" label="Clinic name" placeholder="Smith Clinic"
          register={register("clinic_name")} error={errors.clinic_name?.message} />
      </div>

      <Field id="specialty" label="Specialty (optional)" placeholder="e.g. General Practice"
        register={register("specialty")} error={errors.specialty?.message} />

      <Field id="email" label="Email address" type="email" placeholder="you@clinic.com"
        autoComplete="email" register={register("email")} error={errors.email?.message} />

      <div className="space-y-1.5">
        <Field
          id="password" label="Password" type={showPw ? "text" : "password"}
          placeholder="Min. 8 characters" autoComplete="new-password"
          register={register("password")} error={errors.password?.message}
          rightSlot={
            <button type="button" tabIndex={-1}
              onClick={() => setShowPw(!showPw)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="text-gray-400 hover:text-gray-600 transition-colors">
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          }
        />
        {pw && (
          <div className="space-y-1 pt-0.5">
            <div className="h-1 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-300", strength.color)}
                style={{ width: `${strength.score}%` }}
              />
            </div>
            <p className="text-[11px] text-gray-400">{strength.label}</p>
          </div>
        )}
      </div>

      <Field
        id="confirm_password" label="Confirm password" type="password"
        placeholder="Repeat password" autoComplete="new-password"
        register={register("confirm_password")} error={errors.confirm_password?.message}
      />

      <div className="pt-1">
        <button
          type="submit"
          disabled={isSubmitting || isGoogleLoading}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-full",
            "bg-[#111111] text-white font-semibold hover:bg-[#232323]",
            "py-3.5 text-sm transition-all duration-150",
            "hover:-translate-y-0.5",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          )}
        >
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
            : "Create account"}
        </button>
      </div>

      <p className="text-center text-sm text-[var(--text-muted)]">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--brand-dark)]">
          Sign in
        </Link>
      </p>
    </form>
  )
}
