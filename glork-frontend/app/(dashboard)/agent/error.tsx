"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/error-fallback"

export default function AgentError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Agent error]", error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="Could not load agent configuration. Please try again."
    />
  )
}
