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

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/bookings": "Bookings",
  "/calls": "Call History",
  "/agent": "AI Agent",
  "/settings": "Settings",
}

function getTitleFromPath(pathname: string) {
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title
  }
  return "Glork"
}

export function TopNav() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const doctor = useAuthStore((s) => s.doctor)
  const { logout } = useAuth()
  const pathname = usePathname()
  const title = getTitleFromPath(pathname)

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New booking shortcut on bookings page */}
        {pathname === "/bookings" && (
          <Link href="/bookings">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#1d6b4a] hover:bg-[#155638] px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Booking
            </button>
          </Link>
        )}

        {/* Notifications */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors relative">
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#1d6b4a] text-xs font-bold text-white hover:opacity-90 transition-opacity focus:outline-none">
              {doctor ? getInitials(doctor.name) : "DR"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-gray-900">{doctor?.name}</p>
                <p className="text-xs text-gray-500">{doctor?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent" className="cursor-pointer">Agent config</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
