"use client"

import { useState } from "react"
import { Loader2, Phone, PhoneOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
      <Card
        className={cn(
          "border-2 transition-colors duration-300",
          isActive
            ? "border-[#1d6b4a] bg-[#f0faf5]"
            : "border-gray-200 bg-white"
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "relative flex h-14 w-14 items-center justify-center rounded-full",
                  isActive ? "bg-[#1d6b4a]" : "bg-gray-100"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-[#1d6b4a] animate-pulse-ring opacity-40" />
                )}
                {isActive ? (
                  <Phone className="h-6 w-6 text-white" />
                ) : (
                  <PhoneOff className="h-6 w-6 text-gray-400" />
                )}
              </div>
              <div>
                <p className="text-base font-semibold text-gray-900">
                  AI Receptionist
                </p>
                <p className={cn(
                  "text-sm mt-0.5",
                  isActive ? "text-[#1d6b4a] font-medium" : "text-gray-500"
                )}>
                  {isLoading
                    ? "Loading..."
                    : isActive
                      ? "Active — answering patient calls"
                      : "Inactive — not answering calls"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isPending && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
              <Switch
                checked={isActive}
                onCheckedChange={handleToggleClick}
                disabled={isLoading || isPending}
                className="data-[state=checked]:bg-[#1d6b4a]"
              />
            </div>
          </div>

          {isActive && config?.glork_phone_number && (
            <div className="mt-4 pt-4 border-t border-[#c8e6d4]">
              <p className="text-xs text-gray-500">
                Patients can reach the AI at{" "}
                <span className="font-semibold text-gray-700">{config.glork_phone_number}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate AI Receptionist?</AlertDialogTitle>
            <AlertDialogDescription>
              The AI will stop answering patient calls immediately. Any ongoing call will complete,
              but new calls won&apos;t be handled until you reactivate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Active</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
