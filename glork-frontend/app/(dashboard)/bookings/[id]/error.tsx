"use client"

import { useEffect } from "react"
import { ErrorFallback } from "@/components/error-fallback"

export default function BookingDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[Booking detail error]", error)
  }, [error])

  return (
    <ErrorFallback
      error={error}
      reset={reset}
      description="Could not load this booking. Please try again."
    />
  )
}
