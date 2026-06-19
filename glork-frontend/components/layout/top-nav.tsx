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
  "/dashboard": { title: "Command Center", sub: "Calls, bookings, and clinic coverage at a glance" },
  "/bookings": { title: "Bookings", sub: "Appointments flowing through the reception pipeline" },
  "/calls": { title: "Calls", sub: "Audit what the AI handled and what still needs attention" },
  "/agent": { title: "Agent", sub: "Tune behavior, schedules, and calendar connection" },
  "/settings": { title: "Settings", sub: "Clinic profile and account controls" },
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
    <header className="sticky top-0 z-20 border-b border-white/70 bg-[#f6f8fc]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d8e2ef] bg-white text-ink-4 transition-colors hover:text-brand lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-ink">{title}</h1>
            {sub && <p className="truncate text-sm text-ink-4">{sub}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {pathname === "/bookings" && (
            <Link
              href="/bookings"
              className="hidden items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(28,128,242,0.22)] transition-transform hover:-translate-y-0.5 sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" />
              New booking
            </Link>
          )}

          <button
            aria-label="View notifications"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#d8e2ef] bg-white text-ink-4 transition-colors hover:text-brand"
          >
            <Bell className="h-4 w-4" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={`Account menu for ${doctor?.name ?? "account"}`}
                aria-haspopup="menu"
                className="flex h-10 min-w-[40px] items-center justify-center rounded-2xl bg-brand px-3 text-sm font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
              >
                {doctor ? getInitials(doctor.name) : "DR"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl border-[#e4ecf6] bg-white p-2 shadow-card">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-0.5 px-1 py-1">
                  <p className="text-sm font-semibold text-ink">{doctor?.name}</p>
                  <p className="text-xs text-ink-4">{doctor?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#edf2f8]" />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer rounded-xl text-ink-3 focus:bg-[#eff4fb] focus:text-ink">
                  Profile settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/agent" className="cursor-pointer rounded-xl text-ink-3 focus:bg-[#eff4fb] focus:text-ink">
                  Agent configuration
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#edf2f8]" />
              <DropdownMenuItem
                onClick={logout}
                className="rounded-xl text-red-600 focus:bg-red-50 focus:text-red-600"
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
