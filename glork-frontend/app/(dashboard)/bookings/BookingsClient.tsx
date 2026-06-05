"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { BookingTable } from "@/components/bookings/booking-table"
import { BookingFilters } from "@/components/bookings/booking-filters"
import { BookingForm } from "@/components/bookings/booking-form"
import { useBookings } from "@/hooks/use-bookings"
import { useUIStore } from "@/store/ui-store"

export default function BookingsClient() {
  const { bookingFilters } = useUIStore()
  const { data, isLoading } = useBookings(bookingFilters)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#111]">Bookings</h2>
            {data && (
              <span className="inline-flex items-center justify-center rounded-full bg-[#F0F0EC] px-2.5 py-0.5 text-xs font-medium text-[#666] border border-[#E0E0DB]">
                {data.total}
              </span>
            )}
          </div>
          <p className="text-sm font-mono text-[#888] mt-1">
            Manage your patient appointments
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create new booking"
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-light px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Booking
        </button>
      </div>

      <BookingFilters />
      <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > (data.items?.length ?? 0) && (
        <p className="text-center text-[10px] font-mono uppercase tracking-widest text-[#bbb] pt-2">
          Showing {data.items?.length} of {data.total} bookings
        </p>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
