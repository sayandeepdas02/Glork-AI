"use client"

import Link from "next/link"
import { AlertTriangle, Copy, Phone, Power, PowerOff, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { cn, copyToClipboard } from "@/lib/utils"
import { useAuthStore } from "@/store/auth-store"
import { useAgentConfig, useToggleAgent } from "@/hooks/use-agent-config"
import { useCalendarStatus } from "@/hooks/use-calendar"

export function AgentStatusBanner() {
  const doctor = useAuthStore((s) => s.doctor)
  const { data: agentConfig, isError: isConfigError, isLoading: isConfigLoading } = useAgentConfig()
  const { data: calendarStatus, isError: isCalendarError, isLoading: isCalendarLoading } = useCalendarStatus()
  const { mutate: toggle, isPending } = useToggleAgent()

  if (isConfigLoading || isCalendarLoading) {
    return <div className="h-[108px] animate-pulse rounded-[32px] bg-[#edf3fb]" />
  }

  if (isConfigError || isCalendarError) {
    return (
      <div className="surface-card px-6 py-5">
        <p className="text-sm text-ink-4">Agent status unavailable. Configuration could not be loaded.</p>
      </div>
    )
  }

  const isActive = doctor?.is_agent_active
  const calendarConnected = calendarStatus?.is_connected

  if (!calendarConnected && !isActive) {
    return (
      <div className="surface-card flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Agent setup incomplete</p>
            <p className="mt-1 text-sm leading-7 text-ink-4">
              Connect Google Calendar before turning the receptionist live for booking flow.
            </p>
          </div>
        </div>
        <Link
          href="/onboarding?step=2"
          className="inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-400"
        >
          Complete setup
        </Link>
      </div>
    )
  }

  if (!isActive) {
    return (
      <div className="surface-card flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#dbe5f0] bg-[#eff4fb]">
            <PowerOff className="h-5 w-5 text-ink-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Agent offline</p>
            <p className="mt-1 text-sm leading-7 text-ink-4">
              Calls are not being answered automatically right now. Reactivate when the clinic is ready.
            </p>
          </div>
        </div>
        <button
          onClick={() => toggle()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(28,128,242,0.22)] transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-60"
        >
          <Power className="h-4 w-4" />
          {isPending ? "Activating…" : "Activate agent"}
        </button>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-brand/15 bg-[linear-gradient(135deg,#0d1a2e_0%,#13263d_55%,#1c80f2_180%)] px-6 py-6 text-white shadow-[0_26px_80px_rgba(13,26,46,0.28)]">
      <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles className="h-5 w-5 text-[#9fd0ff]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Agent live and answering calls</p>
            <p className="mt-1 max-w-2xl text-sm leading-7 text-white/68">
              The reception line is active. New intents, calendar updates, and summaries are feeding the command center.
            </p>
            {agentConfig?.glork_phone_number && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs text-white/82">
                <Phone className="h-3.5 w-3.5 text-[#9fd0ff]" />
                <span className="font-mono">{agentConfig.glork_phone_number}</span>
                <button
                  aria-label="Copy agent phone number"
                  onClick={async () => {
                    const ok = await copyToClipboard(agentConfig.glork_phone_number!)
                    if (ok) toast.success("Copied to clipboard")
                    else toast.error("Failed to copy. Please copy manually.")
                  }}
                  className="text-white/60 transition-colors hover:text-white"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => toggle()}
          disabled={isPending}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/16 disabled:opacity-60"
          )}
        >
          <PowerOff className="h-4 w-4" />
          {isPending ? "Deactivating…" : "Deactivate"}
        </button>
      </div>
    </div>
  )
}
