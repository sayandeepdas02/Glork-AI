"use client"

import { CallLogTable } from "@/components/calls/call-log-table"
import { useCalls } from "@/hooks/use-calls"
import { useUIStore } from "@/store/ui-store"
import type { CallOutcome } from "@/types"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

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

const PAGE_SIZE = 20

export default function CallsPage() {
  const { callFilters, setCallFilters } = useUIStore()
  const currentPage = callFilters.page ?? 1
  const { data, isLoading } = useCalls({ ...callFilters, page: currentPage, limit: PAGE_SIZE })

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

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
          onValueChange={(v) => setCallFilters({ outcome: (v || undefined) as CallOutcome | undefined, page: 1 })}
        >
          <SelectTrigger className="w-full sm:w-44 h-9 rounded-xl bg-white border-[#D8D8D3] text-sm text-[#555] focus:ring-brand">
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

      <CallLogTable calls={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#bbb]">
            {data.items.length > 0
              ? `${(currentPage - 1) * PAGE_SIZE + 1}–${(currentPage - 1) * PAGE_SIZE + data.items.length} of ${data.total}`
              : `0 of ${data.total}`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-[#D8D8D3] text-[#555] hover:bg-[#F5F5F2] disabled:opacity-30"
              disabled={currentPage <= 1}
              onClick={() => setCallFilters({ page: currentPage - 1 })}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-[#888] min-w-[4rem] text-center">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-[#D8D8D3] text-[#555] hover:bg-[#F5F5F2] disabled:opacity-30"
              disabled={currentPage >= totalPages}
              onClick={() => setCallFilters({ page: currentPage + 1 })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
