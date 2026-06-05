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
    <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EAEAE5] bg-[#FAFAF8]">
        {["w-24", "w-32", "w-20", "w-20", "flex-1"].map((w, i) => (
          <div key={i} className={cn("h-3 rounded animate-pulse bg-[#E8E8E3]", w)} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#EAEAE5]">
          <div className="h-9 w-9 rounded-xl bg-[#F0F0EC] animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-28 rounded bg-[#F0F0EC] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#F0F0EC] animate-pulse" />
          </div>
          <div className="hidden md:flex gap-3">
            <div className="h-3 w-16 rounded bg-[#F0F0EC] animate-pulse" />
            <div className="h-3 w-14 rounded bg-[#F0F0EC] animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-[#F0F0EC] animate-pulse" />
          <div className="h-3.5 w-10 rounded bg-[#F0F0EC] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#D8D8D3] bg-white flex flex-col items-center justify-center py-20 text-center">
      <div className="h-14 w-14 rounded-2xl bg-[#F0F0EC] border border-[#E8E8E3] flex items-center justify-center mb-4">
        <Phone className="h-6 w-6 text-[#aaa]" />
      </div>
      <p className="text-sm font-semibold text-[#111]">No calls yet</p>
      <p className="text-xs font-mono text-[#888] mt-1.5 max-w-xs">
        Call logs will appear here once the AI agent starts receiving calls.
      </p>
    </div>
  )
}

export function CallLogTable({ calls, isLoading }: CallLogTableProps) {
  if (isLoading) return <CallLogTableSkeleton />
  if (!calls.length) return <EmptyState />

  return (
    <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px] gap-4 items-center px-5 py-3 bg-[#FAFAF8] border-b border-[#EAEAE5]">
        {["Caller", "Date & Time", "Duration", "Outcome", "Summary", ""].map((h) => (
          <p key={h} className="text-[11px] font-mono font-semibold text-[#bbb] uppercase tracking-widest">{h}</p>
        ))}
      </div>

      <div className="divide-y divide-[#EAEAE5]">
        {calls.map((call) => (
          <div
            key={call.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px] gap-4 items-center px-5 py-4 hover:bg-[#FAFAF8] transition-colors group"
          >
            {/* Caller */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 shrink-0 rounded-xl bg-[#F5F5F2] border border-[#E8E8E3] flex items-center justify-center group-hover:bg-brand/8 group-hover:border-brand/20 transition-colors">
                <Phone className="h-4 w-4 text-[#aaa] group-hover:text-brand transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#111] font-mono tabular-nums">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : (
                    <span className="text-[#aaa] font-sans text-xs">Unknown</span>
                  )}
                </p>
                {call.started_at && (
                  <p className="text-[11px] font-mono text-[#888] mt-0.5 md:hidden">
                    {formatRelativeTime(call.started_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Date & time */}
            {call.started_at ? (
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#111]">{formatAppointmentDate(call.started_at)}</p>
                <p className="text-[11px] font-mono text-[#888] mt-0.5">{formatAppointmentTime(call.started_at)}</p>
              </div>
            ) : (
              <div className="hidden md:block text-xs text-[#aaa]">—</div>
            )}

            {/* Duration */}
            <div className="hidden md:block text-[13px] font-mono text-[#888] tabular-nums">
              {call.duration_seconds != null ? formatDuration(call.duration_seconds) : (
                <span className="text-[#ccc]">—</span>
              )}
            </div>

            {/* Outcome */}
            <div className="hidden md:block">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            {/* Summary */}
            <div className="hidden md:block text-xs text-[#888] leading-relaxed">
              {call.agent_summary ? (
                <span className="line-clamp-2">{call.agent_summary}</span>
              ) : (
                <span className="text-[#ccc] text-[11px] font-mono">No summary</span>
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
                className="text-xs font-semibold text-brand hover:text-brand-dark transition-colors opacity-0 group-hover:opacity-100"
              >
                View →
              </Link>
            </div>

            {/* Mobile link */}
            <Link href={`/calls/${call.id}`} className="md:hidden text-xs font-semibold text-brand">
              View →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
