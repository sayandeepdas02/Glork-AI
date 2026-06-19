"use client"

import Link from "next/link"
import { AlertTriangle, Copy, Phone, Power, PowerOff } from "lucide-react"
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
    return <div className="h-[72px] animate-pulse rounded-lg bg-[#F3F4F6]" />
  }

  if (isConfigError || isCalendarError) {
    return (
      <div className="surface-card px-5 py-3.5">
        <p className="text-[13px] text-[#9CA3AF]">Agent status unavailable.</p>
      </div>
    )
  }

  const isActive         = doctor?.is_agent_active
  const calendarConnected = calendarStatus?.is_connected

  /* ── Setup incomplete ── */
  if (!calendarConnected && !isActive) {
    return (
      <div className="surface-card flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FEF3C7]">
            <AlertTriangle className="h-3.5 w-3.5 text-[#D97706]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#111111]">Setup incomplete</p>
            <p className="text-[12px] font-light text-[#9CA3AF] mt-0.5">
              Connect Google Calendar before going live with the AI receptionist.
            </p>
          </div>
        </div>
        <Link
          href="/onboarding?step=2"
          className="inline-flex items-center justify-center rounded-lg border border-[#D97706] px-4 py-2 text-[12px] font-medium text-[#D97706] transition-colors hover:bg-[#FEF3C7] shrink-0"
        >
          Complete setup →
        </Link>
      </div>
    )
  }

  /* ── Agent offline ── */
  if (!isActive) {
    return (
      <div className="surface-card flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
            <PowerOff className="h-3.5 w-3.5 text-[#9CA3AF]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#111111]">Agent offline</p>
            <p className="text-[12px] font-light text-[#9CA3AF] mt-0.5">
              Calls are not being answered automatically right now.
            </p>
          </div>
        </div>
        <button
          onClick={() => toggle()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#111111] px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#333333] disabled:opacity-50 shrink-0"
        >
          <Power className="h-3.5 w-3.5" strokeWidth={1.5} />
          {isPending ? "Activating…" : "Activate agent"}
        </button>
      </div>
    )
  }

  /* ── Agent live ── */
  return (
    <div className="relative overflow-hidden rounded-lg border border-[#1A1A1A] bg-[#111111] px-5 py-4 text-white">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          {/* Live dot */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8 border border-white/10">
            <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse-dot" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium text-white">Agent live</p>
              <span className="text-[10px] font-medium text-[#22C55E] uppercase tracking-wider">
                · answering calls
              </span>
            </div>
            <p className="text-[12px] font-light text-white/50 mt-0.5">
              Reception line active. Intents and summaries feed the dashboard in real time.
            </p>

            {agentConfig?.glork_phone_number && (
              <button
                aria-label="Copy agent phone number"
                onClick={async () => {
                  const ok = await copyToClipboard(agentConfig.glork_phone_number!)
                  if (ok) toast.success("Copied to clipboard")
                  else toast.error("Failed to copy. Please copy manually.")
                }}
                className="mt-2 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-white/60 transition-colors hover:bg-white/8 hover:text-white/80"
              >
                <Phone className="h-3 w-3" strokeWidth={1.5} />
                <span className="font-mono">{agentConfig.glork_phone_number}</span>
                <Copy className="h-3 w-3 opacity-50" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => toggle()}
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 py-2 text-[12px] font-medium text-white transition-colors hover:bg-white/12 disabled:opacity-40 shrink-0"
        >
          <PowerOff className="h-3.5 w-3.5" strokeWidth={1.5} />
          {isPending ? "Deactivating…" : "Deactivate"}
        </button>
      </div>
    </div>
  )
}
