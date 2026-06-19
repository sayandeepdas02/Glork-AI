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
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

type FormValues = z.infer<typeof schema>

function Field({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  register,
  error,
  rightSlot,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  register: UseFormRegisterReturn
  error?: string
  rightSlot?: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-ink-3">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "h-12 w-full rounded-2xl border border-[#d9e3ef] bg-white px-4 text-sm text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition-all placeholder:text-ink-5",
            "hover:border-[#c4d5ea] focus:border-brand focus:ring-4 focus:ring-brand/10",
            rightSlot && "pr-12",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100"
          )}
          {...register}
        />
        {rightSlot && <div className="absolute right-4 top-1/2 -translate-y-1/2">{rightSlot}</div>}
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

const AUTH_MESSAGES: Record<string, string> = {
  session_expired: "Your session expired. Sign in again to continue.",
  auth_required: "Sign in to access the clinic console.",
  network_error: "A network issue interrupted your session. Please sign in again.",
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [sessionMsg, setSessionMsg] = useState<string | null>(null)

  useEffect(() => {
    const reason = searchParams.get("reason")
    if (reason && reason in AUTH_MESSAGES) {
      setSessionMsg(AUTH_MESSAGES[reason as keyof typeof AUTH_MESSAGES])
    }
  }, [searchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
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
      toast.error("Could not initiate Google sign-in. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {sessionMsg && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-900">{sessionMsg}</p>
        </div>
      )}

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2.5 rounded-2xl border border-[#d9e3ef] bg-white text-sm font-medium text-ink-3 transition-all",
          "hover:border-brand/25 hover:bg-brand/5 hover:text-brand disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Continue with Google
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="h-px flex-1 bg-[#dfe7f2]" />
        <span className="text-xs uppercase tracking-[0.14em] text-ink-5">or with email</span>
        <div className="h-px flex-1 bg-[#dfe7f2]" />
      </div>

      <Field
        id="email"
        label="Email address"
        type="email"
        placeholder="you@clinic.com"
        autoComplete="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <Field
        id="password"
        label="Password"
        type={showPw ? "text" : "password"}
        placeholder="Enter your password"
        autoComplete="current-password"
        register={register("password")}
        error={errors.password?.message}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            aria-label={showPw ? "Hide password" : "Show password"}
            className="text-ink-5 transition-colors hover:text-ink-3"
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-sm font-semibold text-white shadow-[0_18px_38px_rgba(28,128,242,0.22)] transition-all",
          "hover:-translate-y-0.5 hover:bg-brand-dark disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        )}
      >
        {isSubmitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</> : "Enter dashboard"}
      </button>

      <p className="text-center text-sm text-ink-4">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-brand transition-colors hover:text-brand-dark">
          Create one
        </Link>
      </p>
    </form>
  )
}
