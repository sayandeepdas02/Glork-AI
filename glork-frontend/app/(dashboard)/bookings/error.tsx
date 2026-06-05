"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/error-fallback"

export default function BookingsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Bookings error]", error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="Could not load your bookings. Please try again."
    />
  )
}
