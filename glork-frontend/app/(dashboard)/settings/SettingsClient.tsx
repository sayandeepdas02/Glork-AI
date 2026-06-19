"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { PageHeader } from "@/components/layout/page-header"
import { useMe, useAuth, useUpdateMe } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"

const profileSchema = z.object({
  name: z.string().min(2),
  clinic_name: z.string().min(2),
})

type ProfileValues = z.infer<typeof profileSchema>

export default function SettingsClient() {
  const { data: doctor, isLoading } = useMe()
  const { logout } = useAuth()
  const { mutateAsync: updateMe, isPending: isSaving } = useUpdateMe()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
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
    await updateMe(values)
    reset(values)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Clinic identity, account details, and the controls that shape how Hyperglork represents your practice."
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3.5 w-20 animate-pulse rounded bg-gray-100" />
                    <div className="h-10 animate-pulse rounded-lg bg-gray-100" />
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-brand text-lg text-white">
                      {getInitials(doctor?.name ?? "")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-ink">{doctor?.name}</p>
                    <p className="text-sm text-ink-4">{doctor?.email}</p>
                  </div>
                </div>

                <Separator className="bg-gray-100" />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                    {errors.name && <p className="text-xs text-red-500">Required</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clinic_name">Clinic name</Label>
                    <Input id="clinic_name" {...register("clinic_name")} aria-invalid={!!errors.clinic_name} />
                    {errors.clinic_name && <p className="text-xs text-red-500">Required</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={doctor?.email ?? ""}
                    disabled
                    className="bg-off-white"
                    aria-describedby="email-hint"
                  />
                  <p id="email-hint" className="text-xs text-ink-5">
                    Email cannot be changed from this screen.
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={!isDirty || isSaving}>
                    {isSaving ? "Saving…" : "Save changes"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="border-red-100">
          <CardHeader>
            <CardTitle className="text-red-600">Danger zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm font-medium text-ink">Sign out</p>
              <p className="text-sm leading-7 text-ink-4">
                End the current session on this device and return to the sign-in screen.
              </p>
              <Button variant="outline" onClick={logout} className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                Sign out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
