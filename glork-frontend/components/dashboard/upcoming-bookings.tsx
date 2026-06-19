"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, Calendar } from "lucide-react"
import { StatusBadge } from "@/components/bookings/status-badge"
import { useBookings } from "@/hooks/use-bookings"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"
import type { BookingFilters } from "@/types"

const UPCOMING_FILTERS: BookingFilters = { page: 1, limit: 5, status: "confirmed" }

export function UpcomingBookings() {
  const { data, isLoading, isError } = useBookings(UPCOMING_FILTERS)

  return (
    <div className="surface-card overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <p className="section-label">Next up</p>
          <h3 className="mt-1 text-[16px] font-semibold text-ink">Upcoming bookings</h3>
        </div>
        <Link
          href="/bookings"
          className="flex items-center gap-1 text-[13px] font-medium text-brand transition-colors hover:text-brand-dark"
        >
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 animate-pulse rounded bg-gray-100" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-5 w-20 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </div>
          <p className="text-[13px] font-medium text-ink">Could not load bookings</p>
          <p className="mt-1 text-[12px] text-ink-5">Check your connection and try again.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && !data?.items.length && (
        <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-light">
            <Calendar className="h-4 w-4 text-brand" />
          </div>
          <p className="text-[13px] font-medium text-ink">No upcoming bookings</p>
          <p className="mt-1 text-[12px] text-ink-5">Confirmed appointments will appear here.</p>
        </div>
      )}

      {/* List */}
      {!isLoading && !isError && !!data?.items.length && (
        <div className="divide-y divide-gray-100">
          {data.items.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-off-white"
            >
              {/* Date chip */}
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-brand-light">
                <span className="text-[9px] font-bold uppercase leading-none tracking-wider text-brand">
                  {formatAppointmentDate(booking.appointment_start).slice(0, 3)}
                </span>
                <span className="mt-0.5 text-[15px] font-bold leading-none text-brand tabular-nums">
                  {new Date(booking.appointment_start).getDate()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{booking.patient_name}</p>
                <p className="mt-0.5 text-[11px] text-ink-5">{formatAppointmentTime(booking.appointment_start)}</p>
              </div>

              <StatusBadge status={booking.status} />
              <ArrowRight className="h-3.5 w-3.5 text-ink-6 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
