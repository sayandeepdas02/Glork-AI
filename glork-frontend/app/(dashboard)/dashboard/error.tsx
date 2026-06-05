"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/error-fallback"

export default function DashboardPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Dashboard page error]", error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="Could not load your dashboard. Please try again."
    />
  )
}
