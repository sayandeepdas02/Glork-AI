export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("glork-auth")
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("glork-auth")
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.state?.refreshToken ?? null
  } catch {
    return null
  }
}

export function clearTokens(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("glork-auth")
  document.cookie = "glork-token=; path=/; max-age=0"
}
