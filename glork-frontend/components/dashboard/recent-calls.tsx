"use client"

import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { useCalls } from "@/hooks/use-calls"
import { formatPhone, formatRelativeTime, formatDuration } from "@/lib/utils"

export function RecentCalls() {
  const { data, isLoading } = useCalls({ page: 1, limit: 5 })

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Recent Calls</h3>
        <Link href="/calls"
          className="flex items-center gap-0.5 text-xs font-medium text-[#1d6b4a] hover:text-[#155638] transition-colors">
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <Phone className="h-5 w-5 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">No calls yet</p>
          <p className="text-xs text-gray-400 mt-1">Call logs will appear here once your agent is live</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.items.map((call) => (
            <Link
              key={call.id}
              href={`/calls/${call.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 font-mono tabular-nums">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1.5">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && (
                    <>
                      <span className="text-gray-300">·</span>
                      {formatDuration(call.duration_seconds)}
                    </>
                  )}
                </p>
              </div>
              <OutcomeBadge outcome={call.outcome} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
