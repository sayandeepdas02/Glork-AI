"use client"

import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
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

const COL_GRID = "grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_80px_minmax(0,1fr)_minmax(0,2fr)_56px]"

function CallLogTableSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      {/* Head */}
      <div className={cn("hidden gap-4 border-b border-gray-100 bg-off-white px-5 py-3.5 md:grid", COL_GRID)}>
        {["Caller", "Date & time", "Duration", "Outcome", "Summary", ""].map((h) => (
          <div key={h} className="h-3 w-20 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={cn("grid gap-4 border-b border-gray-100 px-5 py-4", COL_GRID)}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 animate-pulse rounded-xl bg-gray-100 shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-28 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
          <div className="hidden md:block h-3.5 w-24 animate-pulse rounded bg-gray-100 my-auto" />
          <div className="hidden md:block h-3.5 w-12 animate-pulse rounded bg-gray-100 my-auto" />
          <div className="hidden md:block h-5 w-20 animate-pulse rounded-full bg-gray-100 my-auto" />
          <div className="hidden md:block h-3 w-40 animate-pulse rounded bg-gray-100 my-auto" />
          <div className="hidden md:block h-3.5 w-8 animate-pulse rounded bg-gray-100 my-auto" />
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-light">
        <Phone className="h-5 w-5 text-brand" />
      </div>
      <p className="text-[14px] font-semibold text-ink">No calls yet</p>
      <p className="mt-1 max-w-xs text-[13px] leading-6 text-ink-5">
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
      {/* Table head */}
      <div className={cn("hidden gap-4 border-b border-gray-100 bg-off-white px-5 py-3 md:grid", COL_GRID)}>
        {["Caller", "Date & time", "Duration", "Outcome", "Summary", ""].map((heading) => (
          <p key={heading} className="section-label">{heading}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100">
        {calls.map((call) => (
          <div
            key={call.id}
            className={cn(
              "group grid gap-4 px-5 py-4 transition-colors hover:bg-off-white",
              "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_80px_minmax(0,1fr)_minmax(0,2fr)_56px]"
            )}
          >
            {/* Caller */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-light">
                <Phone className="h-3.5 w-3.5 text-brand" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[13px] font-semibold tabular-nums text-ink">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                {call.started_at && (
                  <p className="mt-0.5 text-[11px] text-ink-5 md:hidden">
                    {formatRelativeTime(call.started_at)}
                  </p>
                )}
              </div>
            </div>

            {/* Date */}
            {call.started_at ? (
              <div className="hidden md:block">
                <p className="text-[13px] font-medium text-ink">{formatAppointmentDate(call.started_at)}</p>
                <p className="mt-0.5 text-[11px] text-ink-5">{formatAppointmentTime(call.started_at)}</p>
              </div>
            ) : (
              <div className="hidden md:flex items-center text-[13px] text-ink-5">—</div>
            )}

            {/* Duration */}
            <div className="hidden items-center text-[13px] text-ink-4 tabular-nums md:flex">
              {call.duration_seconds != null ? formatDuration(call.duration_seconds) : "—"}
            </div>

            {/* Outcome */}
            <div className="hidden items-center md:flex">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            {/* Summary */}
            <div className="hidden items-center md:flex">
              {call.agent_summary ? (
                <span className="text-[12px] leading-relaxed text-ink-4 line-clamp-2">
                  {call.agent_summary}
                </span>
              ) : (
                <span className="text-[11px] text-ink-6">No summary</span>
              )}
            </div>

            {/* Mobile: outcome badge */}
            <div className="flex items-center gap-2 md:hidden">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            {/* Desktop: view link */}
            <div className="hidden items-center justify-end md:flex">
              <Link
                href={`/calls/${call.id}`}
                className="flex items-center gap-1 text-[12px] font-semibold text-brand opacity-0 transition-opacity group-hover:opacity-100 hover:text-brand-dark"
              >
                View <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Mobile: view link */}
            <Link href={`/calls/${call.id}`} className="flex items-center gap-1 text-[12px] font-semibold text-brand md:hidden">
              View <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
