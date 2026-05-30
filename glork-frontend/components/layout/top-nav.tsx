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
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-white/5 bg-[#141210]/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#8A8480] hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm font-semibold text-white leading-none">{title}</h1>
          {sub && <p className="text-[10px] font-mono text-[#736F6B] mt-0.5">{sub}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* New booking shortcut */}
        {pathname === "/bookings" && (
          <Link href="/bookings">
            <button className="btn-shine hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-[#FF5500] hover:bg-[#FF7733] px-3 py-1.5 text-xs font-semibold text-white transition-colors">
              <Plus className="h-3.5 w-3.5" /> New Booking
            </button>
          </Link>
        )}

        {/* Notifications */}
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#736F6B] hover:bg-white/5 hover:text-[#8A8480] transition-colors">
          <Bell className="h-4 w-4" />
        </button>

        {/* Avatar dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7733] to-[#CC3300] text-xs font-bold text-white hover:opacity-90 transition-opacity focus:outline-none shadow-glow-sm">
              {doctor ? getInitials(doctor.name) : "DR"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-[#1C1916] border-white/8 text-white">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-white">{doctor?.name}</p>
                <p className="text-xs text-[#736F6B] font-mono">{doctor?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer text-[#8A8480] hover:text-white focus:text-white focus:bg-white/5">Profile settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/agent" className="cursor-pointer text-[#8A8480] hover:text-white focus:text-white focus:bg-white/5">Agent config</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5" />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-400 focus:text-red-400 focus:bg-red-500/10 cursor-pointer"
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
