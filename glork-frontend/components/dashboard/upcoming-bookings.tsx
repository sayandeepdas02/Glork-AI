"use client"

import Link from "next/link"
import { AlertTriangle, Calendar, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/bookings/status-badge"
import { useBookings } from "@/hooks/use-bookings"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"
import type { BookingFilters } from "@/types"

const UPCOMING_FILTERS: BookingFilters = { page: 1, limit: 5, status: "confirmed" }

export function UpcomingBookings() {
  const { data, isLoading, isError } = useBookings(UPCOMING_FILTERS)

  return (
    <div className="surface-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-[#e7eef7] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">Next up</p>
          <h3 className="mt-1 text-lg font-semibold text-ink">Upcoming bookings</h3>
        </div>
        <Link href="/bookings" className="flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand-dark">
          View all <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#e7eef7]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-4">
              <div className="h-10 w-10 rounded-2xl bg-[#edf3fb] animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-28 rounded bg-[#edf3fb] animate-pulse" />
                <div className="h-3 w-20 rounded bg-[#edf3fb] animate-pulse" />
              </div>
              <div className="h-5 w-20 rounded-full bg-[#edf3fb] animate-pulse" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-ink">Could not load bookings</p>
          <p className="mt-1 text-xs text-ink-5">Check your connection and try again.</p>
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
            <Calendar className="h-5 w-5 text-brand" />
          </div>
          <p className="text-sm font-medium text-ink">No upcoming bookings</p>
          <p className="mt-1 text-xs text-ink-5">Confirmed appointments will appear here.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#e7eef7]">
          {data.items.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-[#f7faff]"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
                <span className="text-[10px] font-semibold uppercase leading-none text-brand">
                  {formatAppointmentDate(booking.appointment_start).slice(0, 3)}
                </span>
                <span className="mt-1 text-sm font-semibold leading-none text-brand tabular-nums">
                  {new Date(booking.appointment_start).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{booking.patient_name}</p>
                <p className="mt-1 text-xs text-ink-5">{formatAppointmentTime(booking.appointment_start)}</p>
              </div>
              <StatusBadge status={booking.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
