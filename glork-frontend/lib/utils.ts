import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  format,
  formatDistanceToNow,
  isToday as dfnsIsToday,
  isFuture as dfnsIsFuture,
  parseISO,
} from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatAppointmentDate(isoString: string): string {
  try {
    return format(parseISO(isoString), "EEEE, MMMM d, yyyy")
  } catch {
    return isoString
  }
}

export function formatAppointmentTime(isoString: string): string {
  try {
    return format(parseISO(isoString), "h:mm a")
  } catch {
    return isoString
  }
}

export function formatAppointmentDateTime(isoString: string): string {
  try {
    return format(parseISO(isoString), "EEE MMM d · h:mm a")
  } catch {
    return isoString
  }
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || seconds === 0) return "—"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s > 0 ? `${s}s` : ""}`.trim()
}

export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "—"
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true })
  } catch {
    return isoString
  }
}

export function formatPhone(phone: string | null | undefined, masked = false): string {
  if (!phone) return "—"
  if (!masked) return phone
  if (phone.length < 4) return phone
  return phone.slice(0, -4).replace(/\d/g, "*") + phone.slice(-4)
}

export function isToday(isoString: string): boolean {
  try {
    return dfnsIsToday(parseISO(isoString))
  } catch {
    return false
  }
}

export function isFuture(isoString: string): boolean {
  try {
    return dfnsIsFuture(parseISO(isoString))
  } catch {
    return false
  }
}

export function getDayName(date: Date | string): string {
  try {
    const d = typeof date === "string" ? parseISO(date) : date
    return format(d, "EEEE")
  } catch {
    return ""
  }
}

export function formatDateShort(isoString: string): string {
  try {
    return format(parseISO(isoString), "MMM d, yyyy")
  } catch {
    return isoString
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for environments where clipboard API is unavailable or denied
    try {
      const el = document.createElement("textarea")
      el.value = text
      el.style.position = "fixed"
      el.style.opacity = "0"
      document.body.appendChild(el)
      el.focus()
      el.select()
      const ok = document.execCommand("copy")
      document.body.removeChild(el)
      return ok
    } catch {
      return false
    }
  }
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
