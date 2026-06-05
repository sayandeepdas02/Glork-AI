"use client"

import Link from "next/link"
import { AlertTriangle, ChevronRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { useCalls } from "@/hooks/use-calls"
import { formatPhone, formatRelativeTime, formatDuration } from "@/lib/utils"
import type { CallFilters } from "@/types"

const RECENT_FILTERS: CallFilters = { page: 1, limit: 5 }

export function RecentCalls() {
  const { data, isLoading, isError } = useCalls(RECENT_FILTERS)

  return (
    <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAE5]">
        <div>
          <h3 className="text-sm font-semibold text-[#111]">Recent Calls</h3>
          <p className="text-[11px] font-mono text-[#aaa] mt-0.5">Last 5 calls from your agent</p>
        </div>
        <Link
          href="/calls"
          className="flex items-center gap-0.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#EAEAE5]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-[#F0F0EC] animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-[#F0F0EC] animate-pulse" />
                <div className="h-3 w-16 rounded bg-[#F0F0EC] animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-[#F0F0EC] animate-pulse" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-[#111]">Could not load calls</p>
          <p className="text-xs text-[#888] mt-1 font-mono">Check your connection and try again</p>
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-brand/8 border border-brand/15 flex items-center justify-center mb-3">
            <Phone className="h-5 w-5 text-brand" />
          </div>
          <p className="text-sm font-medium text-[#111]">No calls yet</p>
          <p className="text-xs text-[#888] mt-1 font-mono">Call logs appear here once your agent is live</p>
        </div>
      ) : (
        <div className="divide-y divide-[#EAEAE5]">
          {data.items.map((call) => (
            <Link
              key={call.id}
              href={`/calls/${call.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors group"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center group-hover:bg-brand/12 transition-colors">
                <Phone className="h-4 w-4 text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111] font-mono tabular-nums">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="text-xs text-[#888] mt-0.5 flex items-center gap-1.5">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && (
                    <>
                      <span className="text-[#ddd]">·</span>
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
