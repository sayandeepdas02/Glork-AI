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
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">AI Receptionist</h2>
        <p className="text-sm text-gray-500 mt-0.5">Configure and manage your AI phone agent</p>
      </div>

      <AgentToggle />

      <div className="space-y-2">
        <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Agent Number</p>
        <PhoneNumberDisplay />
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid grid-cols-3 w-full rounded-xl bg-gray-100/80 p-1">
          <TabsTrigger value="general" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="hours" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="calendar" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Calendar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-5">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-6">
            <AgentConfigForm />
          </div>
        </TabsContent>

        <TabsContent value="hours" className="mt-5">
          <div className="rounded-2xl bg-white border border-gray-100 shadow-card p-6">
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
