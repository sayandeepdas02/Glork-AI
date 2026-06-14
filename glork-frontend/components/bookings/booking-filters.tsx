"use client"

import { useEffect, useRef, useState } from "react"
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
import { useDebounce } from "@/hooks/use-debounce"
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

  // Local state for search so the input doesn't lag, debounced before committing to store
  const [searchInput, setSearchInput] = useState(bookingFilters.search ?? "")
  const debouncedSearch = useDebounce(searchInput, 350)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    setBookingFilters({ search: debouncedSearch || undefined, page: 1 })
  }, [debouncedSearch, setBookingFilters])

  return (
    <div className="panel-surface flex flex-wrap items-center gap-3 rounded-[28px] p-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search patient name or phone…"
          className="pl-9 w-60"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
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
