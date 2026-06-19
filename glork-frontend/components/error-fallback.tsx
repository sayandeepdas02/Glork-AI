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
      <div className="h-10 w-10 rounded-lg bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center mb-4">
        <AlertTriangle className="h-4 w-4 text-[#EF4444]" strokeWidth={1.5} />
      </div>
      <h3 className="text-[13px] font-medium text-[#111111] mb-1">{title}</h3>
      <p className="text-[12px] font-light text-[#9CA3AF] mb-5 max-w-xs leading-relaxed">
        {description ?? error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#111111] hover:bg-[#333333] px-4 py-2 text-[12px] font-medium text-white transition-colors"
      >
        <RefreshCw className="h-3 w-3" strokeWidth={1.5} />
        Try again
      </button>
    </div>
  )
}
