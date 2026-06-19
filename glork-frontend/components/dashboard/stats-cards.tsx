"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  {
    key: "total_this_month" as const,
    label: "Total bookings",
    icon: Calendar,
    iconColor: "text-brand",
    iconBg: "bg-brand/10",
    accentColor: "from-brand",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "confirmed_this_month" as const,
    label: "Confirmed",
    icon: CheckCircle2,
    iconColor: "text-emerald-600",
    iconBg: "bg-emerald-50",
    accentColor: "from-emerald-500",
    trend: "Active schedule",
    format: (v: number | string) => v,
  },
  {
    key: "cancelled_this_month" as const,
    label: "Cancelled",
    icon: XCircle,
    iconColor: "text-red-500",
    iconBg: "bg-red-50",
    accentColor: "from-red-500",
    trend: "Needs review",
    format: (v: number | string) => v,
  },
  {
    key: "conversion_rate" as const,
    label: "Conversion rate",
    icon: TrendingUp,
    iconColor: "text-sky-600",
    iconBg: "bg-sky-50",
    accentColor: "from-sky-500",
    trend: "Calls to bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%`,
  },
]

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  accentColor,
  trend,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  accentColor: string
  trend: string
}) {
  return (
    <div className="surface-card relative overflow-hidden p-5">
      <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r to-transparent opacity-80", accentColor)} />
      <div className="flex items-start justify-between gap-4">
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", iconBg)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-5">{trend}</span>
      </div>
      <p className="mt-8 text-3xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
      <p className="mt-1 text-sm text-ink-4">{label}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="h-11 w-11 animate-pulse rounded-2xl bg-[#edf3fb]" />
      <div className="mt-8 space-y-2">
        <div className="h-8 w-20 animate-pulse rounded bg-[#edf3fb]" />
        <div className="h-4 w-24 animate-pulse rounded bg-[#edf3fb]" />
      </div>
    </div>
  )
}

function StatCardError() {
  return (
    <div className="surface-card flex min-h-[152px] items-center justify-center p-5">
      <p className="text-sm text-ink-5">Unavailable</p>
    </div>
  )
}

export function StatsCards() {
  const { data: stats, isLoading, isError } = useBookingStats()

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <StatCardError key={i} />)}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.format(stats[card.key])}
          icon={card.icon}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
          accentColor={card.accentColor}
          trend={card.trend}
        />
      ))}
    </div>
  )
}
