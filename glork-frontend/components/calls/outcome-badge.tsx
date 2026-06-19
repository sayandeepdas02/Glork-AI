import { cn } from "@/lib/utils"
import type { CallOutcome } from "@/types"

const CONFIG: Record<CallOutcome, { label: string; cls: string }> = {
  booked:      { label: "Booked",      cls: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" },
  enquiry:     { label: "Enquiry",     cls: "bg-[#F0F9FF] text-[#075985] border-[#BAE6FD]" },
  cancelled:   { label: "Cancelled",   cls: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]" },
  rescheduled: { label: "Rescheduled", cls: "bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD]" },
  transferred: { label: "Transferred", cls: "bg-[#FAF5FF] text-[#6B21A8] border-[#E9D5FF]" },
  failed:      { label: "Failed",      cls: "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]" },
  unanswered:  { label: "Unanswered",  cls: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]" },
}

export function OutcomeBadge({ outcome }: { outcome: CallOutcome }) {
  const c = CONFIG[outcome] ?? { label: outcome, cls: "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]" }
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-normal",
      c.cls
    )}>
      {c.label}
    </span>
  )
}
