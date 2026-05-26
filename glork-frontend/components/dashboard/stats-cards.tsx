"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  {
    key: "total_this_month" as const,
    label: "Total bookings",
    icon: Calendar,
    iconBg: "bg-[#1d6b4a]/10",
    iconColor: "text-[#1d6b4a]",
    accent: "before:bg-[#1d6b4a]",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "confirmed_this_month" as const,
    label: "Confirmed",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "before:bg-emerald-500",
    trend: "Active appointments",
    format: (v: number | string) => v,
  },
  {
    key: "cancelled_this_month" as const,
    label: "Cancelled",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    accent: "before:bg-red-400",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "conversion_rate" as const,
    label: "Conversion rate",
    icon: TrendingUp,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    accent: "before:bg-blue-500",
    trend: "Calls → Bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%`,
  },
]

function StatCard({
  label, value, icon: Icon, iconBg, iconColor, accent, trend,
}: {
  label: string; value: number | string; icon: React.ElementType
  iconBg: string; iconColor: string; accent: string; trend: string
}) {
  return (
    <div className={cn(
      "relative rounded-2xl bg-white border border-gray-100 p-5 shadow-card",
      "before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:rounded-t-2xl",
      accent
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-xs text-gray-400">{trend}</p>
      </div>
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-5 shadow-card">
      <div className="h-10 w-10 rounded-xl bg-gray-100 animate-pulse mb-3" />
      <div className="space-y-2">
        <div className="h-6 w-16 rounded-lg bg-gray-100 animate-pulse" />
        <div className="h-4 w-24 rounded bg-gray-100 animate-pulse" />
        <div className="h-3 w-20 rounded bg-gray-100 animate-pulse" />
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
          accent={c.accent}
          trend={c.trend}
        />
      ))}
    </div>
  )
}
