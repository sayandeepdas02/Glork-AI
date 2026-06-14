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
        aria-label="Previous page"
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" /> Previous
      </button>
      <span className="text-xs font-mono text-[#888] tabular-nums">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center gap-1 rounded-xl border border-[#D8D8D3] bg-white px-3 py-2 text-xs font-semibold text-[#555] transition-all hover:bg-[#F5F5F2] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export default function BookingsClient() {
  const { bookingFilters, setBookingFilters } = useUIStore()
  const { data, isLoading, isError } = useBookings(bookingFilters)
  const [createOpen, setCreateOpen] = useState(false)

  const page = bookingFilters.page ?? 1
  const limit = bookingFilters.limit ?? 20

  return (
    <div className="space-y-5">
      <div className="panel-surface flex items-center justify-between rounded-[30px] px-6 py-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Scheduling</p>
          <div className="mt-2 flex items-center gap-3">
            <h2 className="text-[30px] font-semibold tracking-tight text-[#111]">Bookings</h2>
            {data && (
              <span className="inline-flex items-center justify-center rounded-full bg-[#F0F0EC] px-3 py-1 text-xs font-medium text-[#666] border border-[#E0E0DB]">
                {data.total}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-7 text-[#888]">
            Manage your patient appointments
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create new booking"
          className="inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-5 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-[#232323]"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          New Booking
        </button>
      </div>

      <BookingFilters />

      {isError ? (
        <div className="rounded-[28px] border border-red-100 bg-red-50 py-12 text-center">
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
