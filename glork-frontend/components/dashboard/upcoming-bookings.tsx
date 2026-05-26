"use client"

import Link from "next/link"
import { Calendar, ChevronRight } from "lucide-react"
import { StatusBadge } from "@/components/bookings/status-badge"
import { useBookings } from "@/hooks/use-bookings"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"

export function UpcomingBookings() {
  const { data, isLoading } = useBookings({ page: 1, limit: 5, status: "confirmed" })

  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <h3 className="text-sm font-semibold text-gray-900">Upcoming Bookings</h3>
        <Link href="/bookings"
          className="flex items-center gap-0.5 text-xs font-medium text-[#1d6b4a] hover:text-[#155638] transition-colors">
          View all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="divide-y divide-gray-50">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-gray-100 animate-pulse" />
                <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
              </div>
              <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      ) : !data?.items.length ? (
        <div className="flex flex-col items-center justify-center py-12 text-center px-4">
          <div className="h-12 w-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-3">
            <Calendar className="h-5 w-5 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-500">No upcoming bookings</p>
          <p className="text-xs text-gray-400 mt-1">Confirmed appointments will appear here</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-50">
          {data.items.map((booking) => (
            <Link
              key={booking.id}
              href={`/bookings/${booking.id}`}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group"
            >
              <div className="h-9 w-9 shrink-0 rounded-xl bg-[#e6f4ed] flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-[#1d6b4a] uppercase leading-none">
                  {formatAppointmentDate(booking.appointment_start).slice(0, 3)}
                </span>
                <span className="text-[11px] font-bold text-[#1d6b4a] tabular-nums leading-none mt-0.5">
                  {new Date(booking.appointment_start).getDate()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{booking.patient_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
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
