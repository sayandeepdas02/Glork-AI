"use client"

import { Calendar, CheckCircle2, ExternalLink, Loader2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCalendarStatus, useConnectCalendar, useDisconnectCalendar } from "@/hooks/use-calendar"

export function GoogleCalendarConnect() {
  const { data: status, isLoading, isError: statusError } = useCalendarStatus()
  const {
    mutate: connect,
    isPending: isConnecting,
    isError: connectError,
    reset: resetConnect,
  } = useConnectCalendar()
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectCalendar()

  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-gray-100 shadow-card">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse rounded-full bg-gray-100" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-3 w-64 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (statusError) {
    return (
      <Card className="rounded-2xl border border-red-100">
        <CardContent className="p-6">
          <p className="text-sm text-red-600 font-medium">Could not check calendar status.</p>
          <p className="text-xs text-red-400 mt-1">Refresh the page to try again.</p>
        </CardContent>
      </Card>
    )
  }

  const isConnected = status?.is_connected ?? false

  return (
    <Card className={isConnected ? "border-[#1d6b4a] border-2" : "border-gray-200"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isConnected ? "bg-[#f0faf5]" : "bg-gray-100"}`}>
              <Calendar className={`h-5 w-5 ${isConnected ? "text-[#1d6b4a]" : "text-gray-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">Google Calendar</p>
                {isConnected ? (
                  <CheckCircle2 className="h-4 w-4 text-[#1d6b4a]" />
                ) : (
                  <XCircle className="h-4 w-4 text-gray-400" />
                )}
              </div>
              {isConnected && status?.calendar_name ? (
                <p className="text-sm text-gray-500 mt-0.5">
                  Connected to <span className="font-medium text-gray-700">{status.calendar_name}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">
                  Not connected — AI cannot check or create appointments
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isConnected ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect()}
                disabled={isDisconnecting}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                {isDisconnecting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> Disconnecting…</>
                ) : "Disconnect"}
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => { resetConnect(); connect() }}
                disabled={isConnecting}
                className="bg-[#1d6b4a] hover:bg-[#155638] text-white gap-1.5"
              >
                {isConnecting ? (
                  <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Redirecting…</>
                ) : (
                  <><ExternalLink className="h-3.5 w-3.5" /> Connect</>
                )}
              </Button>
            )}
          </div>
        </div>

        {connectError && (
          <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-xs text-red-700">
              <strong>Connection failed.</strong> Could not get the Google authorization URL. Please try again or contact support.
            </p>
          </div>
        )}

        {!isConnected && !connectError && (
          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-xs text-amber-700">
              <strong>Required:</strong> The AI receptionist needs Google Calendar access to check
              your availability and create appointments. Without it, the agent cannot book appointments.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
