"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format, addMinutes } from "date-fns"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateBooking } from "@/hooks/use-bookings"
import { useAgentConfig } from "@/hooks/use-agent-config"
import { useCalendarStatus } from "@/hooks/use-calendar"

const schema = z.object({
  patient_name: z.string().min(2, "Name must be at least 2 characters"),
  patient_phone: z
    .string()
    .regex(/^[+]?[\d\s\-().]{7,15}$/, "Enter a valid phone number"),
  patient_email: z.string().email("Invalid email").optional().or(z.literal("")),
  appointment_date: z.string().min(1, "Date is required"),
  appointment_time: z.string().min(1, "Time is required"),
  reason: z.string().max(500).optional(),
})

type FormValues = z.infer<typeof schema>

interface BookingFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingForm({ open, onOpenChange }: BookingFormProps) {
  const { mutate: create, isPending } = useCreateBooking()
  const { data: agentConfig } = useAgentConfig()
  const { data: calendarStatus } = useCalendarStatus()
  const slotDuration = agentConfig?.slot_duration_mins ?? 30
  const calendarConnected = calendarStatus?.is_connected ?? false

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  function onSubmit(values: FormValues) {
    const start = new Date(`${values.appointment_date}T${values.appointment_time}`)
    const end = addMinutes(start, slotDuration)
    create(
      {
        patient_name: values.patient_name,
        patient_phone: values.patient_phone,
        patient_email: values.patient_email || undefined,
        appointment_start: start.toISOString(),
        appointment_end: end.toISOString(),
        reason: values.reason || undefined,
      },
      {
        onSuccess: () => {
          reset()
          onOpenChange(false)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onOpenChange(false) } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Booking</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <Label htmlFor="patient_name">Patient Name *</Label>
              <Input id="patient_name" placeholder="John Doe" {...register("patient_name")} />
              {errors.patient_name && (
                <p className="text-xs text-red-500">{errors.patient_name.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="patient_phone">Phone *</Label>
              <Input id="patient_phone" placeholder="+91 98765 43210" {...register("patient_phone")} />
              {errors.patient_phone && (
                <p className="text-xs text-red-500">{errors.patient_phone.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="patient_email">Email</Label>
              <Input id="patient_email" type="email" placeholder="Optional" {...register("patient_email")} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="appointment_date">Date *</Label>
              <Input
                id="appointment_date"
                type="date"
                min={format(new Date(), "yyyy-MM-dd")}
                {...register("appointment_date")}
              />
              {errors.appointment_date && (
                <p className="text-xs text-red-500">{errors.appointment_date.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="appointment_time">Time *</Label>
              <Input
                id="appointment_time"
                type="time"
                step="1800"
                {...register("appointment_time")}
              />
              {errors.appointment_time && (
                <p className="text-xs text-red-500">{errors.appointment_time.message}</p>
              )}
            </div>
            <div className="col-span-2 space-y-1">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Reason for visit (optional)"
                rows={2}
                {...register("reason")}
              />
            </div>
          </div>
          {!calendarConnected && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Google Calendar is not connected. Booking will be saved but no calendar event will be created.
            </p>
          )}
          <p className="text-xs text-gray-500">
            Appointment duration: {slotDuration} minutes
          </p>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => { reset(); onOpenChange(false) }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Create Booking"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
