"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, MoreHorizontal, Phone, Zap } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { StatusBadge } from "@/components/bookings/status-badge"
import { useUpdateBooking } from "@/hooks/use-bookings"
import { useClinicTimezone } from "@/hooks/use-agent-config"
import { formatAppointmentDate, formatAppointmentTime, cn } from "@/lib/utils"
import type { Booking } from "@/types"

interface BookingTableProps {
  bookings: Booking[]
  isLoading: boolean
}

export function BookingTableSkeleton() {
  return (
    <div className="surface-card overflow-hidden">
      <div className="flex items-center gap-3 border-b border-gray-100 bg-[#FAFAFA] px-5 py-4">
        {["w-28", "w-36", "w-24", "w-20", "w-16"].map((width, index) => (
          <div key={index} className={cn("h-3 rounded bg-[#e6eef8] animate-pulse", width)} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-gray-100 px-5 py-4">
          <div className="h-10 w-10 rounded-2xl bg-gray-100 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-24 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-4 w-28 rounded bg-gray-100 animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-8 w-8 rounded-2xl bg-gray-100 animate-pulse" />
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
      <div className="surface-card flex flex-col items-center justify-center py-20 text-center">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3F4F6]">
          <Calendar className="h-4 w-4 text-[#9CA3AF]" strokeWidth={1.5} />
        </div>
        <p className="text-[13px] font-normal text-[#111111]">No bookings found</p>
        <p className="mt-1 max-w-sm text-[12px] font-light text-[#9CA3AF]">
          Your AI receptionist will automatically add bookings here once patient calls begin converting.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 border-b border-gray-100 bg-[#FAFAFA] px-5 py-4 md:grid">
          {["Patient", "Date & time", "Status", "Source", ""].map((heading) => (
            <p key={heading} className="section-label">{heading}</p>
          ))}
        </div>

        <div className="divide-y divide-[#e7eef7]">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 transition-colors hover:bg-[#FAFAFA] md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                  <span className="text-[11px] font-medium text-[#6B7280]">
                    {booking.patient_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-normal text-[#111111]">{booking.patient_name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] font-light text-[#9CA3AF]">
                    <Phone className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                    <span className="font-mono">{booking.patient_phone}</span>
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-[13px] font-normal text-[#333333]">
                  {formatAppointmentDate(booking.appointment_start, timezone)}
                </p>
                <p className="mt-0.5 text-[11px] font-light text-[#9CA3AF]">
                  {formatAppointmentTime(booking.appointment_start, timezone)}
                </p>
              </div>

              <div className="hidden md:block">
                <StatusBadge status={booking.status} />
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                {booking.call_log_id ? (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#333333]">
                    <Zap className="h-2.5 w-2.5" strokeWidth={1.5} /> AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-md border border-[#E5E7EB] bg-[#FAFAFA] px-2 py-0.5 text-[10px] font-normal uppercase tracking-wider text-[#9CA3AF]">
                    Manual
                  </span>
                )}
              </div>

              <div onClick={(event) => event.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111111]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-gray-100 bg-white">
                    <DropdownMenuItem className="rounded-lg text-[13px] text-[#333333] focus:bg-[#FAFAFA] focus:text-[#111111]" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg text-[13px] text-[#333333] focus:bg-[#FAFAFA] focus:text-[#111111]" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-lg text-[13px] text-red-500 focus:bg-red-50 focus:text-red-500"
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
        <AlertDialogContent className="rounded-xl border-gray-100 bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px] text-ink">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-[#6B7280]">
              This will cancel the appointment and remove it from Google Calendar. The patient will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg text-[13px] border-gray-200 bg-white text-[#6B7280] hover:bg-[#FAFAFA]">
              Keep booking
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isCancelPending}
              onClick={() => {
                if (cancelId) {
                  update({ id: cancelId, data: { status: "cancelled" } })
                  setCancelId(null)
                }
              }}
              className="rounded-lg text-[13px] bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isCancelPending ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
