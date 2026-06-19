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
    return <div className="h-14 animate-pulse rounded-xl bg-gray-100" />
  }

  if (!phoneNumber) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-off-white px-4 py-3 text-center">
        <p className="text-[13px] text-ink-5">
          Phone number will be assigned when your agent is configured.
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-brand/15 bg-brand-light px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand">
          <Phone className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] text-ink-5 font-medium">Patient-facing number</p>
          <p className="text-[15px] font-semibold text-ink tracking-wide font-mono">{phoneNumber}</p>
        </div>
      </div>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-brand transition-colors hover:bg-brand/10"
      >
        {copied ? (
          <><Check className="h-3.5 w-3.5" /> Copied</>
        ) : (
          <><Copy className="h-3.5 w-3.5" /> Copy</>
        )}
      </button>
    </div>
  )
}
