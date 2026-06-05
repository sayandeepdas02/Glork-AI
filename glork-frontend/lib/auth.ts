import { getAuthStore } from "@/store/auth-store"

// Tokens live in Zustand memory only — no localStorage, no client-set cookies.
// httpOnly cookies are managed exclusively by the backend.

export function getAccessToken(): string | null {
  return getAuthStore().accessToken
}

export function getRefreshToken(): string | null {
  return getAuthStore().refreshToken
}

export function clearTokens(): void {
  getAuthStore().clearAuth()
}
