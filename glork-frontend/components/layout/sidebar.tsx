"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar, LayoutDashboard, LogOut, Phone, Settings, Settings2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth-store"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/agent", label: "AI Agent", icon: Settings2 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const doctor = useAuthStore((s) => s.doctor)

  return (
    <div className="flex h-full flex-col bg-[#0d1117] scrollbar-sidebar overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5 border-b border-white/5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d6b4a] shadow-glow">
          <Phone className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-bold text-white tracking-tight">Glork</span>
        <span className="ml-auto rounded-full border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-widest">
          beta
        </span>
      </div>

      {/* Doctor card */}
      {doctor && (
        <div className="mx-3 mt-4 rounded-xl bg-white/4 border border-white/6 px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            {/* Avatar */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#1d6b4a] text-xs font-bold text-white">
              {doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{doctor.name}</p>
              <p className="text-xs text-gray-500 truncate">{doctor.clinic_name}</p>
            </div>
            {/* Agent status dot */}
            <div className="relative shrink-0">
              <div className={cn(
                "h-2 w-2 rounded-full",
                doctor.is_agent_active ? "bg-emerald-400" : "bg-gray-600"
              )} />
              {doctor.is_agent_active && (
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p className="px-3 mb-2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest">
          Menu
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`))
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "sidebar-nav-item group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                active
                  ? "active bg-white/8 text-white"
                  : "text-gray-500 hover:bg-white/5 hover:text-gray-300"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-emerald-400" : "text-gray-600 group-hover:text-gray-400"
              )} />
              {label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-white/5">
        <button
          onClick={() => { onClose?.(); logout() }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
      </div>
    </div>
  )
}
