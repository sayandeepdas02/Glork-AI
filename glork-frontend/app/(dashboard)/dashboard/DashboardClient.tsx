"use client"

import { useMemo } from "react"
import { format, subDays } from "date-fns"
import { AlertTriangle } from "lucide-react"
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from "recharts"
import { StatsCards }         from "@/components/dashboard/stats-cards"
import { UpcomingBookings }   from "@/components/dashboard/upcoming-bookings"
import { RecentCalls }        from "@/components/dashboard/recent-calls"
import { AgentStatusBanner }  from "@/components/dashboard/agent-status-banner"
import { useCalls }           from "@/hooks/use-calls"
import { useBookingStats }    from "@/hooks/use-bookings"
import { useAuthStore }       from "@/store/auth-store"
import type { CallFilters }   from "@/types"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 18) return "Good afternoon"
  return "Good evening"
}

interface TooltipEntry   { name: string; value: number; fill: string }
interface CustomTooltipProps { active?: boolean; payload?: TooltipEntry[]; label?: string }

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#EEEEEE] bg-white px-3.5 py-3 shadow-[0_4px_12px_rgba(0,0,0,0.07)]">
      <p className="text-[12px] font-medium text-[#111111] mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-5 text-[11px]">
          <span className="flex items-center gap-1.5 text-[#9CA3AF]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: entry.fill }} />
            {entry.name}
          </span>
          <span className="font-medium text-[#111111]">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

function getChartFilters(): CallFilters {
  return { limit: 50, date_from: format(subDays(new Date(), 6), "yyyy-MM-dd") }
}

function CallsChart() {
  const chartFilters = useMemo(getChartFilters, [])
  const { data: calls, isLoading, isError } = useCalls(chartFilters)

  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i)
      return { date: format(d, "EEE"), day: format(d, "yyyy-MM-dd"), booked: 0, other: 0 }
    })
    if (!calls?.items) return days
    calls.items.forEach((call) => {
      if (!call.started_at) return
      const day    = format(new Date(call.started_at), "yyyy-MM-dd")
      const bucket = days.find((item) => item.day === day)
      if (!bucket) return
      if (call.outcome === "booked") bucket.booked++
      else bucket.other++
    })
    return days
  }, [calls])

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-lg bg-[#F3F4F6]" />
  }

  if (isError) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA]">
        <AlertTriangle className="h-4 w-4 text-[#D1D5DB]" />
        <p className="text-[12px] text-[#9CA3AF]">Could not load data</p>
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={3} margin={{ top: 6, right: 0, left: -22, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11, fontWeight: 400 }}
            dy={5}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 11 }}
            allowDecimals={false}
            width={22}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 4 }} />
          <Bar dataKey="other"  name="Other"  fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={20} />
          <Bar dataKey="booked" name="Booked" fill="#111111" radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex items-center gap-4 px-1">
        <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <span className="h-2 w-2 rounded-full bg-[#E5E7EB]" />Other
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#9CA3AF]">
          <span className="h-2 w-2 rounded-full bg-[#111111]" />Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: stats } = useBookingStats()
  const doctor          = useAuthStore((s) => s.doctor)

  return (
    <div className="space-y-5">

      {/* Hero greeting */}
      <div className="pb-2">
        <p className="eyebrow mb-2">Overview</p>
        <h2 className="text-[2rem] font-light text-[#111111] tracking-tight leading-tight">
          {getGreeting()}{doctor?.name ? `, ${doctor.name.split(" ")[0]}` : ""}.
        </h2>
        <p className="mt-2 text-[13px] font-light text-[#9CA3AF] max-w-md leading-relaxed">
          Your AI receptionist is handling the front desk. Here&rsquo;s what&rsquo;s happening today.
        </p>
      </div>

      {/* Agent status */}
      <AgentStatusBanner />

      {/* Stats */}
      <StatsCards />

      {/* Chart + upcoming */}
      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">

        {/* Calls chart */}
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <p className="section-label mb-1.5">Call volume</p>
              <h3 className="text-[15px] font-medium text-[#111111] tracking-tight">
                7-day booking momentum
              </h3>
              <p className="mt-1 text-[12px] font-light text-[#9CA3AF]">
                Calls converting into confirmed appointments.
              </p>
            </div>
            {stats && (
              <div className="rounded-lg bg-[#FAFAFA] border border-[#EEEEEE] px-4 py-3 text-right shrink-0">
                <p className="text-[22px] font-light text-[#111111] tabular-nums">{stats.total_this_month}</p>
                <p className="text-[10px] text-[#9CA3AF] mt-0.5 uppercase tracking-wider">this month</p>
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
