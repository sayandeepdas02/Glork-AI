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
    <div className="flex h-full w-full flex-col overflow-y-auto bg-transparent scrollbar-sidebar">

      {/* ── Logo ── */}
      <div className="flex items-center gap-3 border-b border-[var(--edge)] px-6 pb-5 pt-6">
        <Logo className="h-9 w-9 rounded-xl transition-transform hover:scale-105" />
        <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">Hyperglork</span>
        <span className="ml-auto rounded-full border border-[var(--brand-border)] bg-[var(--brand-dim)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[var(--brand-dark)]">
          beta
        </span>
      </div>

      {/* ── Doctor card ── */}
      {doctor && (
        <div className="mx-4 mt-5 rounded-[22px] border border-[var(--edge)] bg-white/80 px-4 py-4 shadow-[0_14px_28px_rgba(17,17,17,0.05)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-[#111111]">
              {doctor.name?.slice(0, 2).toUpperCase() ?? "DR"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{doctor.name}</p>
              <p className="truncate text-xs text-[var(--text-faint)]">{doctor.clinic_name}</p>
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
        <p className="mb-3 px-3 text-[10px] font-mono font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">
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
                  ? "active border-[var(--brand-border)] bg-[var(--brand-dim)] text-[var(--text-primary)] shadow-[0_10px_18px_rgba(17,17,17,0.04)]"
                  : "border-transparent text-[var(--text-muted)] hover:border-[var(--edge)] hover:bg-white/72 hover:text-[var(--text-primary)]"
              )}
            >
              <Icon className={cn(
                "h-4 w-4 shrink-0 transition-colors",
                active ? "text-[var(--text-primary)]" : "text-[var(--text-faint)] group-hover:text-[var(--text-muted)]"
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
      <div className="border-t border-[var(--edge)] p-4">
        <button
          onClick={() => { onClose?.(); logout() }}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-[var(--text-muted)] transition-all duration-150 hover:bg-white/72 hover:text-[var(--text-primary)]"
        >
          <LogOut className="h-4 w-4 shrink-0 text-[var(--text-faint)]" />
          Sign out
        </button>
      </div>
    </div>
  )
}
