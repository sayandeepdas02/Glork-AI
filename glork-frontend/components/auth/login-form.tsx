"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  email:    z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})
type FormValues = z.infer<typeof schema>

function Field({
  id, label, type = "text", placeholder, autoComplete, register, error, rightSlot,
}: {
  id: string; label: string; type?: string; placeholder?: string
  autoComplete?: string; register: UseFormRegisterReturn; error?: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[12px] font-normal text-[#6B7280]">
        {label}
      </label>
      <div className="relative">
        <input
          id={id} type={type} placeholder={placeholder} autoComplete={autoComplete}
          className={cn(
            "h-10 w-full rounded-lg border border-[#E5E7EB] bg-white px-3.5 text-[13px] font-normal text-[#111111] outline-none transition-colors",
            "placeholder:text-[#D1D5DB]",
            "hover:border-[#D1D5DB]",
            "focus:border-[#111111] focus:ring-0",
            rightSlot && "pr-10",
            error && "border-[#EF4444] focus:border-[#EF4444]"
          )}
          {...register}
        />
        {rightSlot && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && <p className="text-[11px] font-light text-[#EF4444]">{error}</p>}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

const AUTH_MESSAGES: Record<string, string> = {
  session_expired: "Your session expired. Sign in again to continue.",
  auth_required:   "Sign in to access the clinic console.",
  network_error:   "A network issue interrupted your session.",
}

export function LoginForm() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const { login }    = useAuth()
  const [showPw, setShowPw]               = useState(false)
  const [isSubmitting, setIsSubmitting]   = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [sessionMsg, setSessionMsg]       = useState<string | null>(null)

  useEffect(() => {
    const reason = searchParams.get("reason")
    if (reason && reason in AUTH_MESSAGES) setSessionMsg(AUTH_MESSAGES[reason])
  }, [searchParams])

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await login(values.email, values.password)
      router.push("/dashboard")
    } catch (err: unknown) {
      toast.error(
        isAxiosError(err)
          ? (err.response?.data?.detail ?? "Invalid email or password")
          : "Invalid email or password"
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    try {
      const { auth_url } = await getGoogleAuthUrl()
      window.location.href = auth_url
    } catch {
      toast.error("Could not initiate Google sign-in.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {sessionMsg && (
        <div className="rounded-lg border border-[#FEF3C7] bg-[#FFFBEB] px-4 py-3">
          <p className="text-[12px] font-light text-[#92400E]">{sessionMsg}</p>
        </div>
      )}

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[13px] font-normal text-[#333333] transition-colors",
          "hover:bg-[#F9FAFB] hover:border-[#D1D5DB] disabled:cursor-not-allowed disabled:opacity-50"
        )}
      >
        {isGoogleLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative flex items-center gap-3">
        <div className="h-px flex-1 bg-[#F3F4F6]" />
        <span className="text-[10px] font-normal uppercase tracking-[0.10em] text-[#D1D5DB]">or</span>
        <div className="h-px flex-1 bg-[#F3F4F6]" />
      </div>

      <Field id="email"    label="Email"    type="email"    placeholder="you@clinic.com" autoComplete="email"            register={register("email")}    error={errors.email?.message} />
      <Field id="password" label="Password" type={showPw ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" register={register("password")} error={errors.password?.message}
        rightSlot={
          <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="text-[#D1D5DB] hover:text-[#9CA3AF] transition-colors">
            {showPw ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#111111] text-[13px] font-medium text-white transition-colors",
          "hover:bg-[#333333] disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Signing in…</> : "Sign in"}
      </button>

      <p className="text-center text-[12px] font-light text-[#9CA3AF]">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-normal text-[#111111] underline underline-offset-2 hover:text-[#333333]">
          Create one
        </Link>
      </p>
    </form>
  )
}
