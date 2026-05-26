"use client"

import { useState } from "react"
import Link from "next/link"
import { addMinutes, format } from "date-fns"
import { Check, Clock, Mail, MessageSquare, Phone, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/bookings/status-badge"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUpdateBooking } from "@/hooks/use-bookings"
import { useAgentConfig } from "@/hooks/use-agent-config"
import { formatAppointmentDate, formatAppointmentTime, formatRelativeTime } from "@/lib/utils"
import type { Booking } from "@/types"

interface BookingDetailCardProps {
  booking: Booking
}

export function BookingDetailCard({ booking }: BookingDetailCardProps) {
  const { mutate: update, isPending } = useUpdateBooking()
  const { data: agentConfig } = useAgentConfig()
  const [notes, setNotes] = useState(booking.notes ?? "")
  const [cancelOpen, setCancelOpen] = useState(false)
  const [rescheduleOpen, setRescheduleOpen] = useState(false)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const slotDuration = agentConfig?.slot_duration_mins ?? 30

  const handleNotesBlur = () => {
    if (notes !== booking.notes) {
      update({ id: booking.id, data: { notes } })
    }
  }

  const handleCancel = () => {
    update({ id: booking.id, data: { status: "cancelled" } })
    setCancelOpen(false)
  }

  const handleComplete = () => {
    update({ id: booking.id, data: { status: "completed" } })
  }

  const handleReschedule = () => {
    if (!newDate || !newTime) return
    const start = new Date(`${newDate}T${newTime}`)
    const end = addMinutes(start, slotDuration)
    update({
      id: booking.id,
      data: { appointment_start: start.toISOString(), appointment_end: end.toISOString() },
    })
    setRescheduleOpen(false)
  }

  return (
    <>
      <Card className="rounded-2xl border border-gray-100 shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-xl">{booking.patient_name}</CardTitle>
              <div className="mt-2">
                <StatusBadge status={booking.status} />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap justify-end">
              {booking.status === "confirmed" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRescheduleOpen(true)}
                    disabled={isPending}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleComplete}
                    disabled={isPending}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setCancelOpen(true)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Patient info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Patient
            </h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                {booking.patient_name}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" />
                {booking.patient_phone}
              </div>
              {booking.patient_email && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {booking.patient_email}
                </div>
              )}
            </div>
          </div>

          {/* Appointment info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Appointment
            </h4>
            <div className="rounded-lg bg-gray-50 p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>
                  {formatAppointmentDate(booking.appointment_start)}{" "}
                  <span className="text-gray-500">at</span>{" "}
                  {formatAppointmentTime(booking.appointment_start)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 pl-6">
                Duration: {slotDuration} min · until {formatAppointmentTime(booking.appointment_end)}
              </div>
              {booking.reason && (
                <div className="flex items-start gap-2 text-sm text-gray-700 pt-1">
                  <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
                  {booking.reason}
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Doctor Notes
            </h4>
            <Textarea
              placeholder="Add internal notes (autosaved)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              rows={3}
              className="text-sm"
            />
          </div>

          {/* Call link */}
          {booking.call_log_id && (
            <div className="flex items-center justify-between rounded-lg border border-[#e6f4ed] bg-[#f0faf5] px-4 py-3">
              <div className="flex items-center gap-2 text-sm text-[#1d6b4a]">
                <Phone className="h-4 w-4" />
                Booked via AI agent
              </div>
              <Link
                href={`/calls/${booking.call_log_id}`}
                className="text-xs text-[#1d6b4a] hover:underline font-medium"
              >
                View call →
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cancel dialog */}
      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel {booking.patient_name}&apos;s appointment and remove it from Google Calendar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reschedule dialog */}
      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>New Date</Label>
              <Input
                type="date"
                value={newDate}
                min={format(new Date(), "yyyy-MM-dd")}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>New Time</Label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)}>Cancel</Button>
            <Button onClick={handleReschedule} disabled={!newDate || !newTime || isPending}>
              Confirm Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
