"use client"

import Link from "next/link"
import { ChevronRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { useCalls } from "@/hooks/use-calls"
import { formatPhone, formatRelativeTime, formatDuration } from "@/lib/utils"

export function RecentCalls() {
  const { data, isLoading } = useCalls({ page: 1, limit: 5 })

  return (
    <div className="rounded-2xl bg-[#141210] border border-white/6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent Calls</h3>
          <p className="text-[10px] font-mono text-[#4A4540] mt-0.5">Last 5 calls from your agent</p>
        </div>
        <Link
          href="/calls"
          className="flex items-center gap-0.5 text-xs font-medium text-[#FF7733] hover:text-[#FF5500] transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-white/4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-white/5 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-white/5 animate-pulse" />
                <div className="h-3 w-16 rounded bg-white/5 animate-pulse" />
              </div>
              <div className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
            </div>
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center mb-3">
            <Phone className="h-5 w-5 text-[#FF7733]" />
          </div>
          <p className="text-sm font-medium text-white">No calls yet</p>
          <p className="text-xs text-[#4A4540] mt-1 font-mono">Call logs appear here once your agent is live</p>
        </div>
      ) : (
        <div className="divide-y divide-white/4">
          {data.items.map((call) => (
            <Link
              key={call.id}
              href={`/calls/${call.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/3 transition-colors group"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/15 flex items-center justify-center group-hover:bg-[#FF5500]/15 transition-colors">
                <Phone className="h-4 w-4 text-[#FF7733]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white font-mono tabular-nums">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                <p className="text-xs text-[#4A4540] mt-0.5 flex items-center gap-1.5">
                  {formatRelativeTime(call.created_at)}
                  {call.duration_seconds != null && (
                    <>
                      <span className="text-white/10">·</span>
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
