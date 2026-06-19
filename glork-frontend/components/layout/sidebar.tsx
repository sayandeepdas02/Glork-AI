"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Calendar, LayoutDashboard, LogOut, Phone, Settings, Settings2, Sparkles } from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import { useAuthStore } from "@/store/auth-store"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Command Center", icon: LayoutDashboard, exact: true },
  { href: "/bookings", label: "Bookings", icon: Calendar },
  { href: "/calls", label: "Calls", icon: Phone },
  { href: "/agent", label: "Agent", icon: Settings2 },
  { href: "/settings", label: "Settings", icon: Settings },
]

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const doctor = useAuthStore((s) => s.doctor)

  return (
    <div className="flex h-full w-full flex-col bg-white/90 backdrop-blur-xl">
      <div className="border-b border-[#e4ecf6] px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <Logo className="h-9 w-9 rounded-2xl" />
          <div>
            <p className="font-serif text-[22px] tracking-tight text-ink">Hyperglork</p>
            <p className="text-[11px] uppercase tracking-[0.16em] text-ink-5">Clinic OS</p>
          </div>
        </div>

        {doctor && (
          <div className="mt-5 rounded-[24px] border border-[#e4ecf6] bg-[linear-gradient(135deg,#ffffff_0%,#f4f8fe_100%)] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-sm font-semibold text-white">
                {getInitials(doctor.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{doctor.name}</p>
                <p className="truncate text-xs text-ink-4">{doctor.clinic_name}</p>
              </div>
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                <span className={cn("h-2 w-2 rounded-full", doctor.is_agent_active ? "bg-emerald-500" : "bg-slate-300")} />
                {doctor.is_agent_active ? "Live" : "Idle"}
              </div>
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5 scrollbar-sidebar">
        <div>
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">
            Workspace
          </p>
          <div className="mt-3 space-y-1.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
              const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-[20px] px-3.5 py-3 text-[13px] font-medium transition-all duration-200",
                    active
                      ? "bg-brand text-white shadow-[0_18px_34px_rgba(28,128,242,0.22)]"
                      : "text-ink-4 hover:bg-[#eff4fb] hover:text-ink-2"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-white" : "text-ink-5 group-hover:text-brand")} />
                  <span>{label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e4ecf6] bg-[#f7faff] p-4">
          <div className="flex items-center gap-2 text-brand">
            <Sparkles className="h-4 w-4" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em]">Operator focus</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-ink-4">
            Watch missed intent, reschedules, and urgent transfer requests before they become admin debt.
          </p>
        </div>
      </nav>

      <div className="border-t border-[#e4ecf6] p-3">
        <button
          onClick={() => {
            onClose?.()
            logout()
          }}
          aria-label="Sign out"
          className="flex w-full items-center gap-3 rounded-[18px] px-3.5 py-3 text-sm font-medium text-ink-4 transition-colors hover:bg-[#eff4fb] hover:text-ink-2"
        >
          <LogOut className="h-4 w-4 shrink-0 text-ink-5" />
          Sign out
        </button>
      </div>
    </div>
  )
}
