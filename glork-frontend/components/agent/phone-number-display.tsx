"use client"

import { useState } from "react"
import { Check, Copy, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAgentConfig } from "@/hooks/use-agent-config"
import { copyToClipboard } from "@/lib/utils"

export function PhoneNumberDisplay() {
  const { data: config, isLoading } = useAgentConfig()
  const [copied, setCopied] = useState(false)

  const phoneNumber = config?.glork_phone_number

  const handleCopy = async () => {
    if (!phoneNumber) return
    await copyToClipboard(phoneNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return <div className="h-14 animate-pulse rounded-lg bg-gray-100" />
  }

  if (!phoneNumber) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-500 text-center">
          Phone number will be assigned when your agent is configured.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#e6f4ed] bg-[#f0faf5] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1d6b4a]">
          <Phone className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs text-gray-500">Patient-facing number</p>
          <p className="text-base font-semibold text-gray-900 tracking-wide">{phoneNumber}</p>
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className="h-8 gap-1.5 text-xs text-[#1d6b4a] hover:text-[#155638] hover:bg-[#e6f4ed]"
      >
        {copied ? (
          <><Check className="h-3.5 w-3.5" /> Copied</>
        ) : (
          <><Copy className="h-3.5 w-3.5" /> Copy</>
        )}
      </Button>
    </div>
  )
}
