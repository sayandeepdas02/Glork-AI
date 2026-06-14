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
  const { data: agentConfig, isError: isConfigError, isLoading: isConfigLoading } = useAgentConfig()
  const { data: calendarStatus, isError: isCalendarError, isLoading: isCalendarLoading } = useCalendarStatus()
  const { mutate: toggle, isPending } = useToggleAgent()

  // Show loading state while queries are in-flight to avoid flicker
  if (isConfigLoading || isCalendarLoading) {
    return (
      <div className="h-[76px] animate-pulse rounded-[24px] border border-[var(--edge)] bg-white/70" />
    )
  }

  // If queries fail we cannot determine real agent state — show degraded banner
  if (isConfigError || isCalendarError) {
    return (
      <div className="panel-surface rounded-[24px] px-5 py-4">
        <p className="text-sm text-[#888]">Agent status unavailable — could not load configuration.</p>
      </div>
    )
  }

  const isActive = doctor?.is_agent_active
  const calendarConnected = calendarStatus?.is_connected

  /* ── Setup needed ── */
  if (!calendarConnected && !isActive) {
    return (
      <div className="relative overflow-hidden rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4">
        <div className="absolute inset-y-0 left-0 w-1 bg-amber-500 rounded-l-[24px]" />
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 border border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">Agent setup incomplete</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Connect Google Calendar to enable appointment booking
            </p>
          </div>
          <Link
            href="/onboarding?step=2"
            className="shrink-0 rounded-full bg-amber-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-amber-400"
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
      <div className="panel-surface relative overflow-hidden rounded-[24px] px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F0F0EC] border border-[#E0E0DB]">
            <PowerOff className="h-5 w-5 text-[#aaa]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111]">Agent is inactive</p>
            <p className="text-xs text-[#888] mt-0.5">
              Calls are not being answered automatically
            </p>
          </div>
          <button
            onClick={() => toggle()}
            disabled={isPending}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#111111] px-4 py-2 text-xs font-semibold text-white transition-all duration-150 hover:bg-[#232323] disabled:opacity-60"
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
    <div className="relative overflow-hidden rounded-[24px] border border-[var(--brand-border)] bg-[var(--brand-dim)] px-5 py-4">
      {/* Left accent stripe */}
      <div className="absolute inset-y-0 left-0 w-1 rounded-l-[24px] bg-[var(--brand)]" />
      {/* Subtle glow */}
      <div className="absolute top-0 right-0 h-full w-48 bg-[var(--brand)]/10 blur-2xl pointer-events-none" />

      <div className="relative flex items-center gap-4">
        {/* Icon with pulse */}
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]">
          <Zap className="h-5 w-5 text-white fill-white" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[var(--brand)]">
            <span className="absolute inset-0 animate-ping rounded-full bg-[var(--brand)] opacity-60" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#111]">
            Agent is live · Answering calls
          </p>
          {agentConfig?.glork_phone_number && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="h-3 w-3 shrink-0 text-[var(--brand-dark)]" />
              <span className="text-xs font-mono font-medium text-[var(--brand-dark)]">
                {agentConfig.glork_phone_number}
              </span>
              <button
                aria-label="Copy agent phone number"
                onClick={async () => {
                  const ok = await copyToClipboard(agentConfig.glork_phone_number!)
                  if (ok) toast.success("Copied to clipboard")
                  else toast.error("Failed to copy — please copy manually")
                }}
                className="transition-colors hover:text-[var(--brand-dark)] text-[var(--brand-dark)]"
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
            "shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-[#D8D8D3]",
            "bg-white px-4 py-2 text-xs font-semibold text-[#666] hover:bg-[#EAEAE5] hover:text-[#111]",
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
