"use client"

import { useState } from "react"
import { Loader2, Phone, PhoneOff } from "lucide-react"
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
  const { doctor }                  = useAuth()
  const { mutate: toggle, isPending } = useToggleAgent()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const isActive = doctor?.is_agent_active ?? false

  return (
    <>
      <div className={cn(
        "rounded-lg border p-4 transition-colors duration-200",
        isActive ? "border-[#EEEEEE] bg-[#FAFAFA]" : "border-[#EEEEEE] bg-[#FAFAFA]"
      )}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200",
              isActive ? "bg-[#111111]" : "bg-[#F3F4F6]"
            )}>
              {isActive
                ? <Phone className="h-4 w-4 text-white" strokeWidth={1.5} />
                : <PhoneOff className="h-4 w-4 text-[#9CA3AF]" strokeWidth={1.5} />
              }
            </div>
            <div>
              <p className="text-[13px] font-medium text-[#111111]">AI Receptionist</p>
              <p className={cn(
                "text-[11px] font-light mt-0.5",
                isActive ? "text-[#22C55E]" : "text-[#9CA3AF]"
              )}>
                {isLoading
                  ? "Loading…"
                  : isActive
                    ? "Live — answering patient calls"
                    : "Inactive — not answering calls"
                }
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#9CA3AF]" />}
            <Switch
              checked={isActive}
              onCheckedChange={() => isActive ? setConfirmOpen(true) : toggle()}
              disabled={isLoading || isPending}
              className="data-[state=checked]:bg-[#111111]"
            />
          </div>
        </div>

        {isActive && config?.glork_phone_number && (
          <div className="mt-3 pt-3 border-t border-[#EEEEEE]">
            <p className="text-[11px] font-light text-[#9CA3AF]">
              Reception line:{" "}
              <span className="font-mono font-normal text-[#333333]">{config.glork_phone_number}</span>
            </p>
          </div>
        )}
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="rounded-xl border-[#EEEEEE]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[15px] font-medium text-[#111111]">
              Deactivate AI receptionist?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] font-light text-[#9CA3AF]">
              The AI will stop answering patient calls immediately. New calls won&apos;t be handled until you reactivate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg border-[#E5E7EB] text-[13px] font-normal text-[#6B7280] hover:bg-[#F9FAFB]">
              Keep active
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { toggle(); setConfirmOpen(false) }}
              className="rounded-lg bg-[#111111] text-[13px] font-medium text-white hover:bg-[#333333]"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
