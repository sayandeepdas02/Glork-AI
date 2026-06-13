"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth, useUpdateMe } from "@/hooks/use-auth"

const schema = z.object({
  name: z.string().min(2),
  clinic_name: z.string().min(2),
})

type FormValues = z.infer<typeof schema>

interface StepProfileProps {
  onNext: () => void
}

export function StepProfile({ onNext }: StepProfileProps) {
  const { doctor } = useAuth()
  const { mutateAsync: updateProfile, isPending } = useUpdateMe()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        clinic_name: doctor.clinic_name,
      })
    }
  }, [doctor, reset])

  const onSubmit = async (values: FormValues) => {
    try {
      await updateProfile(values)
      onNext()
    } catch {
      // error feedback handled by useUpdateMe's onError toast
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Confirm your profile</h2>
        <p className="text-sm text-gray-500 mt-1">
          The AI agent will use this information to greet callers.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Full Name</Label>
          <Input placeholder="Dr. Jane Smith" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">Enter your full name</p>}
        </div>
        <div className="space-y-1.5">
          <Label>Clinic Name</Label>
          <Input placeholder="Smith Family Clinic" {...register("clinic_name")} />
          {errors.clinic_name && <p className="text-xs text-red-500">Enter your clinic name</p>}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[#1d6b4a] hover:bg-[#155638] text-white mt-2"
        >
          {isPending ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  )
}
