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
  const pathname = usePathname()
  const { logout } = useAuth()
  const doctor = useAuthStore((s) => s.doctor)

  const isActive = ({ href, exact }: NavItem) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Logo strip */}
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-100 px-5 shrink-0">
        <Logo className="h-7 w-7 rounded-lg shrink-0" />
        <div>
          <p className="text-[16px] font-semibold tracking-tight text-ink leading-tight">
            Hyperglork
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-5 leading-none">
            Clinic OS
          </p>
        </div>
      </div>

      {/* Doctor profile card */}
      {doctor && (
        <div className="border-b border-gray-100 px-4 py-3 shrink-0">
          <div className="flex items-center gap-3 rounded-xl bg-off-white px-3 py-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-[13px] font-bold text-white">
              {getInitials(doctor.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-ink leading-tight">{doctor.name}</p>
              <p className="truncate text-[11px] text-ink-5 mt-0.5">{doctor.clinic_name}</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] shrink-0",
                doctor.is_agent_active
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-gray-100 text-ink-5"
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  doctor.is_agent_active ? "bg-emerald-500 animate-pulse-ring" : "bg-ink-6"
                )}
              />
              {doctor.is_agent_active ? "Live" : "Off"}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 scrollbar-sidebar">
        <p className="section-label mb-2 px-3">Workspace</p>
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg py-2 text-[13px] font-medium transition-colors duration-150",
                  active
                    ? "bg-brand-light text-brand border-l-2 border-brand pl-[10px] pr-3"
                    : "px-3 text-ink-4 hover:bg-off-white hover:text-ink-2"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-brand" : "text-ink-5"
                  )}
                />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sign out */}
      <div className="shrink-0 border-t border-gray-100 p-3">
        <button
          onClick={() => {
            onClose?.()
            logout()
          }}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-ink-4 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}
