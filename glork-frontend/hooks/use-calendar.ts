"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { disconnectCalendar, getCalendarAuthUrl, getCalendarStatus } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"

export function useCalendarStatus() {
  return useQuery({
    queryKey: ["calendar-status"],
    queryFn: getCalendarStatus,
    staleTime: 30_000,
  })
}

export function useConnectCalendar() {
  return useMutation({
    mutationFn: async () => {
      const { auth_url } = await getCalendarAuthUrl()
      window.location.href = auth_url
    },
    onError: (err: Error) => toast.error(err.message || "Failed to get auth URL"),
  })
}

export function useDisconnectCalendar() {
  const qc = useQueryClient()
  const store = useAuthStore()
  return useMutation({
    mutationFn: disconnectCalendar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["calendar-status"] })
      qc.invalidateQueries({ queryKey: ["me"] })
      if (store.doctor) {
        store.setDoctor({ ...store.doctor, is_agent_active: false, calendar_connected: false })
      }
      toast.success("Google Calendar disconnected")
    },
    onError: (err: Error) => toast.error(err.message || "Failed to disconnect calendar"),
  })
}
