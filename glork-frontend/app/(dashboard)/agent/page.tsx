import type { Metadata } from "next"
import { AgentToggle } from "@/components/agent/agent-toggle"
import { PhoneNumberDisplay } from "@/components/agent/phone-number-display"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentConfigForm } from "@/components/agent/agent-config-form"
import { WorkingHoursEditor } from "@/components/agent/working-hours-editor"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"

export const metadata: Metadata = { title: "AI Agent · Hyperglork" }

export default function AgentPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div className="panel-surface rounded-[30px] px-6 py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Agent</p>
        <h2 className="mt-2 text-[30px] font-semibold tracking-tight text-gray-900">AI Receptionist</h2>
        <p className="mt-2 text-sm leading-7 text-gray-500">Configure and manage your AI phone agent</p>
      </div>

      <AgentToggle />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Agent Number</p>
        <PhoneNumberDisplay />
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 rounded-[24px] bg-white p-1.5 shadow-[0_12px_24px_rgba(17,17,17,0.04)]">
          <TabsTrigger value="general" className="rounded-[18px] text-sm data-[state=active]:bg-[#111111] data-[state=active]:text-white data-[state=active]:shadow-none">
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="rounded-[18px] text-sm data-[state=active]:bg-[#111111] data-[state=active]:text-white data-[state=active]:shadow-none">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-[18px] text-sm data-[state=active]:bg-[#111111] data-[state=active]:text-white data-[state=active]:shadow-none">
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-5">
          <div className="rounded-[30px] bg-white border border-gray-100 p-6 shadow-[0_16px_30px_rgba(17,17,17,0.04)]">
            <AgentConfigForm />
          </div>
        </TabsContent>

        <TabsContent value="hours" className="mt-5">
          <div className="rounded-[30px] bg-white border border-gray-100 p-6 shadow-[0_16px_30px_rgba(17,17,17,0.04)]">
            <WorkingHoursEditor />
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="mt-5">
          <GoogleCalendarConnect />
        </TabsContent>
      </Tabs>
    </div>
  )
}
