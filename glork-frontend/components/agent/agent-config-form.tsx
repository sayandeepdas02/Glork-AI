"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAgentConfig, useUpdateAgentConfig } from "@/hooks/use-agent-config"

const schema = z.object({
  language: z.enum(["en", "hi", "ta"]),
  greeting_message: z.string().min(10, "Greeting must be at least 10 characters").max(500),
  emergency_transfer_number: z.string().optional(),
  slot_duration_mins: z.coerce.number().min(10).max(120),
  max_advance_booking_days: z.coerce.number().min(1).max(365),
})

type FormValues = z.infer<typeof schema>

const LANGUAGES: { value: "en" | "hi" | "ta"; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
]

export function AgentConfigForm() {
  const { data: config, isLoading } = useAgentConfig()
  const { mutate: update, isPending } = useUpdateAgentConfig()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (config) {
      reset({
        language: config.language,
        greeting_message: config.greeting_message,
        emergency_transfer_number: config.emergency_transfer_number ?? "",
        slot_duration_mins: config.slot_duration_mins,
        max_advance_booking_days: config.max_advance_booking_days,
      })
    }
  }, [config, reset])

  const onSubmit = (values: FormValues) => {
    update(values)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-11 animate-pulse rounded-2xl bg-gray-100" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label>Language</Label>
        <Select
          value={watch("language")}
          onValueChange={(v) => setValue("language", v as "en" | "hi" | "ta", { shouldDirty: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {LANGUAGES.map((l) => (
              <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 rounded-[24px] bg-[var(--bg-surface)] p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Voice behavior</p>
          <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
            Define how the receptionist greets callers and handles escalation details.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--text-primary)]">Booking rules</p>
          <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">
            Control slot length and how far in advance the AI can schedule appointments.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="greeting_message">Greeting Message</Label>
        <Textarea
          id="greeting_message"
          placeholder="Hello! Thank you for calling Dr. Smith's clinic..."
          rows={3}
          {...register("greeting_message")}
        />
        {errors.greeting_message && (
          <p className="text-xs text-red-500">{errors.greeting_message.message}</p>
        )}
        <p className="text-xs text-gray-400">
          The first thing the AI says when it answers a call.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="emergency_transfer_number">Emergency Transfer Number</Label>
        <Input
          id="emergency_transfer_number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          {...register("emergency_transfer_number")}
        />
        <p className="text-xs text-gray-400">
          The AI transfers calls to this number if the patient describes an emergency.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="slot_duration_mins">Appointment Duration (mins)</Label>
          <Input
            id="slot_duration_mins"
            type="number"
            min={10}
            max={120}
            step={5}
            {...register("slot_duration_mins")}
          />
          {errors.slot_duration_mins && (
            <p className="text-xs text-red-500">{errors.slot_duration_mins.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="max_advance_booking_days">Max Advance Booking (days)</Label>
          <Input
            id="max_advance_booking_days"
            type="number"
            min={1}
            max={365}
            {...register("max_advance_booking_days")}
          />
          {errors.max_advance_booking_days && (
            <p className="text-xs text-red-500">{errors.max_advance_booking_days.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          disabled={!isDirty || isPending}
          className="rounded-full bg-[#111111] text-white hover:bg-[#232323]"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </Button>
      </div>
    </form>
  )
}
