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
      <div className="flex items-center gap-3 border-b border-[#e7eef7] bg-[#f7faff] px-5 py-4">
        {["w-28", "w-36", "w-24", "w-20", "w-16"].map((width, index) => (
          <div key={index} className={cn("h-3 rounded bg-[#e6eef8] animate-pulse", width)} />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 border-b border-[#e7eef7] px-5 py-4">
          <div className="h-10 w-10 rounded-2xl bg-[#edf3fb] animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-[#edf3fb] animate-pulse" />
            <div className="h-3 w-24 rounded bg-[#edf3fb] animate-pulse" />
          </div>
          <div className="hidden md:flex gap-2">
            <div className="h-4 w-28 rounded bg-[#edf3fb] animate-pulse" />
          </div>
          <div className="h-5 w-20 rounded-full bg-[#edf3fb] animate-pulse" />
          <div className="h-8 w-8 rounded-2xl bg-[#edf3fb] animate-pulse" />
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
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] border border-[#dfe8f3] bg-[#f3f8ff]">
          <Calendar className="h-6 w-6 text-ink-5" />
        </div>
        <p className="text-sm font-semibold text-ink">No bookings found</p>
        <p className="mt-1.5 max-w-sm text-sm leading-7 text-ink-5">
          Your AI receptionist will automatically add bookings here once patient calls begin converting.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="surface-card overflow-hidden">
        <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px] gap-4 border-b border-[#e7eef7] bg-[#f7faff] px-5 py-4 md:grid">
          {["Patient", "Date & time", "Status", "Source", ""].map((heading) => (
            <p key={heading} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">
              {heading}
            </p>
          ))}
        </div>

        <div className="divide-y divide-[#e7eef7]">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={() => router.push(`/bookings/${booking.id}`)}
              className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 transition-colors hover:bg-[#f7faff] md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_40px]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-brand/15 bg-brand/10">
                  <span className="text-xs font-semibold text-brand">
                    {booking.patient_name.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{booking.patient_name}</p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-ink-5">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span className="font-mono">{booking.patient_phone}</span>
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <p className="text-sm font-medium text-ink">
                  {formatAppointmentDate(booking.appointment_start, timezone)}
                </p>
                <p className="mt-1 text-[11px] text-ink-5">
                  {formatAppointmentTime(booking.appointment_start, timezone)}
                </p>
              </div>

              <div className="hidden md:block">
                <StatusBadge status={booking.status} />
              </div>

              <div className="hidden md:flex items-center gap-1.5">
                {booking.call_log_id ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-brand/15 bg-brand/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-brand">
                    <Zap className="h-3 w-3" /> AI
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#d9e3ef] bg-[#f3f7fd] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-5">
                    Manual
                  </span>
                )}
              </div>

              <div onClick={(event) => event.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-2xl text-ink-5 transition-colors hover:bg-[#eef4fb] hover:text-ink">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-2xl border-[#e4ecf6] bg-white">
                    <DropdownMenuItem className="rounded-xl text-ink-3 focus:bg-[#eff4fb] focus:text-ink" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      View details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-xl text-ink-3 focus:bg-[#eff4fb] focus:text-ink" onClick={() => router.push(`/bookings/${booking.id}`)}>
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-xl text-red-500 focus:bg-red-50 focus:text-red-500"
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
        <AlertDialogContent className="rounded-[28px] border-[#e4ecf6] bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-ink">Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription className="text-ink-4">
              This will cancel the appointment and remove it from Google Calendar. The patient will be notified.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full border-[#d8e2ef] bg-white text-ink-4 hover:bg-[#eff4fb]">
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
              className="rounded-full bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
            >
              {isCancelPending ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
