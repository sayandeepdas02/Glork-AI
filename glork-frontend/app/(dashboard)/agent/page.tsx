import type { Metadata } from "next"
import { AgentToggle } from "@/components/agent/agent-toggle"
import { PhoneNumberDisplay } from "@/components/agent/phone-number-display"
import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentConfigForm } from "@/components/agent/agent-config-form"
import { WorkingHoursEditor } from "@/components/agent/working-hours-editor"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"

export const metadata: Metadata = { title: "Agent Config · Hyperglork" }

export default function AgentPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Agent config"
        description="Set the receptionist's behavior, business hours, and calendar access."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Left: status + phone */}
        <div className="space-y-5">
          <div className="surface-card p-5">
            <p className="section-label mb-4">Live state</p>
            <AgentToggle />
          </div>
          <div className="surface-card p-5">
            <p className="section-label mb-3">Reception number</p>
            <PhoneNumberDisplay />
          </div>
        </div>

        {/* Right: config tabs */}
        <div className="surface-card p-5">
          <Tabs defaultValue="general">
            <TabsList className="w-full grid grid-cols-3 rounded-lg bg-off-white p-0.5 h-9">
              <TabsTrigger
                value="general"
                className="rounded-md text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-ink data-[state=inactive]:text-ink-4"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="hours"
                className="rounded-md text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-ink data-[state=inactive]:text-ink-4"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="rounded-md text-[13px] font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-ink data-[state=inactive]:text-ink-4"
              >
                Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-5">
              <div className="rounded-xl border border-gray-100 bg-off-white p-5">
                <AgentConfigForm />
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-5">
              <div className="rounded-xl border border-gray-100 bg-off-white p-5">
                <WorkingHoursEditor />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-5">
              <GoogleCalendarConnect />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
