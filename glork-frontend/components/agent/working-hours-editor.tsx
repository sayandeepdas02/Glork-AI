"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useAgentConfig, useUpdateAgentConfig } from "@/hooks/use-agent-config"
import type { WorkingHours } from "@/types"

const DAYS = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
  { key: "sun", label: "Sunday" },
] as const

type DayKey = typeof DAYS[number]["key"]

const TIME_OPTIONS = Array.from({ length: 32 }, (_, i) => {
  const totalMins = 6 * 60 + i * 30
  const h = Math.floor(totalMins / 60).toString().padStart(2, "0")
  const m = (totalMins % 60).toString().padStart(2, "0")
  const display = new Date(`2000-01-01T${h}:${m}`).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  })
  return { value: `${h}:${m}`, label: display }
})

export function WorkingHoursEditor() {
  const { data: config, isLoading } = useAgentConfig()
  const { mutate: update, isPending } = useUpdateAgentConfig()
  const [hours, setHours] = useState<WorkingHours | null>(null)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (config?.working_hours && !dirty) {
      setHours(config.working_hours)
    }
  }, [config, dirty])

  if (isLoading || !hours) {
    return (
      <div className="space-y-3">
        {DAYS.map((d) => (
          <div key={d.key} className="h-12 animate-pulse rounded-lg bg-gray-100" />
        ))}
      </div>
    )
  }

  const updateDay = (day: DayKey, field: "enabled" | "start" | "end", value: string | boolean) => {
    setHours((prev) => prev ? {
      ...prev,
      [day]: { ...prev[day], [field]: value },
    } : prev)
    setDirty(true)
  }

  const copyToWeekdays = () => {
    const mondayHours = hours.mon
    setHours((prev) => prev ? {
      ...prev,
      tue: { ...mondayHours },
      wed: { ...mondayHours },
      thu: { ...mondayHours },
      fri: { ...mondayHours },
    } : prev)
    setDirty(true)
  }

  const handleSave = () => {
    if (!hours) return
    update({ working_hours: hours })
    setDirty(false)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {DAYS.map(({ key, label }) => {
          const daySchedule = hours[key]
          return (
            <div
              key={key}
              className="flex items-center gap-4 rounded-lg border border-gray-200 px-4 py-3"
            >
              <div className="w-32 flex items-center gap-2.5">
                <Switch
                  checked={daySchedule.enabled}
                  onCheckedChange={(v) => updateDay(key, "enabled", v)}
                  className="data-[state=checked]:bg-[#1d6b4a]"
                />
                <Label className="text-sm font-medium text-gray-700 cursor-pointer">
                  {label}
                </Label>
              </div>

              {daySchedule.enabled ? (
                <div className="flex items-center gap-2 flex-1">
                  <Select
                    value={daySchedule.start}
                    onValueChange={(v) => updateDay(key, "start", v)}
                  >
                    <SelectTrigger className="h-8 w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-sm">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-gray-500">to</span>
                  <Select
                    value={daySchedule.end}
                    onValueChange={(v) => updateDay(key, "end", v)}
                  >
                    <SelectTrigger className="h-8 w-32 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {TIME_OPTIONS.map((t) => (
                        <SelectItem key={t.value} value={t.value} className="text-sm">
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <span className="text-sm text-gray-400 flex-1">Closed</span>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToWeekdays}
          className="text-xs text-gray-500 hover:text-gray-900"
        >
          Copy Monday hours to weekdays
        </Button>
        <Button
          onClick={handleSave}
          disabled={!dirty || isPending}
          size="sm"
          className="bg-[#1d6b4a] hover:bg-[#155638] text-white"
        >
          {isPending ? "Saving…" : "Save Hours"}
        </Button>
      </div>
    </div>
  )
}
