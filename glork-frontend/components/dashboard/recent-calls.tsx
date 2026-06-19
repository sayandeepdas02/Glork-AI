"use client"

import Link from "next/link"
import { AlertTriangle, ChevronRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { useCalls } from "@/hooks/use-calls"
import { formatDuration, formatPhone, formatRelativeTime } from "@/lib/utils"
import type { CallFilters } from "@/types"

const RECENT_FILTERS: CallFilters = { page: 1, limit: 5 }

export function RecentCalls() {
  const { data, isLoading, isError } = useCalls(RECENT_FILTERS)

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e7eef7] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">Audit trail</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Recent calls</h3>
        </div>
        <Link href="/calls" className="flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#e7eef7]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="h-10 w-10 rounded-2xl bg-[#edf3fb] animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-[#edf3fb] animate-pulse" />
                <div className="h-3 w-16 rounded bg-[#edf3fb] animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-[#edf3fb] animate-pulse" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-ink">Could not load calls</p>
          <p className="mt-1 text-xs text-ink-5">Check your connection and try again.</p>
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
            <Phone className="h-5 w-5 text-brand" />
          </div>
          <p className="text-sm font-medium text-ink">No calls yet</p>
          <p className="mt-1 text-xs text-ink-5">Call logs appear here once the agent is live.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e7eef7]">
          {data.items.map((call) => (
            <Link
              key={call.id}
              href={`/calls/${call.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#f7faff]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
                <Phone className="h-4 w-4 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-semibold tabular-nums text-ink">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="mt-1 text-xs text-ink-5">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && (
                    <span> · {formatDuration(call.duration_seconds)}</span>
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
