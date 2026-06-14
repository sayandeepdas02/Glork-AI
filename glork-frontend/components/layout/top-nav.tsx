"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, Plus } from "lucide-react"
import { useUIStore } from "@/store/ui-store"
import { useAuthStore } from "@/store/auth-store"
import { useAuth } from "@/hooks/use-auth"
import { getInitials } from "@/lib/utils"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  "/dashboard": { title: "Dashboard",    sub: "Overview & analytics" },
  "/bookings":  { title: "Bookings",     sub: "Manage appointments" },
  "/calls":     { title: "Call History", sub: "All recorded calls" },
  "/agent":     { title: "AI Agent",     sub: "Configure your agent" },
  "/settings":  { title: "Settings",     sub: "Account & preferences" },
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
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-black/6 bg-white/82 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/6 text-[var(--text-faint)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Workspace</p>
          <h1 className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-[var(--text-primary)]">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New booking shortcut */}
        {pathname === "/bookings" && (
          <Link href="/bookings">
            <button className="hidden items-center gap-1.5 rounded-full bg-[#111111] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#232323] sm:inline-flex">
              <Plus className="h-3.5 w-3.5" /> New Booking
            </button>
          </Link>
        )}

        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-black/6 text-[var(--text-faint)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Account menu for ${doctor?.name ?? "account"}`}
              aria-haspopup="menu"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#111111] text-xs font-bold text-white transition-colors hover:bg-[#232323] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
            >
              {doctor ? getInitials(doctor.name) : "DR"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#E8E8E3]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{doctor?.name}</p>
                <p className="text-xs font-mono text-[var(--text-faint)]">{doctor?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-[#EAEAE5]" />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer text-[#555] hover:text-[#111] focus:text-[#111] focus:bg-[#F5F5F2]">Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent" className="cursor-pointer text-[#555] hover:text-[#111] focus:text-[#111] focus:bg-[#F5F5F2]">Agent config</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#EAEAE5]" />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
