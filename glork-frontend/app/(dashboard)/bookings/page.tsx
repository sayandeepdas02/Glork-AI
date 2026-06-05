"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BookingTable } from "@/components/bookings/booking-table"
import { BookingFilters } from "@/components/bookings/booking-filters"
import { BookingForm } from "@/components/bookings/booking-form"
import { useBookings } from "@/hooks/use-bookings"
import { useUIStore } from "@/store/ui-store"

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
    <div className="flex items-center justify-center gap-3 pt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Previous
      </button>
      <span className="text-xs font-mono text-[#888] tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export default function BookingsPage() {
  const { bookingFilters, setBookingFilters } = useUIStore()
  const { data, isLoading, isError } = useBookings(bookingFilters)
  const [createOpen, setCreateOpen] = useState(false)

  const page = bookingFilters.page ?? 1
  const limit = bookingFilters.limit ?? 20

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

      {isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 py-12 text-center">
          <p className="text-sm font-medium text-red-600">Could not load bookings.</p>
          <p className="text-xs text-red-400 mt-1">Check your connection and try again.</p>
        </div>
      ) : (
        <>
          <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

          {data && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={(p) => setBookingFilters({ page: p })}
            />
          )}
        </>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
