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

  /* Setup needed */
  if (!calendarConnected && !isActive) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-900">Agent setup incomplete</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Connect Google Calendar to enable appointment booking
            </p>
          </div>
          <Link href="/onboarding?step=2"
            className="shrink-0 rounded-xl bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-semibold text-white transition-colors">
            Complete setup
          </Link>
        </div>
      </div>
    )
  }

  /* Inactive */
  if (!isActive) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
            <PowerOff className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700">Agent is inactive</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Calls are not being answered automatically
            </p>
          </div>
          <button
            onClick={() => toggle()}
            disabled={isPending}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-[#1d6b4a] hover:bg-[#155638] px-4 py-2 text-xs font-semibold text-white transition-all duration-150 disabled:opacity-60"
          >
            <Power className="h-3.5 w-3.5" />
            {isPending ? "Activating…" : "Activate"}
          </button>
        </div>
      </div>
    )
  }

  /* Active */
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-200/60 bg-gradient-to-r from-[#f0faf5] to-[#e6f4ed] px-5 py-4">
      {/* Green left stripe */}
      <div className="absolute inset-y-0 left-0 w-1 bg-[#1d6b4a] rounded-l-2xl" />

      <div className="flex items-center gap-4">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#1d6b4a]">
          <Zap className="h-5 w-5 text-white" />
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#f0faf5]">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-75" />
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-900">
            Agent is live · Answering calls
          </p>
          {agentConfig?.glork_phone_number && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <Phone className="h-3 w-3 text-emerald-600 shrink-0" />
              <span className="text-xs text-emerald-700 font-mono font-medium">
                {agentConfig.glork_phone_number}
              </span>
              <button
                onClick={() => {
                  copyToClipboard(agentConfig.glork_phone_number!)
                  toast.success("Copied to clipboard")
                }}
                className="text-emerald-600 hover:text-emerald-800 transition-colors"
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
            "shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/60",
            "bg-white/70 hover:bg-white px-4 py-2 text-xs font-semibold text-emerald-800",
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
