"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { formatDuration, formatPhone, formatAppointmentDate, formatAppointmentTime, formatRelativeTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { CallLog } from "@/types"

interface CallLogTableProps {
  calls: CallLog[]
  isLoading: boolean
}

function CallLogTableSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
        {["w-24", "w-32", "w-20", "w-20", "flex-1"].map((w, i) => (
          <div key={i} className={cn("h-3 rounded animate-pulse bg-gray-200", w)} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="hidden md:flex gap-3">
            <div className="h-3 w-16 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-14 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-3.5 w-10 rounded bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
        <Phone className="h-6 w-6 text-gray-300" />
      </div>
      <p className="text-sm font-semibold text-gray-700">No calls yet</p>
      <p className="text-sm text-gray-400 mt-1.5 max-w-xs">
        Call logs will appear here once the AI agent starts receiving calls.
      </p>
    </div>
  )
}

export function CallLogTable({ calls, isLoading }: CallLogTableProps) {
  if (isLoading) return <CallLogTableSkeleton />
  if (!calls.length) return <EmptyState />

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px] gap-4 items-center px-5 py-3 bg-gray-50/60 border-b border-gray-100">
        {["Caller", "Date & Time", "Duration", "Outcome", "Summary", ""].map((h) => (
          <p key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</p>
        ))}
      </div>

      <div className="divide-y divide-gray-50">
        {calls.map((call) => (
          <div
            key={call.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px] gap-4 items-center px-5 py-4 hover:bg-gray-50/60 transition-colors group"
          >
            {/* Caller */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-gray-400" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 font-mono tabular-nums">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : (
                    <span className="text-gray-400 font-sans text-xs">Unknown</span>
                  )}
                </p>
                {/* Mobile: date below */}
                {call.started_at && (
                  <p className="text-xs text-gray-400 mt-0.5 md:hidden">
                    {formatRelativeTime(call.started_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Date & time */}
            {call.started_at ? (
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">{formatAppointmentDate(call.started_at)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{formatAppointmentTime(call.started_at)}</p>
              </div>
            ) : (
              <div className="hidden md:block text-xs text-gray-400">—</div>
            )}

            {/* Duration */}
            <div className="hidden md:block text-sm text-gray-600 tabular-nums">
              {call.duration_seconds != null ? formatDuration(call.duration_seconds) : (
                <span className="text-gray-300">—</span>
              )}
            </div>

            {/* Outcome */}
            <div className="hidden md:block">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            {/* Summary */}
            <div className="hidden md:block text-xs text-gray-500 leading-relaxed">
              {call.agent_summary ? (
                <span className="line-clamp-2">{call.agent_summary}</span>
              ) : (
                <span className="text-gray-300 text-[11px]">No summary</span>
              )}
            </div>

            {/* Mobile: outcome badge */}
            <div className="flex items-center gap-2 md:hidden">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            {/* Link */}
            <div className="hidden md:flex justify-end">
              <Link
                href={`/calls/${call.id}`}
                className="text-xs font-semibold text-[#1d6b4a] hover:text-[#155638] transition-colors opacity-0 group-hover:opacity-100"
              >
                View →
              </Link>
            </div>

            {/* Mobile link */}
            <Link href={`/calls/${call.id}`} className="md:hidden text-xs font-semibold text-[#1d6b4a]">
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
