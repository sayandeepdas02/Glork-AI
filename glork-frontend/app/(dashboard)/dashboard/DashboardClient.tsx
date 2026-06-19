"use client"

import { useMemo } from "react"
import { format, subDays } from "date-fns"
import { AlertTriangle, ArrowUpRight, TrendingUp } from "lucide-react"
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
import { useAuthStore } from "@/store/auth-store"
import type { CallFilters } from "@/types"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

interface TooltipEntry { name: string; value: number; fill: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-card-md">
      <p className="text-[13px] font-semibold text-ink mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-5 text-[12px]">
          <div className="flex items-center gap-2 text-ink-4">
            <span className="h-2 w-2 rounded-full" style={{ background: entry.fill }} />
            {entry.name}
          </div>
          <span className="font-semibold text-ink">{entry.value}</span>
        </div>
      ))}
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
      return { date: format(d, "EEE"), day: format(d, "yyyy-MM-dd"), total: 0, booked: 0, other: 0 }
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
    return <div className="h-56 animate-pulse rounded-xl bg-gray-100" />
  }

  if (isError) {
    return (
      <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50">
        <AlertTriangle className="h-5 w-5 text-red-300" />
        <p className="text-[13px] text-red-600">Could not load volume data.</p>
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barGap={4} margin={{ top: 8, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
            dy={6}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 11 }}
            allowDecimals={false}
            width={24}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(28,128,242,0.04)", radius: 8 }} />
          <Bar dataKey="other"  name="Other"  fill="#E2E8F0" radius={[6, 6, 0, 0]} maxBarSize={24} />
          <Bar dataKey="booked" name="Booked" fill="#1C80F2" radius={[6, 6, 0, 0]} maxBarSize={24} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center gap-5 px-1">
        <span className="flex items-center gap-2 text-[11px] text-ink-5">
          <span className="inline-block h-2 w-2 rounded-full bg-[#E2E8F0]" />Other
        </span>
        <span className="flex items-center gap-2 text-[11px] text-ink-5">
          <span className="inline-block h-2 w-2 rounded-full bg-brand" />Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: stats } = useBookingStats()
  const doctor = useAuthStore((s) => s.doctor)

  return (
    <div className="space-y-5">
      {/* Hero greeting */}
      <div className="section-frame px-6 py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">Overview</span>
            <h2 className="mt-4 font-serif text-[2.2rem] leading-tight text-ink sm:text-[2.75rem]">
              {getGreeting()}{doctor?.name ? `, ${doctor.name.split(" ")[0]}` : ""}.
            </h2>
            <p className="mt-2 text-[14px] leading-7 text-ink-4 max-w-lg">
              Your AI receptionist is handling the front desk. Here&rsquo;s what&rsquo;s happening today.
            </p>
          </div>

          {stats && (
            <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-off-white px-5 py-4 shrink-0">
              <div>
                <p className="section-label">This month</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">
                  {stats.total_this_month}
                </p>
                <p className="text-[12px] text-ink-5 mt-0.5">bookings processed</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent status */}
      <AgentStatusBanner />

      {/* Stats row */}
      <StatsCards />

      {/* Chart + Upcoming */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        {/* Calls chart */}
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="section-label">Call volume</p>
              <h3 className="mt-1.5 text-[17px] font-semibold text-ink">7-day booking momentum</h3>
              <p className="mt-1 text-[13px] leading-6 text-ink-4">
                Patient calls converting into confirmed appointments.
              </p>
            </div>
            {stats && (
              <div className="rounded-xl bg-off-white px-4 py-3 text-right shrink-0">
                <p className="text-[22px] font-semibold text-ink tabular-nums">{stats.total_this_month}</p>
                <p className="text-[11px] text-ink-5">this month</p>
              </div>
            )}
          </div>
          <CallsChart />
        </div>

        <UpcomingBookings />
      </div>

      {/* Recent calls */}
      <RecentCalls />
    </div>
  )
}
