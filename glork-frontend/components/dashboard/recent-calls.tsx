"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { useCalls } from "@/hooks/use-calls"
import { formatDuration, formatPhone, formatRelativeTime } from "@/lib/utils"
import type { CallFilters } from "@/types"

const RECENT_FILTERS: CallFilters = { page: 1, limit: 5 }

export function RecentCalls() {
  const { data, isLoading, isError } = useCalls(RECENT_FILTERS)

  return (
    <div className="surface-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="section-label">Audit trail</p>
          <h3 className="mt-1 text-[16px] font-semibold text-ink">Recent calls</h3>
        </div>
        <Link
          href="/calls"
          className="flex items-center gap-1 text-[13px] font-medium text-brand transition-colors hover:text-brand-dark"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-5 w-16 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-[13px] font-medium text-ink">Could not load calls</p>
          <p className="mt-1 text-[12px] text-ink-5">Check your connection and try again.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && !data?.items.length && (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
            <Phone className="h-4 w-4 text-brand" />
          </div>
          <p className="text-[13px] font-medium text-ink">No calls yet</p>
          <p className="mt-1 text-[12px] text-ink-5">Call logs appear once the agent is live.</p>
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && !!data?.items.length && (
        <div className="divide-y divide-gray-100">
          {data.items.map((call) => (
            <Link
              key={call.id}
              href={`/calls/${call.id}`}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-off-white"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                <Phone className="h-3.5 w-3.5 text-brand" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[13px] font-semibold tabular-nums text-ink">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="mt-0.5 text-[11px] text-ink-5">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && (
                    <span> · {formatDuration(call.duration_seconds)}</span>
                  )}
                </p>
              </div>
              <OutcomeBadge outcome={call.outcome} />
              <ArrowRight className="h-3.5 w-3.5 text-ink-6 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
