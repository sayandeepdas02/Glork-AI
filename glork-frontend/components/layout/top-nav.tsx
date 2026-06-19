"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Plus } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { useAuthStore } from "@/store/auth-store"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard",      sub: "Your clinic's command center" },
  "/bookings":  { title: "Bookings",       sub: "Patient appointments and scheduling" },
  "/calls":     { title: "Call logs",      sub: "Every conversation handled by the AI" },
  "/agent":     { title: "Agent config",   sub: "Tune behavior, hours, and calendar" },
  "/settings":  { title: "Settings",       sub: "Clinic profile and account" },
}

function getPageMeta(pathname: string) {
  for (const [prefix, meta] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return meta
  }
  return { title: "Hyperglork", sub: "" }
}

export function TopNav() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const doctor = useAuthStore((s) => s.doctor)
  const { logout } = useAuth()
  const pathname = usePathname()
  const { title, sub } = getPageMeta(pathname)

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-gray-100 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        {/* Left: mobile menu + page title */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Open navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-5 transition-colors hover:bg-gray-100 hover:text-ink-3 lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold text-ink leading-tight">{title}</h1>
            {sub && (
              <p className="hidden truncate text-[12px] text-ink-5 sm:block">{sub}</p>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* New booking CTA (bookings page only) */}
          {pathname === "/bookings" && (
            <Link
              href="/bookings"
              className="hidden items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition-all hover:bg-brand-dark sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              New booking
            </Link>
          )}

          {/* Notifications */}
          <button
            aria-label="View notifications"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-5 transition-colors hover:bg-gray-100 hover:text-ink-3"
          >
            <Bell className="h-4 w-4" />
          </button>

          {/* Account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={`Account menu for ${doctor?.name ?? "account"}`}
                aria-haspopup="menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-[12px] font-bold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {doctor ? getInitials(doctor.name) : "DR"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl border border-gray-100 bg-white p-1.5 shadow-card-md"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="px-1 py-1">
                  <p className="text-[13px] font-semibold text-ink">{doctor?.name}</p>
                  <p className="text-[11px] text-ink-5 mt-0.5">{doctor?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="cursor-pointer rounded-lg text-[13px] text-ink-3 focus:bg-off-white focus:text-ink"
                >
                  Profile settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/agent"
                  className="cursor-pointer rounded-lg text-[13px] text-ink-3 focus:bg-off-white focus:text-ink"
                >
                  Agent configuration
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-100" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer rounded-lg text-[13px] text-red-600 focus:bg-red-50 focus:text-red-600"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
