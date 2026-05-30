"use client"

import Link from "next/link"
import { AlertTriangle, Copy, Phone, Power, PowerOff, Zap } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { copyToClipboard } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useAgentConfig, useToggleAgent } from "@/hooks/use-agent-config"
import { useCalendarStatus } from "@/hooks/use-calendar"

export function AgentStatusBanner() {
  const doctor = useAuthStore((s) => s.doctor)
  const { data: agentConfig } = useAgentConfig()
  const { data: calendarStatus } = useCalendarStatus()
  const { mutate: toggle, isPending } = useToggleAgent()

  const isActive = doctor?.is_agent_active
  const calendarConnected = calendarStatus?.is_connected

  /* ── Setup needed ── */
  if (!calendarConnected && !isActive) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-[#1C1612] px-5 py-4">
        <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 rounded-l-2xl" />
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Agent setup incomplete</p>
            <p className="text-xs text-[#8A8480] mt-0.5">
              Connect Google Calendar to enable appointment booking
            </p>
          </div>
          <Link
            href="/onboarding?step=2"
            className="btn-shine shrink-0 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-semibold text-white transition-colors"
          >
            Complete setup
          </Link>
        </div>
      </div>
    )
  }

  /* ── Inactive ── */
  if (!isActive) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/6 bg-[#141210] px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/8">
            <PowerOff className="h-5 w-5 text-[#4A4540]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white">Agent is inactive</p>
            <p className="text-xs text-[#8A8480] mt-0.5">
              Calls are not being answered automatically
            </p>
          </div>
          <button
            onClick={() => toggle()}
            disabled={isPending}
            className="btn-shine shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#FF5500] hover:bg-[#FF7733] px-4 py-2 text-xs font-semibold text-white transition-all duration-150 disabled:opacity-60 shadow-glow-sm"
          >
            <Power className="h-3.5 w-3.5" />
            {isPending ? "Activating…" : "Activate"}
          </button>
        </div>
      </div>
    )
  }

  /* ── Active ── */
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#FF5500]/20 bg-[#1A0E08] px-5 py-4">
      {/* Left accent stripe */}
      <div className="absolute inset-y-0 left-0 w-1 bg-[#FF5500] rounded-l-2xl" />
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 w-48 h-full bg-[#FF5500]/5 blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-4">
        {/* Icon with pulse */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5500] shadow-glow-sm">
          <Zap className="h-5 w-5 text-white fill-white" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#FF5500] border-2 border-[#1A0E08]">
            <span className="absolute inset-0 animate-ping rounded-full bg-[#FF5500] opacity-60" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">
            Agent is live · Answering calls
          </p>
          {agentConfig?.glork_phone_number && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="h-3 w-3 text-[#FF7733] shrink-0" />
              <span className="text-xs text-[#FF7733] font-mono font-medium">
                {agentConfig.glork_phone_number}
              </span>
              <button
                onClick={() => {
                  copyToClipboard(agentConfig.glork_phone_number!)
                  toast.success("Copied to clipboard")
                }}
                className="text-[#FF7733] hover:text-[#FF5500] transition-colors"
              >
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => toggle()}
          disabled={isPending}
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-white/10",
            "bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-[#8A8480] hover:text-white",
            "transition-all duration-150 disabled:opacity-60"
          )}
        >
          <PowerOff className="h-3.5 w-3.5" />
          {isPending ? "…" : "Deactivate"}
        </button>
      </div>
    </div>
  )
}
