"use client"

import { useState } from "react"
import { Check, Copy, Phone } from "lucide-react"
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
    return <div className="h-12 animate-pulse rounded-lg bg-[#F3F4F6]" />
  }

  if (!phoneNumber) {
    return (
      <div className="rounded-lg border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-4 py-3 text-center">
        <p className="text-[12px] font-light text-[#9CA3AF]">
          Phone number will be assigned when your agent is configured.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111]">
          <Phone className="h-3.5 w-3.5 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-normal uppercase tracking-[0.10em] text-[#9CA3AF]">Patient-facing number</p>
          <p className="text-[14px] font-normal text-[#111111] font-mono tracking-tight">{phoneNumber}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-normal text-[#9CA3AF] transition-colors hover:bg-[#F3F4F6] hover:text-[#111111]"
      >
        {copied ? <><Check className="h-3 w-3" strokeWidth={2} /> Copied</> : <><Copy className="h-3 w-3" strokeWidth={1.5} /> Copy</>}
      </button>
    </div>
  )
}
