"use client"

import { Calendar, Clock, Phone, Tag } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OutcomeBadge } from "@/components/calls/outcome-badge"
import { formatAppointmentDate, formatAppointmentTime, formatDuration, formatPhone } from "@/lib/utils"
import type { CallLog } from "@/types"

interface CallDetailCardProps {
  call: CallLog
}

function Row({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm text-gray-800 font-medium">{value}</p>
      </div>
    </div>
  )
}

export function CallDetailCard({ call }: CallDetailCardProps) {
  return (
    <Card className="rounded-[30px] border border-gray-100 shadow-none">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl">
            {call.caller_phone ? formatPhone(call.caller_phone) : "Unknown Caller"}
          </CardTitle>
          <OutcomeBadge outcome={call.outcome} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Row
            icon={Calendar}
            label="Date"
            value={call.started_at ? formatAppointmentDate(call.started_at) : "—"}
          />
          <Row
            icon={Clock}
            label="Time"
            value={call.started_at ? formatAppointmentTime(call.started_at) : "—"}
          />
          <Row
            icon={Clock}
            label="Duration"
            value={call.duration_seconds != null ? formatDuration(call.duration_seconds) : "—"}
          />
          <Row
            icon={Tag}
            label="Outcome"
            value={<OutcomeBadge outcome={call.outcome} />}
          />
        </div>

        {call.agent_summary && (
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Summary
            </h4>
            <p className="rounded-2xl bg-[#f7f5f1] p-4 text-sm leading-relaxed text-gray-700">
              {call.agent_summary}
            </p>
          </div>
        )}

        {call.retell_call_id && (
          <div className="space-y-1">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Retell Call ID
            </h4>
            <p className="text-xs text-gray-400 font-mono break-all">{call.retell_call_id}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
