"use client"

import { Calendar, CheckCircle2, TrendingUp, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useBookingStats } from "@/hooks/use-bookings"

const CARDS = [
  {
    key: "total_this_month" as const,
    label: "Total bookings",
    icon: Calendar,
    accent: "#1C80F2",
    accentBg: "#EBF4FE",
    accentText: "text-brand",
    trend: "This month",
    format: (v: number | string) => v,
  },
  {
    key: "confirmed_this_month" as const,
    label: "Confirmed",
    icon: CheckCircle2,
    accent: "#10B981",
    accentBg: "#ECFDF5",
    accentText: "text-emerald-600",
    trend: "Active schedule",
    format: (v: number | string) => v,
  },
  {
    key: "cancelled_this_month" as const,
    label: "Cancelled",
    icon: XCircle,
    accent: "#EF4444",
    accentBg: "#FEF2F2",
    accentText: "text-red-500",
    trend: "Needs review",
    format: (v: number | string) => v,
  },
  {
    key: "conversion_rate" as const,
    label: "Conversion rate",
    icon: TrendingUp,
    accent: "#0EA5E9",
    accentBg: "#F0F9FF",
    accentText: "text-sky-600",
    trend: "Calls → bookings",
    format: (v: number | string) => `${Number(v).toFixed(1)}%`,
  },
]

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  accentBg,
  accentText,
  trend,
}: {
  label: string
  value: number | string
  icon: React.ElementType
  accent: string
  accentBg: string
  accentText: string
  trend: string
}) {
  return (
    <div className="surface-card relative overflow-hidden p-5">
      {/* Top accent bar */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-xl"
        style={{ background: accent }}
      />
      <div className="flex items-center justify-between gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: accentBg }}
        >
          <Icon className={cn("h-4.5 w-4.5", accentText)} style={{ width: 18, height: 18 }} />
        </div>
        <span className="section-label text-right">{trend}</span>
      </div>
      <p className="mt-5 text-[30px] font-semibold tracking-tight text-ink tabular-nums leading-none">
        {value}
      </p>
      <p className="mt-1.5 text-[13px] text-ink-4">{label}</p>
    </div>
  )
}

function StatCardSkeleton() {
  return (
    <div className="surface-card p-5">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 animate-pulse rounded-xl bg-gray-100" />
        <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="mt-5 space-y-2">
        <div className="h-8 w-16 animate-pulse rounded bg-gray-100" />
        <div className="h-3.5 w-24 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  )
}

function StatCardError() {
  return (
    <div className="surface-card flex min-h-[136px] items-center justify-center p-5">
      <p className="text-[13px] text-ink-5">Unavailable</p>
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
          accent={card.accent}
          accentBg={card.accentBg}
          accentText={card.accentText}
          trend={card.trend}
        />
      ))}
    </div>
  )
}
