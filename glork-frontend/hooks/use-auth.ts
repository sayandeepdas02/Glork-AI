"use client"

import { useCallback } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { login as apiLogin, logout as apiLogout, register as apiRegister, getMe, updateMe } from "@/lib/api"
import { useAuthStore } from "@/store/auth-store"
import type { Doctor, RegisterData } from "@/types"

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  const loginFn = useCallback(
    async (email: string, password: string) => {
      const tokens = await apiLogin(email, password)
      const doctor = await getMe()
      store.setAuth(doctor, tokens.access_token, tokens.refresh_token)
      return doctor
    },
    [store]
  )

  const registerFn = useCallback(
    async (data: RegisterData) => {
      const tokens = await apiRegister(data)
      const doctor = await getMe()
      store.setAuth(doctor, tokens.access_token, tokens.refresh_token)
      return doctor
    },
    [store]
  )

  const logoutFn = useCallback(async () => {
    try {
      await apiLogout()
    } catch {}
    store.clearAuth()
    router.push("/login")
  }, [store, router])

  return {
    doctor: store.doctor,
    isAuthenticated: store.isAuthenticated,
    login: loginFn,
    register: registerFn,
    logout: logoutFn,
  }
}

export function useMe() {
  const store = useAuthStore()

  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const doctor = await getMe()
      store.setDoctor(doctor)
      return doctor
    },
    enabled: store.isAuthenticated,
    staleTime: 60_000,
  })
}

export function useUpdateMe() {
  const qc = useQueryClient()
  const store = useAuthStore()
  return useMutation<Doctor, Error, Partial<Doctor>>({
    mutationFn: updateMe,
    onSuccess: (doctor) => {
      store.setDoctor(doctor)
      qc.setQueryData(["me"], doctor)
    },
    onError: (err) => toast.error(err.message || "Failed to update profile"),
  })
}
