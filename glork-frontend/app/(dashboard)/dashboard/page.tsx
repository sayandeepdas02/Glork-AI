"use client"

import { useMemo } from "react"
import { format, subDays } from "date-fns"
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { UpcomingBookings } from "@/components/dashboard/upcoming-bookings"
import { RecentCalls } from "@/components/dashboard/recent-calls"
import { AgentStatusBanner } from "@/components/dashboard/agent-status-banner"
import { useCalls } from "@/hooks/use-calls"
import { useBookingStats } from "@/hooks/use-bookings"

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3.5 py-2.5 shadow-lg text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
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
    return <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} barGap={4} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#9ca3af", fontSize: 11 }}
            allowDecimals={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.02)", radius: 6 }} />
          <Bar dataKey="other" name="Other" fill="#e5e7eb" radius={[4, 4, 0, 0]} maxBarSize={28} />
          <Bar dataKey="booked" name="Booked" fill="#1d6b4a" radius={[4, 4, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 px-1">
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <span className="inline-block h-2 w-2 rounded-sm bg-gray-200" /> Other
        </span>
        <span className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <span className="inline-block h-2 w-2 rounded-sm bg-[#1d6b4a]" /> Booked
        </span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats } = useBookingStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Good morning 👋</h2>
          <p className="text-sm text-gray-500 mt-0.5">Here's what's happening with your clinic</p>
        </div>
      </div>

      <AgentStatusBanner />
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Chart */}
        <div className="lg:col-span-3 rounded-2xl bg-white border border-gray-100 shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Call volume</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 7 days</p>
            </div>
            {stats && (
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900 tabular-nums">
                  {stats.total_this_month}
                </p>
                <p className="text-[11px] text-gray-400">bookings this month</p>
              </div>
            )}
          </div>
          <CallsChart />
        </div>

        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
          <UpcomingBookings />
        </div>
      </div>

      {/* Recent calls — full width */}
      <RecentCalls />
    </div>
  )
}
