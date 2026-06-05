"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, LogOut, Phone, Settings, Settings2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth-store"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard },
  { href: "/bookings",  label: "Bookings",   icon: Calendar },
  { href: "/calls",     label: "Calls",      icon: Phone },
  { href: "/agent",     label: "AI Agent",   icon: Settings2 },
  { href: "/settings",  label: "Settings",   icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const doctor = useAuthStore((s) => s.doctor)

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-y-auto scrollbar-sidebar">

      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5 border-b border-[#EAEAE5]">
        <Logo className="w-8 h-8 rounded-lg transition-transform hover:scale-105" />
        <span className="text-base font-semibold text-[#111] tracking-tight">Glork</span>
        <span className="ml-auto rounded-full border border-brand/20 bg-brand/5 px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase tracking-widest">
          beta
        </span>
      </div>

      {/* ── Doctor card ── */}
      {doctor && (
        <div className="mx-3 mt-4 rounded-xl bg-[#FAFAF8] border border-[#EAEAE5] px-3.5 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#FF7733] to-[#CC3300] text-xs font-bold text-white">
              {doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111] truncate">{doctor.name}</p>
              <p className="text-xs text-[#888] truncate">{doctor.clinic_name}</p>
            </div>
            <div className="relative shrink-0">
              <div className={cn(
                "h-2 w-2 rounded-full",
                doctor.is_agent_active ? "bg-brand" : "bg-[#ccc]"
              )} />
              {doctor.is_agent_active && (
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-brand animate-ping opacity-60" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        <p className="px-3 mb-3 text-[10px] font-mono font-semibold text-[#bbb] uppercase tracking-[0.2em]">
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
                  ? "active bg-brand/8 text-[#111] border border-brand/20"
                  : "text-[#666] hover:bg-[#F5F5F2] hover:text-[#111] border border-transparent"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-brand" : "text-[#aaa] group-hover:text-[#555]"
              )} />
              {label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="p-3 border-t border-[#EAEAE5]">
        <button
          onClick={() => { onClose?.(); logout() }}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[#777] hover:text-[#111] hover:bg-[#F5F5F2] transition-all duration-150"
        >
          <LogOut className="h-4 w-4 shrink-0 text-[#aaa]" />
          Sign out
        </button>
      </div>
    </div>
  )
}
