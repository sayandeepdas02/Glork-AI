"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUIStore } from "@/store/ui-store"
import type { BookingStatus } from "@/types"

const STATUS_OPTIONS: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rescheduled", label: "Rescheduled" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No Show" },
]

export function BookingFilters() {
  const { bookingFilters, setBookingFilters } = useUIStore()

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search patient name or phone…"
          className="pl-9 w-60"
          value={bookingFilters.search ?? ""}
          onChange={(e) =>
            setBookingFilters({ search: e.target.value || undefined, page: 1 })
          }
        />
      </div>

      <Input
        type="date"
        className="w-40"
        value={bookingFilters.date ?? ""}
        onChange={(e) =>
          setBookingFilters({ date: e.target.value || undefined, page: 1 })
        }
      />

      <Select
        value={bookingFilters.status ?? "all"}
        onValueChange={(v) =>
          setBookingFilters({
            status: v === "all" ? undefined : (v as BookingStatus),
            page: 1,
          })
        }
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
