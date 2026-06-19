"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  { key: "total_this_month"      as const, label: "Total bookings",  icon: Calendar,    sub: "This month"      },
  { key: "confirmed_this_month"  as const, label: "Confirmed",       icon: CheckCircle2, sub: "Active schedule" },
  { key: "cancelled_this_month"  as const, label: "Cancelled",       icon: XCircle,     sub: "Needs review"    },
  { key: "conversion_rate"       as const, label: "Conversion rate", icon: TrendingUp,  sub: "Calls → bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%` },
]

function StatCard({ label, value, icon: Icon, sub }: {
  label: string; value: number | string; icon: React.ElementType; sub: string
}) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <Icon className="h-3.5 w-3.5 text-[#9CA3AF]" strokeWidth={1.5} />
        <span className="section-label">{sub}</span>
      </div>
      <p className="text-[20px] font-light text-[#111111] tabular-nums tracking-tight leading-none">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-normal text-[#9CA3AF]">{label}</p>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="h-3.5 w-3.5 animate-pulse rounded bg-[#F3F4F6]" />
        <div className="h-2 w-16 animate-pulse rounded bg-[#F3F4F6]" />
      </div>
      <div className="h-6 w-12 animate-pulse rounded bg-[#F3F4F6]" />
      <div className="mt-1.5 h-2.5 w-20 animate-pulse rounded bg-[#F3F4F6]" />
    </div>
  )
}

export function StatsCards() {
  const { data: stats, isLoading, isError } = useBookingStats()

  if (isLoading) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="surface-card flex min-h-[96px] items-center justify-center p-4">
            <p className="text-[11px] text-[#9CA3AF]">Unavailable</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => (
        <StatCard
          key={card.key}
          label={card.label}
          value={card.format ? card.format(stats[card.key]) : stats[card.key]}
          icon={card.icon}
          sub={card.sub}
        />
      ))}
    </div>
  )
}
