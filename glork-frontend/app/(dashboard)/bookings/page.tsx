"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { BookingTable } from "@/components/bookings/booking-table"
import { BookingFilters } from "@/components/bookings/booking-filters"
import { BookingForm } from "@/components/bookings/booking-form"
import { useBookings } from "@/hooks/use-bookings"
import { useUIStore } from "@/store/ui-store"

export default function BookingsPage() {
  const { bookingFilters } = useUIStore()
  const { data, isLoading } = useBookings(bookingFilters)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Bookings</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data ? `${data.total} appointment${data.total !== 1 ? "s" : ""}` : "Loading…"}
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#1d6b4a] hover:bg-[#155638] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 shadow-glow"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </div>

      <BookingFilters />
      <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > (data.items?.length ?? 0) && (
        <p className="text-center text-xs text-gray-400 pt-2">
          Showing {data.items?.length} of {data.total} bookings
        </p>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
