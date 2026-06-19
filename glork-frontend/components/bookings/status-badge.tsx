import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

const CONFIG: Record<BookingStatus, { label: string; cls: string }> = {
  confirmed:   { label: "Confirmed",   cls: "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]" },
  cancelled:   { label: "Cancelled",   cls: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]" },
  rescheduled: { label: "Rescheduled", cls: "bg-[#F0F9FF] text-[#0C4A6E] border-[#BAE6FD]" },
  completed:   { label: "Completed",   cls: "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]" },
  no_show:     { label: "No Show",     cls: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]" },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const c = CONFIG[status] ?? { label: status, cls: "bg-[#F9FAFB] text-[#6B7280] border-[#E5E7EB]" }
  return (
    <span className={cn(
      "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-normal",
      c.cls
    )}>
      {c.label}
    </span>
  )
}
