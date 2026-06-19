"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { CallLogTable } from "@/components/calls/call-log-table"
import { PageHeader } from "@/components/layout/page-header"
import { useCalls } from "@/hooks/use-calls"
import { useUIStore } from "@/store/ui-store"
import type { CallOutcome } from "@/types"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <div className="flex items-center justify-center gap-3 pt-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-ink-4 transition-colors hover:border-gray-300 hover:text-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Previous
      </button>
      <span className="text-[13px] text-ink-5 tabular-nums">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-ink-4 transition-colors hover:border-gray-300 hover:text-ink-2 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-3.5 w-3.5" />
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
      <PageHeader
        title="Call logs"
        description="Inspect every conversation, outcome, and summary produced by the AI receptionist."
      >
        <Select
          value={callFilters.outcome ?? ""}
          onValueChange={(value) =>
            setCallFilters({ outcome: (value || undefined) as CallOutcome | undefined, page: 1 })
          }
        >
          <SelectTrigger
            className="h-10 w-[180px] rounded-lg border-gray-200 bg-white px-3 text-[13px] text-ink-4 focus:ring-brand"
            aria-label="Filter by call outcome"
          >
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-100 bg-white shadow-card-md">
            {OUTCOME_OPTIONS.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="rounded-lg text-[13px] text-ink-3 focus:bg-off-white focus:text-ink"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </PageHeader>

      {isError ? (
        <div className="surface-card border-red-100 bg-red-50 px-6 py-12 text-center">
          <p className="text-[14px] font-medium text-red-600">Could not load call history.</p>
          <p className="mt-1 text-[12px] text-red-400">Check your connection and try again.</p>
        </div>
      ) : (
        <>
          <CallLogTable calls={data?.items ?? []} isLoading={isLoading} />
          {data && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={(nextPage) => setCallFilters({ page: nextPage })}
            />
          )}
        </>
      )}
    </div>
  )
}
