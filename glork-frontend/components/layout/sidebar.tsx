"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  LayoutDashboard,
  LogOut,
  Phone,
  Settings,
  Settings2,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth-store"

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  exact?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard",    icon: LayoutDashboard, exact: true },
  { href: "/bookings",  label: "Bookings",     icon: Calendar },
  { href: "/calls",     label: "Calls",        icon: Phone },
  { href: "/agent",     label: "Agent config", icon: Settings2 },
  { href: "/settings",  label: "Settings",     icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname  = usePathname()
  const { logout } = useAuth()
  const doctor    = useAuthStore((s) => s.doctor)

  const isActive = ({ href, exact }: NavItem) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="flex h-full w-full flex-col bg-[#FAFAFA] border-r border-[#EEEEEE]">

      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-[#EEEEEE] px-5 shrink-0">
        <Logo className="h-6 w-6 rounded-md shrink-0" />
        <span className="text-[15px] font-medium tracking-tight text-[#111111]">
          Hyperglork
        </span>
      </div>

      {/* Doctor profile */}
      {doctor && (
        <div className="border-b border-[#EEEEEE] px-4 py-3 shrink-0">
          <div className="flex items-center gap-2.5 rounded-lg bg-white border border-[#EEEEEE] px-3 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#111111] text-[12px] font-medium text-white">
              {getInitials(doctor.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-[#111111] leading-tight">{doctor.name}</p>
              <p className="truncate text-[11px] text-[#9CA3AF] mt-0.5">{doctor.clinic_name}</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-wider shrink-0",
                doctor.is_agent_active
                  ? "bg-[#F0FDF4] text-[#166534]"
                  : "bg-[#F3F4F6] text-[#6B7280]"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  doctor.is_agent_active ? "bg-[#22C55E] animate-pulse-dot" : "bg-[#D1D5DB]"
                )}
              />
              {doctor.is_agent_active ? "Live" : "Off"}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5 scrollbar-sidebar">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          const Icon   = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-normal transition-colors duration-100",
                active
                  ? "bg-white border border-[#EEEEEE] text-[#111111] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                  : "text-[#6B7280] hover:bg-white hover:text-[#111111] hover:border hover:border-[#EEEEEE]"
              )}
            >
              <Icon
                className={cn(
                  "h-[15px] w-[15px] shrink-0",
                  active ? "text-[#111111]" : "text-[#9CA3AF]"
                )}
                strokeWidth={active ? 2 : 1.5}
              />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="shrink-0 border-t border-[#EEEEEE] p-3">
        <button
          onClick={() => { onClose?.(); logout() }}
          aria-label="Sign out"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-normal text-[#9CA3AF] transition-colors hover:bg-white hover:text-[#EF4444] hover:border hover:border-[#EEEEEE]"
        >
          <LogOut className="h-[15px] w-[15px] shrink-0" strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </div>
  )
}
