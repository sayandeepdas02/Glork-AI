import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

const CONFIG: Record<BookingStatus, { label: string; dot: string; bg: string; text: string }> = {
  confirmed:   { label: "Confirmed",   dot: "bg-emerald-500",  bg: "bg-emerald-50",   text: "text-emerald-700" },
  cancelled:   { label: "Cancelled",   dot: "bg-red-500",      bg: "bg-red-50",       text: "text-red-700" },
  rescheduled: { label: "Rescheduled", dot: "bg-[var(--brand)]", bg: "bg-[var(--brand-dim)]", text: "text-[var(--brand-dark)]" },
  completed:   { label: "Completed",   dot: "bg-black",        bg: "bg-[#f2efea]",     text: "text-[#171717]" },
  no_show:     { label: "No Show",     dot: "bg-amber-500",   bg: "bg-amber-50",    text: "text-amber-700" },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const c = CONFIG[status] ?? { label: status, dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" }
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold",
      c.bg, c.text
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
      {c.label}
    </span>
  )
}
