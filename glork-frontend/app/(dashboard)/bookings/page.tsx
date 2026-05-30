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
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white">Bookings</h2>
            {data && (
              <span className="inline-flex items-center justify-center rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white border border-white/10">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-sm font-mono text-[#8A8480] mt-1">
            Manage your patient appointments
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="btn-shine inline-flex items-center gap-1.5 rounded-xl bg-[#FF5500] hover:bg-[#FF7733] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150 shadow-glow-sm"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </div>

      <BookingFilters />
      <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > (data.items?.length ?? 0) && (
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#4A4540] pt-2">
          Showing {data.items?.length} of {data.total} bookings
        </p>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
