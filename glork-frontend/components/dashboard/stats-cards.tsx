"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  {
    key:    "total_this_month" as const,
    label:  "Total bookings",
    icon:   Calendar,
    sub:    "This month",
    format: (v: number | string) => v,
  },
  {
    key:    "confirmed_this_month" as const,
    label:  "Confirmed",
    icon:   CheckCircle2,
    sub:    "Active schedule",
    format: (v: number | string) => v,
  },
  {
    key:    "cancelled_this_month" as const,
    label:  "Cancelled",
    icon:   XCircle,
    sub:    "Needs review",
    format: (v: number | string) => v,
  },
  {
    key:    "conversion_rate" as const,
    label:  "Conversion rate",
    icon:   TrendingUp,
    sub:    "Calls → bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%`,
  },
]

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  sub: string
}) {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <Icon className="h-4 w-4 text-[#9CA3AF]" strokeWidth={1.5} />
        <span className="section-label">{sub}</span>
      </div>
      <p className="text-[28px] font-light text-[#111111] tabular-nums tracking-tight leading-none">
        {value}
      </p>
      <p className="mt-1.5 text-[12px] font-normal text-[#9CA3AF]">{label}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-4 animate-pulse rounded bg-[#F3F4F6]" />
        <div className="h-2.5 w-20 animate-pulse rounded bg-[#F3F4F6]" />
      </div>
      <div className="h-8 w-14 animate-pulse rounded bg-[#F3F4F6]" />
      <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[#F3F4F6]" />
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
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card flex min-h-[120px] items-center justify-center p-5">
            <p className="text-[12px] text-[#9CA3AF]">Unavailable</p>
          </div>
        ))}
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
          sub={card.sub}
        />
      ))}
    </div>
  )
}
