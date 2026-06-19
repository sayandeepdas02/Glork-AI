"use client"

import Link from "next/link"
import { Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import {
  formatDuration,
  formatPhone,
  formatAppointmentDate,
  formatAppointmentTime,
  formatRelativeTime,
  cn,
} from "@/lib/utils"
import type { CallLog } from "@/types"

interface CallLogTableProps {
  calls: CallLog[]
  isLoading: boolean
}

function CallLogTableSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-[#e7eef7] bg-[#f7faff] px-5 py-4">
        {["w-24", "w-32", "w-20", "w-20", "flex-1"].map((width, index) => (
          <div key={index} className={cn("h-3 rounded bg-[#e6eef8] animate-pulse", width)} />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-[#e7eef7] px-5 py-4">
          <div className="h-10 w-10 rounded-2xl bg-[#edf3fb] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-28 rounded bg-[#edf3fb] animate-pulse" />
            <div className="h-3 w-20 rounded bg-[#edf3fb] animate-pulse" />
          </div>
          <div className="hidden md:flex gap-3">
            <div className="h-3 w-16 rounded bg-[#edf3fb] animate-pulse" />
            <div className="h-3 w-14 rounded bg-[#edf3fb] animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-[#edf3fb] animate-pulse" />
          <div className="h-3.5 w-10 rounded bg-[#edf3fb] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] border border-[#dfe8f3] bg-[#f3f8ff]">
        <Phone className="h-6 w-6 text-ink-5" />
      </div>
      <p className="text-sm font-semibold text-ink">No calls yet</p>
      <p className="mt-1.5 max-w-xs text-sm leading-7 text-ink-5">
        Call logs will appear here once the AI receptionist starts receiving patient calls.
      </p>
    </div>
  )
}

export function CallLogTable({ calls, isLoading }: CallLogTableProps) {
  if (isLoading) return <CallLogTableSkeleton />
  if (!calls.length) return <EmptyState />

  return (
    <div className="surface-card overflow-hidden">
      <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px] gap-4 border-b border-[#e7eef7] bg-[#f7faff] px-5 py-4 md:grid">
        {["Caller", "Date & time", "Duration", "Outcome", "Summary", ""].map((heading) => (
          <p key={heading} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">
            {heading}
          </p>
        ))}
      </div>

      <div className="divide-y divide-[#e7eef7]">
        {calls.map((call) => (
          <div
            key={call.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 transition-colors hover:bg-[#f7faff] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_80px_minmax(0,1fr)_minmax(0,2fr)_60px]"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
                <Phone className="h-4 w-4 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-sm font-semibold tabular-nums text-ink">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                {call.started_at && (
                  <p className="mt-1 text-[11px] text-ink-5 md:hidden">{formatRelativeTime(call.started_at)}</p>
                )}
              </div>
            </div>

            {call.started_at ? (
              <div className="hidden md:block">
                <p className="text-sm font-medium text-ink">{formatAppointmentDate(call.started_at)}</p>
                <p className="mt-1 text-[11px] text-ink-5">{formatAppointmentTime(call.started_at)}</p>
              </div>
            ) : (
              <div className="hidden md:block text-xs text-ink-5">—</div>
            )}

            <div className="hidden text-[13px] text-ink-4 tabular-nums md:block">
              {call.duration_seconds != null ? formatDuration(call.duration_seconds) : "—"}
            </div>

            <div className="hidden md:block">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            <div className="hidden text-xs leading-relaxed text-ink-4 md:block">
              {call.agent_summary ? (
                <span className="line-clamp-2">{call.agent_summary}</span>
              ) : (
                <span className="text-[11px] text-ink-5">No summary</span>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            <div className="hidden justify-end md:flex">
              <Link href={`/calls/${call.id}`} className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark">
                View
              </Link>
            </div>

            <Link href={`/calls/${call.id}`} className="text-sm font-semibold text-brand md:hidden">
              View
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
