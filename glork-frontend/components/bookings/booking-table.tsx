"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MoreHorizontal, Phone, Zap } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StatusBadge } from "@/components/bookings/status-badge"
import { useUpdateBooking } from "@/hooks/use-bookings"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Booking } from "@/types"

interface BookingTableProps {
  bookings: Booking[]
  isLoading: boolean
}

export function BookingTableSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 bg-gray-50/50">
        {["w-28", "w-36", "w-24", "w-20", "w-16"].map((w, i) => (
          <div key={i} className={cn("h-3 rounded animate-pulse bg-gray-200", w)} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50">
          <div className="h-9 w-9 rounded-xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-gray-100 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function BookingTable({ bookings, isLoading }: BookingTableProps) {
  const router = useRouter()
  const { mutate: update } = useUpdateBooking()
  const [cancelId, setCancelId] = useState<string | null>(null)

  if (isLoading) return <BookingTableSkeleton />

  if (!bookings.length) {
    return (
      <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-sm font-semibold text-gray-700">No bookings found</p>
        <p className="text-sm text-gray-400 mt-1.5 max-w-sm">
          Your AI agent will automatically add bookings when patients call.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl bg-white border border-gray-100 shadow-card overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-3 bg-gray-50/60 border-b border-gray-100">
          {["Patient", "Date & Time", "Status", "Source", ""].map((h) => (
            <p key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-gray-50">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-4 cursor-pointer hover:bg-gray-50/60 transition-colors group"
            >
              {/* Patient */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-gradient-to-br from-emerald-50 to-[#e6f4ed] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#1d6b4a]">
                    {booking.patient_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{booking.patient_name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <Phone className="h-2.5 w-2.5 shrink-0" />
                    <span className="font-mono">{booking.patient_phone}</span>
                  </p>
                </div>
              </div>

              {/* Date & time */}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-700">
                  {formatAppointmentDate(booking.appointment_start)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatAppointmentTime(booking.appointment_start)}
                </p>
              </div>

              {/* Status */}
              <div className="hidden md:block">
                <StatusBadge status={booking.status} />
              </div>

              {/* Source */}
              <div className="hidden md:flex items-center gap-1.5">
                {booking.call_log_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium text-purple-700">
                    <Zap className="h-2.5 w-2.5" /> AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                    Manual
                  </span>
                )}
              </div>

              {/* Actions */}
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => router.push(`/bookings/${booking.id}`)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push(`/bookings/${booking.id}`)}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      disabled={booking.status === "cancelled"}
                      onClick={() => setCancelId(booking.id)}
                    >
                      Cancel booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={!!cancelId} onOpenChange={() => setCancelId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the appointment and remove it from Google Calendar. The patient will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelId) {
                  update({ id: cancelId, data: { status: "cancelled" } })
                  setCancelId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
