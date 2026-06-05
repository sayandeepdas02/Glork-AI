"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

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
  register: any
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
            "focus:border-[#1d6b4a] focus:ring-2 focus:ring-[#1d6b4a]/10",
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

const AUTH_MESSAGES: Record<string, string> = {
  session_expired: "Your session has expired — please sign in again.",
  auth_required: "Please sign in to continue.",
  network_error: "A network error occurred. Please check your connection and sign in again.",
}

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [showPw, setShowPw] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sessionMsg, setSessionMsg] = useState<string | null>(null)

  useEffect(() => {
    const reason = sessionStorage.getItem("auth_error")
    if (reason) {
      sessionStorage.removeItem("auth_error")
      setSessionMsg(AUTH_MESSAGES[reason] ?? AUTH_MESSAGES.auth_required)
    }
  }, [])

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await login(values.email, values.password)
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? "Invalid email or password")
    } finally {
      setIsSubmitting(false)
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
            className="text-gray-400 hover:text-gray-600 transition-colors"
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        }
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "w-full flex items-center justify-center gap-2 rounded-xl",
          "bg-[#1d6b4a] hover:bg-[#155638] text-white font-semibold",
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

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-[#1d6b4a] hover:text-[#155638] transition-colors">
          Create one free
        </Link>
      </p>
    </form>
  )
}
