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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Call History</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data ? `${data.total} call${data.total !== 1 ? "s" : ""} recorded` : "Loading…"}
          </p>
        </div>
        <Select
          value={callFilters.outcome ?? ""}
          onValueChange={(v) => setCallFilters({ outcome: (v || undefined) as CallOutcome | undefined })}
        >
          <SelectTrigger className="w-44 h-9 rounded-xl bg-white border-gray-200 text-sm">
            <SelectValue placeholder="All outcomes" />
          </SelectTrigger>
          <SelectContent>
            {OUTCOME_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <CallLogTable calls={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > (data.items?.length ?? 0) && (
        <p className="text-center text-xs text-gray-400 pt-2">
          Showing {data.items?.length} of {data.total} calls
        </p>
      )}
    </div>
  )
}
