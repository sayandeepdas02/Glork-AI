"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, LogOut, Phone, Settings, Settings2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth-store"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard",  icon: LayoutDashboard, exact: true },
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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-[#111111] text-white scrollbar-sidebar">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 border-b border-white/8 px-6 pb-6 pt-7">
        <Logo className="h-9 w-9 rounded-xl transition-transform hover:scale-105" />
        <span className="text-base font-semibold tracking-tight text-white">Hyperglork</span>
        <span className="ml-auto rounded-full border border-white/10 bg-white/6 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white/62">
          beta
        </span>
      </div>

      {/* ── Doctor card ── */}
      {doctor && (
        <div className="mx-4 mt-5 rounded-[24px] border border-white/10 bg-white/[0.05] px-4 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
              {doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">{doctor.name}</p>
              <p className="truncate text-xs text-white/46">{doctor.clinic_name}</p>
            </div>
            <div className="relative shrink-0">
              <div className={cn(
                "h-2 w-2 rounded-full",
                doctor.is_agent_active ? "bg-emerald-500" : "bg-[var(--edge-strong)]"
              )} />
              {doctor.is_agent_active && (
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping opacity-60" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-white/34">
          Menu
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "sidebar-nav-item group flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-sm font-medium transition-all duration-150",
                active
                  ? "active border-white/10 bg-white text-[#111111] shadow-[0_10px_18px_rgba(17,17,17,0.14)]"
                  : "border-transparent text-white/62 hover:border-white/10 hover:bg-white/6 hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-[#111111]" : "text-white/38 group-hover:text-white/72"
              )} />
              {label}
              {active && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── Bottom ── */}
      <div className="border-t border-white/8 p-4">
        <button
          onClick={() => { onClose?.(); logout() }}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-white/56 transition-all duration-150 hover:bg-white/6 hover:text-white"
        >
          <LogOut className="h-4 w-4 shrink-0 text-white/36" />
          Sign out
        </button>
      </div>
    </div>
  )
}
