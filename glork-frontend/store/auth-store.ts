import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Doctor } from "@/types"

interface AuthStore {
  doctor: Doctor | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (doctor: Doctor, accessToken: string, refreshToken: string) => void
  setDoctor: (doctor: Doctor) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      doctor: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (doctor, accessToken, refreshToken) => {
        if (typeof document !== "undefined") {
          document.cookie = `glork-token=${accessToken}; path=/; max-age=3600; SameSite=Lax`
        }
        set({ doctor, accessToken, refreshToken, isAuthenticated: true })
      },
      setDoctor: (doctor) => set({ doctor }),
      clearAuth: () => {
        if (typeof document !== "undefined") {
          document.cookie = "glork-token=; path=/; max-age=0"
        }
        set({ doctor: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: "glork-auth",
      partialize: (state) => ({
        doctor: state.doctor,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const getAuthStore = () => useAuthStore.getState()
