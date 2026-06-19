"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { CallLogTable }     from "@/components/calls/call-log-table"
import { PageHeader }       from "@/components/layout/page-header"
import { useCalls }         from "@/hooks/use-calls"
import { useUIStore }       from "@/store/ui-store"
import type { CallOutcome } from "@/types"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

const OUTCOME_OPTIONS = [
  { value: "", label: "All outcomes" },
  { value: "booked",      label: "Booked" },
  { value: "enquiry",     label: "Enquiry" },
  { value: "cancelled",   label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "transferred", label: "Transferred" },
  { value: "failed",      label: "Failed" },
  { value: "unanswered",  label: "Unanswered" },
]

function Pagination({
  page, limit, total, onPageChange,
}: { page: number; limit: number; total: number; onPageChange: (p: number) => void }) {
  const totalPages = Math.ceil(total / limit)
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[12px] font-normal text-[#6B7280] transition-colors hover:border-[#D1D5DB] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} /> Previous
      </button>
      <span className="text-[12px] font-light text-[#9CA3AF] tabular-nums">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-[12px] font-normal text-[#6B7280] transition-colors hover:border-[#D1D5DB] hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}

export default function CallsClient() {
  const { callFilters, setCallFilters } = useUIStore()
  const { data, isLoading, isError }    = useCalls(callFilters)
  const page  = callFilters.page  ?? 1
  const limit = callFilters.limit ?? 20

  return (
    <div className="space-y-5">
      <PageHeader
        title="Calls"
        description="Inspect every conversation, outcome, and summary produced by the AI receptionist."
      >
        <Select
          value={callFilters.outcome ?? ""}
          onValueChange={(value) =>
            setCallFilters({ outcome: (value || undefined) as CallOutcome | undefined, page: 1 })
          }
        >
          <SelectTrigger
            className="h-9 w-[160px] rounded-lg border-[#E5E7EB] bg-white text-[12px] font-normal text-[#6B7280]"
            aria-label="Filter by call outcome"
          >
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#EEEEEE] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
            {OUTCOME_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}
                className="rounded-lg text-[12px] font-normal text-[#333333] focus:bg-[#F9FAFB]">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {isError ? (
        <div className="surface-card px-6 py-12 text-center">
          <p className="text-[13px] font-light text-[#9CA3AF]">Could not load call history.</p>
        </div>
      ) : (
        <>
          <CallLogTable calls={data?.items ?? []} isLoading={isLoading} />
          {data && (
            <Pagination page={page} limit={limit} total={data.total}
              onPageChange={(p) => setCallFilters({ page: p })} />
          )}
        </>
      )}
    </div>
  )
}
