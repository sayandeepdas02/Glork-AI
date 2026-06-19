"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, Phone } from "lucide-react"
import { OutcomeBadge }       from "@/components/calls/outcome-badge"
import { useCalls }           from "@/hooks/use-calls"
import { formatDuration, formatPhone, formatRelativeTime } from "@/lib/utils"
import type { CallFilters }   from "@/types"

const RECENT_FILTERS: CallFilters = { page: 1, limit: 5 }

export function RecentCalls() {
  const { data, isLoading, isError } = useCalls(RECENT_FILTERS)

  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#EEEEEE] px-5 py-3.5">
        <h3 className="text-[13px] font-medium text-[#111111]">Recent calls</h3>
        <Link href="/calls"
          className="flex items-center gap-1 text-[12px] font-normal text-[#9CA3AF] transition-colors hover:text-[#111111]">
          View all <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </div>

      {isLoading && (
        <div className="divide-y divide-[#EEEEEE]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-[#F3F4F6]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-28 animate-pulse rounded bg-[#F3F4F6]" />
                <div className="h-2.5 w-16 animate-pulse rounded bg-[#F3F4F6]" />
              </div>
              <div className="h-4 w-14 animate-pulse rounded-full bg-[#F3F4F6]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <AlertTriangle className="h-5 w-5 text-[#D1D5DB] mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-light text-[#9CA3AF]">Could not load calls</p>
        </div>
      )}

      {!isLoading && !isError && !data?.items.length && (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <Phone className="h-5 w-5 text-[#D1D5DB] mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-light text-[#9CA3AF]">No calls yet</p>
          <p className="mt-0.5 text-[11px] font-light text-[#D1D5DB]">Logs appear once the agent is live</p>
        </div>
      )}

      {!isLoading && !isError && !!data?.items.length && (
        <div className="divide-y divide-[#EEEEEE]">
          {data.items.map((call) => (
            <Link key={call.id} href={`/calls/${call.id}`}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#FAFAFA]">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-mono text-[13px] font-normal tabular-nums text-[#111111]">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="mt-0.5 text-[11px] font-light text-[#9CA3AF]">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && <span> · {formatDuration(call.duration_seconds)}</span>}
                </p>
              </div>
              <OutcomeBadge outcome={call.outcome} />
              <ArrowRight className="h-3 w-3 text-[#D1D5DB] opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
