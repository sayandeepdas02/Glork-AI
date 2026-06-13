import axios, { type AxiosRequestConfig } from "axios"
import { getAuthStore } from "@/store/auth-store"
import { getAccessToken, getRefreshToken, clearTokens } from "@/lib/auth"
import type {
  AgentConfig,
  Booking,
  BookingFilters,
  CallFilters,
  CallLog,
  CallStats,
  CalendarStatus,
  CreateBookingData,
  DashboardStats,
  Doctor,
  PaginatedResponse,
  RegisterData,
  TokenResponse,
  UpdateBookingData,
} from "@/types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"
export const API_BASE_URL = `${BASE_URL}/api/v1`

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
  withCredentials: true, // Send httpOnly cookies (access + refresh) with every request
})

api.interceptors.request.use((config) => {
  // Prefer in-memory token for Authorization header (backward compat with Bearer scheme).
  // httpOnly cookie is also sent automatically via withCredentials.
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error)
    } else if (token) {
      p.resolve(token)
    } else {
      p.reject(new Error("Token refresh produced no token"))
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`
              }
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Send refresh request — httpOnly refresh cookie is included automatically via withCredentials.
        // Also include body token for backward compat with non-cookie clients.
        const refreshToken = getRefreshToken()
        const resp = await axios.post<TokenResponse>(
          `${API_BASE_URL}/auth/refresh`,
          refreshToken ? { refresh_token: refreshToken } : {},
          { withCredentials: true }
        )
        const { access_token, refresh_token } = resp.data
        const { doctor } = getAuthStore()
        if (doctor) {
          getAuthStore().setAuth(doctor, access_token, refresh_token ?? "")
        }
        processQueue(null, access_token)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`
        }
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        clearTokens()
        getAuthStore().clearAuth()
        if (typeof window !== "undefined") {
          const reason =
            axios.isAxiosError(err) && err.response?.status
              ? "session_expired"
              : "network_error"
          // Use query param instead of sessionStorage to avoid XSS-readable state
          window.location.href = `/login?reason=${reason}`
        }
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

/**
 * Map HTTP errors to safe, user-friendly messages.
 * Never expose raw backend details (stack traces, column names, internal paths).
 */
export function extractError(error: unknown): string {
  if (!axios.isAxiosError(error)) return "An unexpected error occurred"
  const status = error.response?.status
  // 400 / 422: pass through explicit validation messages (designed to be user-safe)
  if (status === 400 || status === 422) {
    const msg = error.response?.data?.error || error.response?.data?.detail
    if (typeof msg === "string" && msg.length < 200) return msg
    return "Invalid request. Please check your input."
  }
  if (status === 401) return "Session expired. Please sign in again."
  if (status === 403) return "You don't have permission to perform this action."
  if (status === 404) return "The requested resource was not found."
  if (status === 409) return "This action conflicts with another change. Please refresh and try again."
  if (status === 429) return "Too many requests. Please wait a moment and try again."
  if (status && status >= 500) return "Server error. Please try again later."
  return "Request failed. Please try again."
}

// Auth
export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", { email, password })
  return data
}

export async function register(payload: RegisterData): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/register", payload)
  return data
}

export async function refreshTokens(refresh_token?: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>(
    "/auth/refresh",
    refresh_token ? { refresh_token } : {},
  )
  return data
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout")
}

export async function getGoogleAuthUrl(): Promise<{ auth_url: string }> {
  const { data } = await api.get<{ auth_url: string }>("/auth/google")
  return data
}

export async function exchangeGoogleCode(exchangeCode: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/google/exchange", {
    exchange_code: exchangeCode,
  })
  return data
}

// Doctor
export async function getMe(): Promise<Doctor> {
  const { data } = await api.get<Doctor>("/doctors/me")
  return data
}

export async function updateMe(payload: Partial<Doctor>): Promise<Doctor> {
  const { data } = await api.patch<Doctor>("/doctors/me", payload)
  return data
}

export async function getAgentConfig(): Promise<AgentConfig> {
  const { data } = await api.get<AgentConfig>("/doctors/me/agent-config")
  return data
}

export async function updateAgentConfig(
  payload: Partial<AgentConfig>
): Promise<AgentConfig> {
  const { data } = await api.put<AgentConfig>("/doctors/me/agent-config", payload)
  return data
}

export async function toggleAgent(): Promise<{ is_agent_active: boolean; message: string }> {
  const { data } = await api.post("/doctors/me/agent/toggle")
  return data
}

// Bookings
export async function getBookings(
  params: BookingFilters
): Promise<PaginatedResponse<Booking>> {
  const { data } = await api.get<PaginatedResponse<Booking>>("/bookings", { params })
  return data
}

export async function getBooking(id: string): Promise<Booking> {
  const { data } = await api.get<Booking>(`/bookings/${id}`)
  return data
}

export async function createBooking(payload: CreateBookingData): Promise<Booking> {
  const { data } = await api.post<Booking>("/bookings", payload)
  return data
}

export async function updateBooking(
  id: string,
  payload: UpdateBookingData
): Promise<Booking> {
  const { data } = await api.patch<Booking>(`/bookings/${id}`, payload)
  return data
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`/bookings/${id}`)
}

export async function getBookingStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>("/bookings/stats")
  return data
}

// Calls
export async function getCalls(
  params: CallFilters
): Promise<PaginatedResponse<CallLog>> {
  const { data } = await api.get<PaginatedResponse<CallLog>>("/calls", { params })
  return data
}

export async function getCall(id: string): Promise<CallLog> {
  const { data } = await api.get<CallLog>(`/calls/${id}`)
  return data
}

export async function getCallStats(): Promise<CallStats> {
  const { data } = await api.get<CallStats>("/calls/stats")
  return data
}

// Calendar
export async function getCalendarAuthUrl(returnTo = "/onboarding"): Promise<{ auth_url: string }> {
  const { data } = await api.get<{ auth_url: string }>("/calendar/auth-url", {
    params: { return_to: returnTo },
  })
  return data
}

export async function getCalendarStatus(): Promise<CalendarStatus> {
  const { data } = await api.get<CalendarStatus>("/calendar/status")
  return data
}

export async function disconnectCalendar(): Promise<void> {
  await api.delete("/calendar")
}
