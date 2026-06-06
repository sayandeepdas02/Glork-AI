"use client"

import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorFallbackProps {
  error: Error & { digest?: string }
  reset: () => void
  title?: string
  description?: string
}

export function ErrorFallback({
  error,
  reset,
  title = "Something went wrong",
  description,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
      </div>
      <h3 className="text-sm font-semibold text-[#111] mb-1">{title}</h3>
      <p className="text-xs text-[#888] mb-5 max-w-xs leading-relaxed">
        {description ?? error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-light px-4 py-2 text-sm font-semibold text-[#0A0A0A] transition-all duration-150"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Try again
      </button>
    </div>
  )
}
