"use client"

import Link from "next/link"
import { AlertTriangle, Copy, Phone, Power, PowerOff, Radio } from "lucide-react"
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
    return <div className="h-[88px] animate-pulse rounded-xl bg-gray-100" />
  }

  if (isConfigError || isCalendarError) {
    return (
      <div className="surface-card px-5 py-4">
        <p className="text-[13px] text-ink-4">Agent status unavailable. Configuration could not be loaded.</p>
      </div>
    )
  }

  const isActive = doctor?.is_agent_active
  const calendarConnected = calendarStatus?.is_connected

  /* ── Setup incomplete ── */
  if (!calendarConnected && !isActive) {
    return (
      <div className="surface-card flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-ink">Setup incomplete</p>
            <p className="text-[13px] text-ink-4 mt-0.5">
              Connect Google Calendar before going live with the AI receptionist.
            </p>
          </div>
        </div>
        <Link
          href="/onboarding?step=2"
          className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-amber-400 shrink-0"
        >
          Complete setup
        </Link>
      </div>
    )
  }

  /* ── Agent offline ── */
  if (!isActive) {
    return (
      <div className="surface-card flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-off-white border border-gray-200">
            <PowerOff className="h-4 w-4 text-ink-5" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-ink">Agent offline</p>
            <p className="text-[13px] text-ink-4 mt-0.5">
              Calls are not being answered automatically. Activate when the clinic is ready.
            </p>
          </div>
        </div>
        <button
          onClick={() => toggle()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 shrink-0"
        >
          <Power className="h-3.5 w-3.5" />
          {isPending ? "Activating…" : "Activate agent"}
        </button>
      </div>
    )
  }

  /* ── Agent live ── */
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#1a3a5c] bg-[#0d1f2d] px-5 py-5 text-white">
      {/* Subtle glow orb */}
      <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          {/* Live indicator */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/8 border border-white/10">
            <Radio className="h-4 w-4 text-brand-mid" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-[14px] font-semibold text-white">Agent live</p>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Answering calls
              </span>
            </div>
            <p className="mt-1 max-w-lg text-[13px] leading-6 text-white/60">
              The reception line is active. Intents, calendar updates, and call summaries feed the dashboard in real time.
            </p>

            {agentConfig?.glork_phone_number && (
              <button
                aria-label="Copy agent phone number"
                onClick={async () => {
                  const ok = await copyToClipboard(agentConfig.glork_phone_number!)
                  if (ok) toast.success("Copied to clipboard")
                  else toast.error("Failed to copy. Please copy manually.")
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/6 px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:bg-white/10 hover:text-white/90"
              >
                <Phone className="h-3.5 w-3.5 text-brand-mid" />
                <span className="font-mono">{agentConfig.glork_phone_number}</span>
                <Copy className="h-3 w-3 opacity-60" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => toggle()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/8 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-white/14 disabled:opacity-50 shrink-0"
        >
          <PowerOff className="h-3.5 w-3.5" />
          {isPending ? "Deactivating…" : "Deactivate"}
        </button>
      </div>
    </div>
  )
}
