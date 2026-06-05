"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/error-fallback"

export default function CallsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Calls error]", error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="Could not load call history. Please try again."
    />
  )
}
