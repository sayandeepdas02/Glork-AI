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
  return { title: "Glork", sub: "" }
}

export function TopNav() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const doctor = useAuthStore((s) => s.doctor)
  const { logout } = useAuth()
  const pathname = usePathname()
  const { title, sub } = getPageMeta(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#EAEAE5] bg-white/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          aria-label="Open navigation menu"
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#F5F5F2] hover:text-[#111] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-[#111] leading-none">{title}</h1>
          {sub && <p className="text-[11px] font-mono text-[#aaa] mt-0.5">{sub}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New booking shortcut */}
        {pathname === "/bookings" && (
          <Link href="/bookings">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-brand hover:bg-brand-light px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Booking
            </button>
          </Link>
        )}

        {/* Notifications */}
        <button
          aria-label="View notifications"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#999] hover:bg-[#F5F5F2] hover:text-[#555] transition-colors"
        >
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Account menu for ${doctor?.name ?? "account"}`}
              aria-haspopup="menu"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7733] to-[#CC3300] text-xs font-bold text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              {doctor ? getInitials(doctor.name) : "DR"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-white border-[#E8E8E3]">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-[#111]">{doctor?.name}</p>
                <p className="text-xs text-[#888] font-mono">{doctor?.email}</p>
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
