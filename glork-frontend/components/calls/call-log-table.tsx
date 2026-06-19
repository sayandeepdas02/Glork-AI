"use client"

import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import {
  formatDuration, formatPhone, formatAppointmentDate,
  formatAppointmentTime, formatRelativeTime, cn,
} from "@/lib/utils"
import type { CallLog } from "@/types"

interface CallLogTableProps { calls: CallLog[]; isLoading: boolean }

const COL = "grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_80px_minmax(0,1fr)_minmax(0,2fr)_52px]"

function Skeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className={cn("hidden gap-4 border-b border-[#EEEEEE] bg-[#FAFAFA] px-5 py-3 md:grid", COL)}>
        {["Caller","Date & time","Duration","Outcome","Summary",""].map((h) => (
          <div key={h} className="h-2.5 w-16 animate-pulse rounded bg-[#F3F4F6]" />
        ))}
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={cn("grid gap-4 border-b border-[#EEEEEE] px-5 py-4", COL)}>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 animate-pulse rounded-lg bg-[#F3F4F6] shrink-0" />
            <div className="space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-[#F3F4F6]" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-[#F3F4F6]" />
            </div>
          </div>
          <div className="hidden md:block h-3 w-24 animate-pulse rounded bg-[#F3F4F6] my-auto" />
          <div className="hidden md:block h-3 w-10 animate-pulse rounded bg-[#F3F4F6] my-auto" />
          <div className="hidden md:block h-4 w-18 animate-pulse rounded-md bg-[#F3F4F6] my-auto" />
          <div className="hidden md:block h-2.5 w-36 animate-pulse rounded bg-[#F3F4F6] my-auto" />
          <div className="hidden md:block h-3 w-8 animate-pulse rounded bg-[#F3F4F6] my-auto" />
        </div>
      ))}
    </div>
  )
}

function Empty() {
  return (
    <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
      <Phone className="h-6 w-6 text-[#D1D5DB] mb-3" strokeWidth={1.5} />
      <p className="text-[13px] font-normal text-[#333333]">No calls yet</p>
      <p className="mt-1 text-[12px] font-light text-[#9CA3AF] max-w-xs">
        Call logs appear once the AI receptionist starts receiving patient calls.
      </p>
    </div>
  )
}

export function CallLogTable({ calls, isLoading }: CallLogTableProps) {
  if (isLoading) return <Skeleton />
  if (!calls.length) return <Empty />

  return (
    <div className="surface-card overflow-hidden">
      {/* Head */}
      <div className={cn("hidden gap-4 border-b border-[#EEEEEE] bg-[#FAFAFA] px-5 py-3 md:grid", COL)}>
        {["Caller","Date & time","Duration","Outcome","Summary",""].map((h) => (
          <p key={h} className="section-label">{h}</p>
        ))}
      </div>

      {/* Rows */}
      <div className="divide-y divide-[#EEEEEE]">
        {calls.map((call) => (
          <div
            key={call.id}
            className={cn(
              "group grid gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAFAFA]",
              "grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_80px_minmax(0,1fr)_minmax(0,2fr)_52px]"
            )}
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                <Phone className="h-3.5 w-3.5 text-[#9CA3AF]" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[13px] font-normal tabular-nums text-[#111111]">
                  {call.caller_phone ? formatPhone(call.caller_phone, true) : "Unknown"}
                </p>
                {call.started_at && (
                  <p className="mt-0.5 text-[11px] font-light text-[#9CA3AF] md:hidden">
                    {formatRelativeTime(call.started_at)}
                  </p>
                )}
              </div>
            </div>

            {call.started_at ? (
              <div className="hidden md:flex md:flex-col md:justify-center">
                <p className="text-[13px] font-normal text-[#333333]">{formatAppointmentDate(call.started_at)}</p>
                <p className="mt-0.5 text-[11px] font-light text-[#9CA3AF]">{formatAppointmentTime(call.started_at)}</p>
              </div>
            ) : (
              <div className="hidden md:flex items-center text-[13px] font-light text-[#D1D5DB]">—</div>
            )}

            <div className="hidden items-center text-[13px] font-light text-[#9CA3AF] tabular-nums md:flex">
              {call.duration_seconds != null ? formatDuration(call.duration_seconds) : "—"}
            </div>

            <div className="hidden items-center md:flex">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            <div className="hidden items-center md:flex">
              {call.agent_summary
                ? <span className="text-[12px] font-light text-[#9CA3AF] line-clamp-2 leading-relaxed">{call.agent_summary}</span>
                : <span className="text-[11px] font-light text-[#D1D5DB]">No summary</span>
              }
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <OutcomeBadge outcome={call.outcome} />
            </div>

            <div className="hidden items-center justify-end md:flex">
              <Link href={`/calls/${call.id}`}
                className="flex items-center gap-1 text-[11px] font-normal text-[#D1D5DB] opacity-0 transition-all group-hover:opacity-100 hover:text-[#111111]">
                View <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>

            <Link href={`/calls/${call.id}`} className="flex items-center gap-1 text-[11px] font-normal text-[#9CA3AF] md:hidden">
              View <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
