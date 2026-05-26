import { cn } from "@/lib/utils"
import type { BookingStatus } from "@/types"

const CONFIG: Record<BookingStatus, { label: string; dot: string; bg: string; text: string }> = {
  confirmed:   { label: "Confirmed",   dot: "bg-emerald-500",  bg: "bg-emerald-50",   text: "text-emerald-700" },
  cancelled:   { label: "Cancelled",   dot: "bg-red-400",      bg: "bg-red-50",       text: "text-red-700" },
  rescheduled: { label: "Rescheduled", dot: "bg-blue-400",     bg: "bg-blue-50",      text: "text-blue-700" },
  completed:   { label: "Completed",   dot: "bg-gray-400",     bg: "bg-gray-100",     text: "text-gray-600" },
  no_show:     { label: "No Show",     dot: "bg-orange-400",   bg: "bg-orange-50",    text: "text-orange-700" },
}

export function StatusBadge({ status }: { status: BookingStatus }) {
  const c = CONFIG[status] ?? { label: status, dot: "bg-gray-400", bg: "bg-gray-100", text: "text-gray-600" }
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
      c.bg, c.text
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", c.dot)} />
      {c.label}
    </span>
  )
}
