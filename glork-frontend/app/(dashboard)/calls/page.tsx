"use client"

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

export default function CallsPage() {
  const { callFilters, setCallFilters } = useUIStore()
  const { data, isLoading } = useCalls(callFilters)

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
          onValueChange={(v) => setCallFilters({ outcome: (v || undefined) as CallOutcome | undefined })}
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

      {data && data.total > (data.items?.length ?? 0) && (
        <p className="text-center text-[11px] font-mono uppercase tracking-widest text-[#bbb] pt-2">
          Showing {data.items?.length} of {data.total} calls
        </p>
      )}
    </div>
  )
}
