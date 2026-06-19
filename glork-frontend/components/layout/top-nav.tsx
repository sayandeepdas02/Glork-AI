"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Plus } from "lucide-react"
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

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/bookings":  "Bookings",
  "/calls":     "Calls",
  "/agent":     "Agent config",
  "/settings":  "Settings",
}

function getTitle(pathname: string) {
  for (const [prefix, title] of Object.entries(PAGE_TITLES)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return title
  }
  return "Hyperglork"
}

export function TopNav() {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const doctor        = useAuthStore((s) => s.doctor)
  const { logout }    = useAuth()
  const pathname      = usePathname()
  const title         = getTitle(pathname)

  return (
    <header className="sticky top-0 z-20 h-14 border-b border-[#EEEEEE] bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">

        {/* Left */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Open navigation"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111111] lg:hidden"
          >
            <Menu className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <h1 className="text-[14px] font-medium text-[#111111] tracking-tight">
            {title}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">

          {/* New booking CTA */}
          {pathname === "/bookings" && (
            <Link
              href="/bookings"
              className="hidden items-center gap-1.5 rounded-lg bg-[#111111] px-3.5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#333333] sm:inline-flex"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} />
              New booking
            </Link>
          )}

          {/* Account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={`Account menu for ${doctor?.name ?? "account"}`}
                aria-haspopup="menu"
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111] text-[11px] font-semibold text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2"
              >
                {doctor ? getInitials(doctor.name) : "DR"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-52 rounded-xl border border-[#EEEEEE] bg-white p-1.5 shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="px-1 py-1">
                  <p className="text-[13px] font-medium text-[#111111]">{doctor?.name}</p>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{doctor?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#EEEEEE]" />
              <DropdownMenuItem asChild>
                <Link href="/settings"
                  className="cursor-pointer rounded-lg text-[13px] font-normal text-[#333333] focus:bg-[#F3F4F6] focus:text-[#111111]"
                >
                  Profile settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/agent"
                  className="cursor-pointer rounded-lg text-[13px] font-normal text-[#333333] focus:bg-[#F3F4F6] focus:text-[#111111]"
                >
                  Agent configuration
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#EEEEEE]" />
              <DropdownMenuItem
                onClick={logout}
                className="cursor-pointer rounded-lg text-[13px] font-normal text-[#EF4444] focus:bg-[#FEF2F2] focus:text-[#EF4444]"
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
