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
import { useClinicTimezone } from "@/hooks/use-agent-config"
import { formatAppointmentDate, formatAppointmentTime } from "@/lib/utils"
import { cn } from "@/lib/utils"
import type { Booking } from "@/types"

interface BookingTableProps {
  bookings: Booking[]
  isLoading: boolean
}

export function BookingTableSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-[#EAEAE5] bg-[#FAFAF8]">
        {["w-28", "w-36", "w-24", "w-20", "w-16"].map((w, i) => (
          <div key={i} className={cn("h-3 rounded animate-pulse bg-[#E8E8E3]", w)} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-[#EAEAE5]">
          <div className="h-9 w-9 rounded-xl bg-[#F0F0EC] animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 rounded bg-[#F0F0EC] animate-pulse" />
            <div className="h-3 w-24 rounded bg-[#F0F0EC] animate-pulse" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-4 w-28 rounded bg-[#F0F0EC] animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-[#F0F0EC] animate-pulse" />
          <div className="h-7 w-7 rounded-lg bg-[#F0F0EC] animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function BookingTable({ bookings, isLoading }: BookingTableProps) {
  const router = useRouter()
  const { mutate: update, isPending: isCancelPending } = useUpdateBooking()
  const timezone = useClinicTimezone()
  const [cancelId, setCancelId] = useState<string | null>(null)

  if (isLoading) return <BookingTableSkeleton />

  if (!bookings.length) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D8D8D3] bg-white flex flex-col items-center justify-center py-20 text-center">
        <div className="h-14 w-14 rounded-2xl bg-[#F0F0EC] border border-[#E8E8E3] flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-[#aaa]" />
        </div>
        <p className="text-sm font-semibold text-[#111]">No bookings found</p>
        <p className="text-xs font-mono text-[#888] mt-1.5 max-w-sm">
          Your AI agent will automatically add bookings when patients call.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-2xl bg-white border border-[#E8E8E3] overflow-hidden">
        {/* Table header */}
        <div className="hidden md:grid grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-3 bg-[#FAFAF8] border-b border-[#EAEAE5]">
          {["Patient", "Date & Time", "Status", "Source", ""].map((h) => (
            <p key={h} className="text-[11px] font-mono font-semibold text-[#bbb] uppercase tracking-widest">{h}</p>
          ))}
        </div>

        <div className="divide-y divide-[#EAEAE5]">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 items-center px-5 py-4 cursor-pointer hover:bg-[#FAFAF8] transition-colors group"
            >
              {/* Patient */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-brand/8 border border-brand/15 flex items-center justify-center group-hover:border-brand/30 transition-colors">
                  <span className="text-xs font-bold text-brand">
                    {booking.patient_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111] truncate">{booking.patient_name}</p>
                  <p className="text-[11px] text-[#888] flex items-center gap-1 mt-0.5">
                    <Phone className="h-2.5 w-2.5 shrink-0" />
                    <span className="font-mono">{booking.patient_phone}</span>
                  </p>
                </div>
              </div>

              {/* Date & time — displayed in clinic's configured timezone */}
              <div className="hidden md:block">
                <p className="text-sm font-medium text-[#111]">
                  {formatAppointmentDate(booking.appointment_start, timezone)}
                </p>
                <p className="text-[11px] text-[#888] font-mono mt-0.5">
                  {formatAppointmentTime(booking.appointment_start, timezone)}
                </p>
              </div>

              {/* Status */}
              <div className="hidden md:block">
                <StatusBadge status={booking.status} />
              </div>

              {/* Source */}
              <div className="hidden md:flex items-center gap-1.5">
                {booking.call_log_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand/8 border border-brand/20 px-2 py-0.5 text-[10px] font-mono font-medium text-brand">
                    <Zap className="h-2.5 w-2.5" /> AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F0F0EC] border border-[#E0E0DB] px-2 py-0.5 text-[10px] font-mono font-medium text-[#888]">
                    Manual
                  </span>
                )}
              </div>

              {/* Actions */}
              <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#aaa] hover:bg-[#F0F0EC] hover:text-[#555] transition-colors opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white border-[#E8E8E3]">
                    <DropdownMenuItem className="text-[#555] hover:text-[#111] focus:bg-[#F5F5F2]" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-[#555] hover:text-[#111] focus:bg-[#F5F5F2]" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 focus:text-red-500 focus:bg-red-50"
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
        <AlertDialogContent className="bg-white border-[#E8E8E3]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#111]">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              This will cancel the appointment and remove it from Google Calendar. The patient will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white border-[#D8D8D3] text-[#555] hover:bg-[#F5F5F2]">Keep booking</AlertDialogCancel>
            <AlertDialogAction
              disabled={isCancelPending}
              onClick={() => {
                if (cancelId) {
                  update({ id: cancelId, data: { status: "cancelled" } })
                  setCancelId(null)
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
            >
              {isCancelPending ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
