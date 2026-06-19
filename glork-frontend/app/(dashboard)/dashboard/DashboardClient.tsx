"use client"

import { useMemo } from "react"
import { format, subDays } from "date-fns"
import { AlertTriangle, ArrowUpRight } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings"
import { RecentCalls } from "@/components/dashboard/recent-calls"
import { AgentStatusBanner } from "@/components/dashboard/agent-status-banner"
import { useCalls } from "@/hooks/use-calls"
import { useBookingStats } from "@/hooks/use-bookings"
import type { CallFilters } from "@/types"

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

interface TooltipEntry {
  name: string
  value: number
  fill: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-[20px] border border-[#dbe5f0] bg-white px-4 py-3 shadow-card">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <div className="mt-2 space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-5 text-xs">
            <div className="flex items-center gap-2 text-ink-4">
              <span className="h-2 w-2 rounded-full" style={{ background: entry.fill }} />
              {entry.name}
            </div>
            <span className="font-semibold text-ink">{entry.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function getChartFilters(): CallFilters {
  return {
    limit: 50,
    date_from: format(subDays(new Date(), 6), "yyyy-MM-dd"),
  }
}

function CallsChart() {
  const chartFilters = useMemo(getChartFilters, [])
  const { data: calls, isLoading, isError } = useCalls(chartFilters)

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      return {
        date: format(d, "EEE"),
        day: format(d, "yyyy-MM-dd"),
        total: 0,
        booked: 0,
        other: 0,
      }
    })

    if (!calls?.items) return days

    calls.items.forEach((call) => {
      if (!call.started_at) return
      const day = format(new Date(call.started_at), "yyyy-MM-dd")
      const bucket = days.find((item) => item.day === day)
      if (!bucket) return
      bucket.total++
      if (call.outcome === "booked") bucket.booked++
      else bucket.other++
    })

    return days
  }, [calls])

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-[24px] bg-[#edf3fb]" />
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-[24px] border border-red-100 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-300" />
        <p className="text-sm text-red-600">Could not load volume data.</p>
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={chartData} barGap={6} margin={{ top: 10, right: 0, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,139,167,0.18)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7e8ba0", fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#7e8ba0", fontSize: 11 }}
            allowDecimals={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(28,128,242,0.05)", radius: 10 }} />
          <Bar dataKey="other" name="Other" fill="#d8e2ef" radius={[8, 8, 0, 0]} maxBarSize={28} />
          <Bar dataKey="booked" name="Booked" fill="#1c80f2" radius={[8, 8, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex items-center gap-5 px-1 text-[11px] text-ink-5">
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[#d8e2ef]" />
          Other
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-brand" />
          Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: stats } = useBookingStats()

  return (
    <div className="space-y-6">
      <section className="section-frame overflow-hidden p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="eyebrow">Overview</span>
            <h2 className="mt-5 font-serif text-[2.6rem] leading-tight text-ink sm:text-[3.35rem]">
              {getGreeting()}. Your reception system is staying ahead of the queue.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-4">
              Watch what the AI handled, what converted, and what still needs a person before the day gets noisy.
            </p>
          </div>

          <div className="surface-card-muted flex items-center gap-4 px-5 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">This month</p>
              <p className="mt-1 text-3xl font-semibold text-ink tabular-nums">{stats?.total_this_month ?? "—"}</p>
              <p className="text-sm text-ink-4">Bookings processed</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <AgentStatusBanner />
      <StatsCards />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <div className="surface-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">Calls</p>
              <h3 className="mt-2 text-xl font-semibold text-ink">Seven-day booking momentum</h3>
              <p className="mt-2 text-sm leading-7 text-ink-4">
                Which patient conversations are converting into confirmed appointments.
              </p>
            </div>
            {stats && (
              <div className="rounded-[22px] bg-[#eff4fb] px-4 py-3 text-right">
                <p className="text-2xl font-semibold text-ink tabular-nums">{stats.total_this_month}</p>
                <p className="text-xs text-ink-5">bookings this month</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <CallsChart />
          </div>
        </div>

        <UpcomingBookings />
      </div>

      <RecentCalls />
    </div>
  )
}
