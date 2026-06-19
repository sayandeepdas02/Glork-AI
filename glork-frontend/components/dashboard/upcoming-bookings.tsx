"use client"

import Link from "next/link"
import { AlertTriangle, ArrowRight, Calendar } from "lucide-react"
import { StatusBadge }          from "@/components/bookings/status-badge"
import { useBookings }          from "@/hooks/use-bookings"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"
import type { BookingFilters }  from "@/types"

const UPCOMING_FILTERS: BookingFilters = { page: 1, limit: 5, status: "confirmed" }

export function UpcomingBookings() {
  const { data, isLoading, isError } = useBookings(UPCOMING_FILTERS)

  return (
    <div className="surface-card overflow-hidden h-full">
      <div className="flex items-center justify-between border-b border-[#EEEEEE] px-5 py-3.5">
        <h3 className="text-[13px] font-medium text-[#111111]">Upcoming bookings</h3>
        <Link href="/bookings"
          className="flex items-center gap-1 text-[12px] font-normal text-[#9CA3AF] transition-colors hover:text-[#111111]">
          View all <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
        </Link>
      </div>

      {isLoading && (
        <div className="divide-y divide-[#EEEEEE]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 shrink-0 animate-pulse rounded-lg bg-[#F3F4F6]" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-28 animate-pulse rounded bg-[#F3F4F6]" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-[#F3F4F6]" />
              </div>
              <div className="h-4 w-18 animate-pulse rounded-full bg-[#F3F4F6]" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <AlertTriangle className="h-5 w-5 text-[#D1D5DB] mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-light text-[#9CA3AF]">Could not load bookings</p>
        </div>
      )}

      {!isLoading && !isError && !data?.items.length && (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <Calendar className="h-5 w-5 text-[#D1D5DB] mb-2" strokeWidth={1.5} />
          <p className="text-[12px] font-light text-[#9CA3AF]">No upcoming bookings</p>
          <p className="mt-0.5 text-[11px] font-light text-[#D1D5DB]">Confirmed appointments appear here</p>
        </div>
      )}

      {!isLoading && !isError && !!data?.items.length && (
        <div className="divide-y divide-[#EEEEEE]">
          {data.items.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}
              className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[#FAFAFA]">
              {/* Date chip */}
              <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-[#F3F4F6]">
                <span className="text-[8px] font-medium uppercase leading-none tracking-wider text-[#9CA3AF]">
                  {formatAppointmentDate(booking.appointment_start).slice(0, 3)}
                </span>
                <span className="mt-0.5 text-[14px] font-light leading-none text-[#111111] tabular-nums">
                  {new Date(booking.appointment_start).getDate()}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-normal text-[#111111]">{booking.patient_name}</p>
                <p className="mt-0.5 text-[11px] font-light text-[#9CA3AF]">
                  {formatAppointmentTime(booking.appointment_start)}
                </p>
              </div>

              <StatusBadge status={booking.status} />
              <ArrowRight className="h-3 w-3 text-[#D1D5DB] opacity-0 transition-opacity group-hover:opacity-100" strokeWidth={1.5} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
