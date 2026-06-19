import type { Metadata } from "next"
import { AgentToggle } from "@/components/agent/agent-toggle"
import { PhoneNumberDisplay } from "@/components/agent/phone-number-display"
import { PageHeader } from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentConfigForm } from "@/components/agent/agent-config-form"
import { WorkingHoursEditor } from "@/components/agent/working-hours-editor"
import { GoogleCalendarConnect } from "@/components/calendar/google-calendar-connect"

export const metadata: Metadata = { title: "AI Agent · Hyperglork" }

export default function AgentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent"
        description="Set the receptionist’s behavior, business hours, and calendar access without losing sight of how it performs in the wild."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="surface-card p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">Live state</p>
          <div className="mt-4">
            <AgentToggle />
          </div>
          <div className="mt-6 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-5">Reception number</p>
            <PhoneNumberDisplay />
          </div>
        </div>

        <div className="surface-card p-6">
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3 rounded-full bg-[#eff4fb] p-1">
              <TabsTrigger value="general" className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                General
              </TabsTrigger>
              <TabsTrigger value="hours" className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Schedule
              </TabsTrigger>
              <TabsTrigger value="calendar" className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                Calendar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-6">
              <div className="rounded-[28px] border border-[#e4ecf6] bg-[#f9fbff] p-6">
                <AgentConfigForm />
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <div className="rounded-[28px] border border-[#e4ecf6] bg-[#f9fbff] p-6">
                <WorkingHoursEditor />
              </div>
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <GoogleCalendarConnect />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
