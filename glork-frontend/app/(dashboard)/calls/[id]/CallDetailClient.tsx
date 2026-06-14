"use client"

import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { CallDetailCard } from "@/components/calls/call-detail-card"
import { TranscriptViewer } from "@/components/calls/transcript-viewer"
import { useCall } from "@/hooks/use-calls"

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded-2xl bg-gray-100 ${className ?? ""}`} />
}

export default function CallDetailClient({ id }: { id: string }) {
  const { data: call, isLoading, isError } = useCall(id)

  return (
    <div className="space-y-5 max-w-4xl">
      <Link
        href="/calls"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Call History
      </Link>

      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-52 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      )}

      {isError && (
        <div className="rounded-[28px] border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-medium text-red-600">Could not load this call.</p>
          <Link href="/calls" className="text-sm text-red-400 underline mt-2 inline-block">
            Back to call history
          </Link>
        </div>
      )}

      {call && (
        <>
          <CallDetailCard call={call} />
          <TranscriptViewer transcript={call.transcript} />
        </>
      )}
    </div>
  )
}
