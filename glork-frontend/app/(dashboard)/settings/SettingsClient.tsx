"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PageHeader } from "@/components/layout/page-header"
import { useMe, useAuth, useUpdateMe } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"

const profileSchema = z.object({
  name:        z.string().min(2),
  clinic_name: z.string().min(2),
})

type ProfileValues = z.infer<typeof profileSchema>

export default function SettingsClient() {
  const { data: doctor, isLoading } = useMe()
  const { logout }                  = useAuth()
  const { mutateAsync: updateMe, isPending: isSaving } = useUpdateMe()

  const { register, handleSubmit, reset, formState: { errors, isDirty } } =
    useForm<ProfileValues>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (doctor) reset({ name: doctor.name, clinic_name: doctor.clinic_name })
  }, [doctor, reset])

  const onSubmit = async (values: ProfileValues) => {
    await updateMe(values)
    reset(values)
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        description="Clinic identity, account details, and controls."
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        {/* Profile card */}
        <div className="surface-card p-6">
          <p className="section-label mb-5">Profile</p>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-16 animate-pulse rounded bg-[#F3F4F6]" />
                  <div className="h-9 animate-pulse rounded-lg bg-[#F3F4F6]" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[#111111] text-[13px] font-medium text-white">
                    {getInitials(doctor?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[14px] font-medium text-[#111111]">{doctor?.name}</p>
                  <p className="text-[12px] font-light text-[#9CA3AF]">{doctor?.email}</p>
                </div>
              </div>

              <Separator className="bg-[#EEEEEE]" />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[12px] font-normal text-[#6B7280]">Full name</Label>
                  <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-[11px] font-light text-[#EF4444]">Required</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clinic_name" className="text-[12px] font-normal text-[#6B7280]">Clinic name</Label>
                  <Input id="clinic_name" {...register("clinic_name")} aria-invalid={!!errors.clinic_name} />
                  {errors.clinic_name && <p className="text-[11px] font-light text-[#EF4444]">Required</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[12px] font-normal text-[#6B7280]">Email</Label>
                <Input id="email" value={doctor?.email ?? ""} disabled className="bg-[#FAFAFA] text-[#9CA3AF]" aria-describedby="email-hint" />
                <p id="email-hint" className="text-[11px] font-light text-[#D1D5DB]">Email cannot be changed from this screen.</p>
              </div>

              <div className="flex justify-end pt-1">
                <Button type="submit" disabled={!isDirty || isSaving} size="sm">
                  {isSaving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Danger zone */}
        <div className="surface-card p-6">
          <p className="section-label mb-5">Danger zone</p>
          <div className="space-y-3">
            <p className="text-[13px] font-medium text-[#111111]">Sign out</p>
            <p className="text-[12px] font-light text-[#9CA3AF] leading-relaxed">
              End the current session on this device and return to the sign-in screen.
            </p>
            <Button variant="outline" size="sm" onClick={logout}
              className="border-[#FECACA] text-[#EF4444] hover:bg-[#FEF2F2] hover:border-[#FCA5A5]">
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
