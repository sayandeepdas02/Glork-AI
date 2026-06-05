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
    <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#EAEAE5]">
        <div>
          <h3 className="text-sm font-semibold text-[#111]">Upcoming Bookings</h3>
          <p className="text-[11px] font-mono text-[#aaa] mt-0.5">Next confirmed appointments</p>
        </div>
        <Link
          href="/bookings"
          className="flex items-center gap-0.5 text-xs font-medium text-brand hover:text-brand-dark transition-colors"
        >
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-[#EAEAE5]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-[#F0F0EC] animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-[#F0F0EC] animate-pulse" />
                <div className="h-3 w-20 rounded bg-[#F0F0EC] animate-pulse" />
              </div>
              <div className="h-5 w-20 rounded-full bg-[#F0F0EC] animate-pulse" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mb-3">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium text-[#111]">Could not load bookings</p>
          <p className="text-xs text-[#888] mt-1 font-mono">Check your connection and try again</p>
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-brand/8 border border-brand/15 flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-brand" />
          </div>
          <p className="text-sm font-medium text-[#111]">No upcoming bookings</p>
          <p className="text-xs text-[#888] mt-1 font-mono">Confirmed appointments will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-[#EAEAE5]">
          {data.items.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#FAFAF8] transition-colors group"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-brand/8 border border-brand/15 flex flex-col items-center justify-center group-hover:bg-brand/15 transition-colors">
                <span className="text-[10px] font-bold text-brand uppercase leading-none">
                  {formatAppointmentDate(booking.appointment_start).slice(0, 3)}
                </span>
                <span className="text-[11px] font-bold text-brand tabular-nums leading-none mt-0.5">
                  {new Date(booking.appointment_start).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#111] truncate">{booking.patient_name}</p>
                <p className="text-xs text-[#888] mt-0.5">
                  {formatAppointmentTime(booking.appointment_start)}
                </p>
              </div>
              <StatusBadge status={booking.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
