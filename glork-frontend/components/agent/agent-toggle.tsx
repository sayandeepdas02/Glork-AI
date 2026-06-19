"use client"

import { useState } from "react"
import { Loader2, Phone, PhoneOff, Radio } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useAgentConfig, useToggleAgent } from "@/hooks/use-agent-config"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export function AgentToggle() {
  const { data: config, isLoading } = useAgentConfig()
  const { doctor } = useAuth()
  const { mutate: toggle, isPending } = useToggleAgent()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isActive = doctor?.is_agent_active ?? false

  const handleToggleClick = () => {
    if (isActive) {
      setConfirmOpen(true)
    } else {
      toggle()
    }
  }

  const handleConfirmDeactivate = () => {
    toggle()
    setConfirmOpen(false)
  }

  return (
    <>
      <div
        className={cn(
          "rounded-xl border p-4 transition-colors duration-300",
          isActive
            ? "border-brand/20 bg-brand-light"
            : "border-gray-100 bg-off-white"
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div
              className={cn(
                "relative flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300",
                isActive ? "bg-brand" : "bg-gray-100"
              )}
            >
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-brand/30 animate-pulse-ring" />
              )}
              {isActive ? (
                <Radio className="h-5 w-5 text-white" />
              ) : (
                <PhoneOff className="h-5 w-5 text-ink-5" />
              )}
            </div>

            <div>
              <p className="text-[14px] font-semibold text-ink">AI Receptionist</p>
              <p
                className={cn(
                  "text-[12px] mt-0.5 font-medium",
                  isActive ? "text-brand" : "text-ink-5"
                )}
              >
                {isLoading
                  ? "Loading…"
                  : isActive
                    ? "Live — answering patient calls"
                    : "Inactive — not answering calls"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-ink-5" />}
            <Switch
              checked={isActive}
              onCheckedChange={handleToggleClick}
              disabled={isLoading || isPending}
              className="data-[state=checked]:bg-brand"
            />
          </div>
        </div>

        {isActive && config?.glork_phone_number && (
          <div className="mt-3 pt-3 border-t border-brand/15">
            <p className="text-[12px] text-ink-4">
              Reception line:{" "}
              <span className="font-mono font-semibold text-ink">{config.glork_phone_number}</span>
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-xl border-gray-100">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[16px]">Deactivate AI receptionist?</AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-ink-4">
              The AI will stop answering patient calls immediately. Any ongoing call will complete,
              but new calls won&apos;t be handled until you reactivate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg text-[13px]">Keep active</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              className="rounded-lg bg-ink text-[13px] text-white hover:bg-ink-2"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
