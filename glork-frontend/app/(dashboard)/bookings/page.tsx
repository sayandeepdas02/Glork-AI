"use client"

import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { BookingTable } from "@/components/bookings/booking-table"
import { BookingFilters } from "@/components/bookings/booking-filters"
import { BookingForm } from "@/components/bookings/booking-form"
import { useBookings } from "@/hooks/use-bookings"
import { useUIStore } from "@/store/ui-store"
import { Button } from "@/components/ui/button"

const PAGE_SIZE = 20

export default function BookingsPage() {
  const { bookingFilters, setBookingFilters } = useUIStore()
  const currentPage = bookingFilters.page ?? 1
  const { data, isLoading } = useBookings({ ...bookingFilters, page: currentPage, limit: PAGE_SIZE })
  const [createOpen, setCreateOpen] = useState(false)

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1

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
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand hover:bg-brand-light px-4 py-2.5 text-sm font-semibold text-white transition-all duration-150"
        >
          <Plus className="h-4 w-4" />
          New Booking
        </button>
      </div>

      <BookingFilters />
      <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

      {data && data.total > 0 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-[#bbb]">
            {data.items.length > 0
              ? `${(currentPage - 1) * PAGE_SIZE + 1}–${(currentPage - 1) * PAGE_SIZE + data.items.length} of ${data.total} bookings`
              : `0 of ${data.total} bookings`}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 rounded-lg border-[#D8D8D3] text-[#555] hover:bg-[#F5F5F2] disabled:opacity-30"
              disabled={currentPage <= 1}
              onClick={() => setBookingFilters({ page: currentPage - 1 })}
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
              onClick={() => setBookingFilters({ page: currentPage + 1 })}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
