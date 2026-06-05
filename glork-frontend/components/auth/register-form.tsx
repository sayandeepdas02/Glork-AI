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

export function RegisterForm() {
  const router = useRouter()
  const { register: registerAccount } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          disabled={isSubmitting}
          className={cn(
            "w-full flex items-center justify-center gap-2 rounded-xl",
            "bg-brand hover:bg-brand-dark text-white font-semibold",
            "py-3 text-sm transition-all duration-150",
            "shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          )}
        >
          {isSubmitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account…</>
            : "Create account"}
        </button>
      </div>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand hover:text-brand-dark transition-colors">
          Sign in
        </Link>
      </p>
    </form>
  )
}
