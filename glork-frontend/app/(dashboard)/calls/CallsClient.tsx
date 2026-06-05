"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { CallLogTable } from "@/components/calls/call-log-table"
import { useCalls } from "@/hooks/use-calls"
import { useUIStore } from "@/store/ui-store"
import type { CallOutcome } from "@/types"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

const OUTCOME_OPTIONS = [
  { value: "", label: "All outcomes" },
  { value: "booked", label: "Booked" },
  { value: "enquiry", label: "Enquiry" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "transferred", label: "Transferred" },
  { value: "failed", label: "Failed" },
  { value: "unanswered", label: "Unanswered" },
]

function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: {
  page: number
  limit: number
  total: number
  onPageChange: (page: number) => void
}) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
      </button>
      <span className="text-xs font-mono text-[#888] tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default function CallsClient() {
  const { callFilters, setCallFilters } = useUIStore()
  const { data, isLoading, isError } = useCalls(callFilters)

  const page = callFilters.page ?? 1
  const limit = callFilters.limit ?? 20

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#111]">Call History</h2>
            {data && (
              <span className="inline-flex items-center justify-center rounded-full bg-[#F0F0EC] px-2.5 py-0.5 text-xs font-medium text-[#666] border border-[#E0E0DB]">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-sm font-mono text-[#888] mt-1">
            Review and audit AI interactions
          </p>
        </div>

        <Select
          value={callFilters.outcome ?? ""}
          onValueChange={(v) =>
            setCallFilters({ outcome: (v || undefined) as CallOutcome | undefined, page: 1 })
          }
        >
          <SelectTrigger
            className="w-full sm:w-44 h-9 rounded-xl bg-white border-[#D8D8D3] text-sm text-[#555] focus:ring-brand"
            aria-label="Filter by call outcome"
          >
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent className="bg-white border-[#E8E8E3]">
            {OUTCOME_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-[#555] focus:bg-[#F5F5F2] focus:text-[#111]">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 py-12 text-center">
          <p className="text-sm font-medium text-red-600">Could not load call history.</p>
          <p className="text-xs text-red-400 mt-1">Check your connection and try again.</p>
        </div>
      ) : (
        <>
          <CallLogTable calls={data?.items ?? []} isLoading={isLoading} />

          {data && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={(p) => setCallFilters({ page: p })}
            />
          )}
        </>
      )}
    </div>
  )
}
