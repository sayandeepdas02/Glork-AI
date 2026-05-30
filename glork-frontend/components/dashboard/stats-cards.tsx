"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  {
    key: "total_this_month" as const,
    label: "Total Bookings",
    icon: Calendar,
    iconColor: "text-[#FF7733]",
    iconBg: "bg-[#FF5500]/15 border-[#FF5500]/20",
    glowColor: "shadow-glow-sm",
    accentColor: "from-[#FF5500]",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "confirmed_this_month" as const,
    label: "Confirmed",
    icon: CheckCircle2,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    glowColor: "",
    accentColor: "from-emerald-500",
    trend: "Active appointments",
    format: (v: number | string) => v,
  },
  {
    key: "cancelled_this_month" as const,
    label: "Cancelled",
    icon: XCircle,
    iconColor: "text-red-400",
    iconBg: "bg-red-500/10 border-red-500/20",
    glowColor: "",
    accentColor: "from-red-500",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "conversion_rate" as const,
    label: "Conversion Rate",
    icon: TrendingUp,
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    glowColor: "",
    accentColor: "from-blue-500",
    trend: "Calls → Bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%`,
  },
]

function StatCard({
  label, value, icon: Icon, iconBg, iconColor, accentColor, trend,
}: {
  label: string; value: number | string; icon: React.ElementType
  iconBg: string; iconColor: string; accentColor: string; trend: string
}) {
  return (
    <div className="relative rounded-2xl bg-[#141210] border border-white/6 p-5 overflow-hidden group hover:border-white/10 transition-all duration-200">
      {/* Top gradient line */}
      <div className={cn("absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r to-transparent opacity-60", accentColor)} />

      <div className="flex items-start justify-between mb-4">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <span className="text-[10px] font-mono text-[#4A4540]">{trend}</span>
      </div>

      <p className="text-3xl font-bold text-white tabular-nums tracking-tight mb-1">{value}</p>
      <p className="text-xs font-medium text-[#8A8480]">{label}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-[#141210] border border-white/6 p-5">
      <div className="h-10 w-10 rounded-xl bg-white/5 animate-pulse mb-4" />
      <div className="space-y-2">
        <div className="h-7 w-14 rounded bg-white/5 animate-pulse" />
        <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
      </div>
    </div>
  )
}

export function StatsCards() {
  const { data: stats, isLoading } = useBookingStats()

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {CARDS.map((c) => (
        <StatCard
          key={c.key}
          label={c.label}
          value={c.format(stats[c.key])}
          icon={c.icon}
          iconBg={c.iconBg}
          iconColor={c.iconColor}
          accentColor={c.accentColor}
          trend={c.trend}
        />
      ))}
    </div>
  )
}
