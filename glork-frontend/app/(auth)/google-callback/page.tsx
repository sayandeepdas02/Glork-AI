"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import type { Doctor } from "@/types"

function GoogleCallbackInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuth } = useAuthStore()
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function handleCallback() {
      const errorParam = searchParams.get("error")
      if (errorParam) {
        const friendlyErrors: Record<string, string> = {
          access_denied: "You cancelled the Google sign-in.",
          signin_failed: "Sign-in failed. Please try again.",
          missing_params: "Invalid sign-in response. Please try again.",
          invalid_state: "Sign-in session expired. Please try again.",
        }
        setErrorMsg(friendlyErrors[errorParam] ?? "Sign-in failed. Please try again.")
        return
      }

      const accessToken = searchParams.get("access_token")
      const refreshToken = searchParams.get("refresh_token")
      const isNew = searchParams.get("is_new") === "true"

      if (!accessToken || !refreshToken) {
        setErrorMsg("Missing authentication data. Please try again.")
        return
      }

      // Clear tokens from URL immediately to avoid leaking them in history
      window.history.replaceState({}, "", "/google-callback")

      try {
        const { data: doctor } = await api.get<Doctor>("/doctors/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        setAuth(doctor, accessToken, refreshToken)
        router.replace(isNew ? "/onboarding" : "/dashboard")
      } catch {
        setErrorMsg("Failed to complete sign-in. Please try again.")
      }
    }

    handleCallback()
  }, [searchParams, setAuth, router])

  if (errorMsg) {
    return (
      <div className="text-center space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{errorMsg}</p>
        </div>
        <Link
          href="/login"
          className="inline-block text-sm font-semibold text-brand hover:text-brand-dark transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <p className="text-sm text-gray-500">Completing Google sign-in…</p>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Signing you in</h1>
        <p className="text-sm text-gray-500 mt-1.5">Just a moment…</p>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        }
      >
        <GoogleCallbackInner />
      </Suspense>
    </div>
  )
}
