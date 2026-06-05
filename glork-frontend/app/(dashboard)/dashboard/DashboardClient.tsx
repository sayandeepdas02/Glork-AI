"use client"

import { useMemo } from "react"
import { format, subDays } from "date-fns"
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings"
import { RecentCalls } from "@/components/dashboard/recent-calls"
import { AgentStatusBanner } from "@/components/dashboard/agent-status-banner"
import { useCalls } from "@/hooks/use-calls"
import { useBookingStats } from "@/hooks/use-bookings"

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
    <div className="rounded-xl border border-[#E8E8E3] bg-white px-3.5 py-2.5 shadow-md text-xs">
      <p className="font-semibold text-[#111] mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
              <span className="text-[#888]">{p.name}</span>
            </div>
            <span className="font-semibold text-[#111] tabular-nums">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function CallsChart() {
  const { data: calls, isLoading } = useCalls({ limit: 300 })

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
      const bucket = days.find((d) => d.day === day)
      if (bucket) {
        bucket.total++
        if (call.outcome === "booked") bucket.booked++
        else bucket.other++
      }
    })
    return days
  }, [calls])

  if (isLoading) {
    return <div className="h-52 animate-pulse rounded-xl bg-[#F0F0EC]" />
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={4} margin={{ top: 10, right: 0, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#999", fontSize: 11, fontWeight: 500 }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#999", fontSize: 11 }}
            allowDecimals={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)", radius: 6 }} />
          <Bar dataKey="other" name="Other" fill="#D8D8D0" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="booked" name="Booked" fill="var(--brand)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 px-1">
        <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
          <span className="inline-block h-2 w-2 rounded-sm bg-[#D8D8D0]" /> Other
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-[#888]">
          <span className="inline-block h-2 w-2 rounded-sm bg-brand" /> Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardClient() {
  const { data: stats } = useBookingStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#111]">{getGreeting()} 👋</h2>
          <p className="text-[13px] text-[#888] mt-0.5 font-mono">Here&apos;s what&apos;s happening with your clinic</p>
        </div>
      </div>

      <AgentStatusBanner />
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 rounded-2xl bg-white border border-[#E8E8E3] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-[#111]">Call volume</h3>
              <p className="text-[11px] font-mono text-[#aaa] mt-0.5">Last 7 days</p>
            </div>
            {stats && (
              <div className="text-right">
                <p className="text-lg font-bold text-[#111] tabular-nums">
                  {stats.total_this_month}
                </p>
                <p className="text-[11px] font-mono text-[#aaa]">bookings this month</p>
              </div>
            )}
          </div>
          <CallsChart />
        </div>

        <div className="lg:col-span-2">
          <UpcomingBookings />
        </div>
      </div>

      <RecentCalls />
    </div>
  )
}
