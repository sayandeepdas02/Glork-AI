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
        // Tokens are NOT written to localStorage — they live in memory only.
        // The backend sets httpOnly cookies for session continuity across reloads.
        set({ doctor, accessToken, refreshToken, isAuthenticated: true })
      },
      setDoctor: (doctor) => set({ doctor }),
      clearAuth: () => {
        // Backend logout endpoint clears httpOnly cookies via Set-Cookie header.
        set({ doctor: null, accessToken: null, refreshToken: null, isAuthenticated: false })
      },
    }),
    {
      name: "glork-auth",
      // Only persist non-sensitive session indicators — never persist tokens
      partialize: (state) => ({
        doctor: state.doctor,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export const getAuthStore = () => useAuthStore.getState()
