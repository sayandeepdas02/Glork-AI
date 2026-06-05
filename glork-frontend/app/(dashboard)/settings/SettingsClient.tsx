"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useMe, useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import { updateMe } from "@/lib/api"

const profileSchema = z.object({
  name: z.string().min(2),
  clinic_name: z.string().min(2),
})

type ProfileValues = z.infer<typeof profileSchema>

export default function SettingsClient() {
  const { data: doctor, isLoading } = useMe()
  const { logout } = useAuth()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProfileValues>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (doctor) {
      reset({
        name: doctor.name,
        clinic_name: doctor.clinic_name,
      })
    }
  }, [doctor, reset])

  const onSubmit = async (values: ProfileValues) => {
    try {
      await updateMe(values)
      toast.success("Profile updated")
    } catch {
      toast.error("Failed to update profile")
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500 mt-0.5">Manage your account and preferences</p>
      </div>

      <Card className="rounded-2xl border border-gray-100 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-9 animate-pulse rounded-md bg-gray-100" />
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-gradient-to-br from-[#FF7733] to-[#CC3300] text-white text-lg">
                    {getInitials(doctor?.name ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-gray-900">{doctor?.name}</p>
                  <p className="text-sm text-gray-500">{doctor?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                  {errors.name && <p className="text-xs text-red-500">Required</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="clinic_name">Clinic Name</Label>
                  <Input id="clinic_name" {...register("clinic_name")} aria-invalid={!!errors.clinic_name} />
                  {errors.clinic_name && <p className="text-xs text-red-500">Required</p>}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={doctor?.email ?? ""}
                  disabled
                  className="bg-gray-50"
                  aria-describedby="email-hint"
                />
                <p id="email-hint" className="text-xs text-gray-400">Email cannot be changed.</p>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={!isDirty || isSubmitting}
                  className="bg-brand hover:bg-brand-light text-white"
                >
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-red-100 shadow-card">
        <CardHeader>
          <CardTitle className="text-base text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Sign out</p>
              <p className="text-sm text-gray-500">Sign out of all sessions on this device.</p>
            </div>
            <Button
              variant="outline"
              onClick={logout}
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
