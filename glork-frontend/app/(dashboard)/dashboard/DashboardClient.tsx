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
    <div className="rounded-lg border border-[#EEEEEE] bg-white px-3 py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.07)]">
      <p className="text-[11px] font-medium text-[#111111] mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4 text-[11px]">
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
    return <div className="h-40 animate-pulse rounded-lg bg-[#F3F4F6]" />
  }

  if (isError) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-1.5 rounded-lg border border-[#EEEEEE]">
        <AlertTriangle className="h-4 w-4 text-[#D1D5DB]" />
        <p className="text-[11px] font-light text-[#9CA3AF]">Could not load data</p>
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} barGap={3} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 10, fontWeight: 400 }}
            dy={4}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            allowDecimals={false}
            width={20}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)", radius: 4 }} />
          <Bar dataKey="other"  name="Other"  fill="#E5E7EB" radius={[3, 3, 0, 0]} maxBarSize={18} />
          <Bar dataKey="booked" name="Booked" fill="#111111" radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2.5 flex items-center gap-4 px-0.5">
        <span className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#E5E7EB]" />Other
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[#9CA3AF]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#111111]" />Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: stats } = useBookingStats()
  const doctor          = useAuthStore((s) => s.doctor)

  return (
    <div className="space-y-4">

      {/* Greeting — compact */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[13px] font-normal text-[#111111]">
            {getGreeting()}{doctor?.name ? `, ${doctor.name.split(" ")[0]}` : ""}.
          </p>
          <p className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">
            Your AI receptionist is handling the front desk.
          </p>
        </div>
        {stats && (
          <div className="flex items-center gap-3 rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] px-4 py-2.5 shrink-0">
            <div>
              <p className="text-[18px] font-light text-[#111111] tabular-nums leading-none">{stats.total_this_month}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5 uppercase tracking-wider">bookings this month</p>
            </div>
          </div>
        )}
      </div>

      {/* Agent status */}
      <AgentStatusBanner />

      {/* Stats */}
      <StatsCards />

      {/* Chart + upcoming */}
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="surface-card p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="section-label mb-1">Call volume</p>
              <h3 className="text-[13px] font-medium text-[#111111]">7-day booking momentum</h3>
            </div>
          </div>
          <CallsChart />
        </div>
        <UpcomingBookings />
      </div>

      <RecentCalls />
    </div>
  )
}
