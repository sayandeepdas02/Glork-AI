"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { BookingTable } from "@/components/bookings/booking-table"
import { BookingFilters } from "@/components/bookings/booking-filters"
import { BookingForm } from "@/components/bookings/booking-form"
import { PageHeader } from "@/components/layout/page-header"
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
    <div className="flex items-center justify-center gap-3 pt-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:border-gray-300 hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Previous
      </button>
      <span className="text-[13px] text-[#9CA3AF] tabular-nums">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-4 py-2 text-[13px] font-medium text-[#6B7280] transition-colors hover:border-gray-300 hover:text-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next <ChevronRight className="h-3.5 w-3.5" />
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
    <div className="space-y-6">
      <PageHeader
        title="Bookings"
        description="Appointments, confirmations, and schedule changes flowing through the AI reception layer."
      >
        <button
          onClick={() => setCreateOpen(true)}
          aria-label="Create new booking"
          className="inline-flex items-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#333333]"
        >
          <Plus className="h-4 w-4" />
          New booking
        </button>
      </PageHeader>

      <div className="surface-card p-5">
        <BookingFilters />
      </div>

      {isError ? (
        <div className="surface-card border-red-100 bg-red-50 px-6 py-12 text-center">
          <p className="text-sm font-medium text-red-600">Could not load bookings.</p>
          <p className="mt-1 text-xs text-red-400">Check your connection and try again.</p>
        </div>
      ) : (
        <>
          <BookingTable bookings={data?.items ?? []} isLoading={isLoading} />

          {data && (
            <Pagination
              page={page}
              limit={limit}
              total={data.total}
              onPageChange={(nextPage) => setBookingFilters({ page: nextPage })}
            />
          )}
        </>
      )}

      <BookingForm open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
