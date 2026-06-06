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

function FloatingInput({
  id,
  label,
  type = "text",
  placeholder,
  autoComplete,
  register,
  error,
  rightSlot,
  className,
}: {
  id: string
  label: string
  type?: string
  placeholder?: string
  autoComplete?: string
  register: UseFormRegisterReturn
  error?: string
  rightSlot?: React.ReactNode
  className?: string
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400",
            "transition-all duration-150 outline-none",
            "border-gray-200 hover:border-gray-300",
            "focus:border-[#0A0A0A] focus:ring-2 focus:ring-[#0A0A0A]/8",
            rightSlot && "pr-11",
            error && "border-red-300 focus:border-red-400 focus:ring-red-100",
            className
          )}
          {...register}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
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
  session_expired: "Your session has expired — please sign in again.",
  auth_required: "Please sign in to continue.",
  network_error: "A network error occurred. Please check your connection and sign in again.",
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
    // Read reason from URL query param (set by the axios interceptor).
    // Using query params avoids sessionStorage which is accessible to XSS.
    const reason = searchParams.get("reason")
    if (reason && reason in AUTH_MESSAGES) {
      setSessionMsg(AUTH_MESSAGES[reason as keyof typeof AUTH_MESSAGES])
    }
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
        isAxiosError(err) ? (err.response?.data?.detail ?? "Invalid email or password") : "Invalid email or password"
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
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-800">{sessionMsg}</p>
        </div>
      )}

      <FloatingInput
        id="email"
        label="Email address"
        type="email"
        placeholder="you@clinic.com"
        autoComplete="email"
        register={register("email")}
        error={errors.email?.message}
      />

      <FloatingInput
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
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
          "w-full flex items-center justify-center gap-2 rounded-xl",
          "bg-[#F5E542] hover:bg-[#F9EE6E] text-[#0A0A0A] font-semibold",
          "py-3 text-sm transition-all duration-150",
          "shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5",
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        )}
      >
        {isSubmitting
          ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
          : "Sign in"}
      </button>

      <div className="relative flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting || isGoogleLoading}
        className={cn(
          "w-full flex items-center justify-center gap-2.5 rounded-xl",
          "border border-gray-200 bg-white hover:bg-gray-50",
          "py-3 text-sm font-medium text-gray-700 transition-all duration-150",
          "disabled:opacity-60 disabled:cursor-not-allowed"
        )}
      >
        {isGoogleLoading
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <GoogleIcon />}
        Sign in with Google
      </button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#0A0A0A] underline underline-offset-2 hover:text-[#333] transition-colors">
          Create one free
        </Link>
      </p>
    </form>
  )
}
