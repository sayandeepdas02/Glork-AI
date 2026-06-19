import type { Metadata } from "next"
import { AgentToggle }          from "@/components/agent/agent-toggle"
import { PhoneNumberDisplay }   from "@/components/agent/phone-number-display"
import { PageHeader }           from "@/components/layout/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentConfigForm }      from "@/components/agent/agent-config-form"
import { WorkingHoursEditor }   from "@/components/agent/working-hours-editor"
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
        {/* Left */}
        <div className="space-y-4">
          <div className="surface-card p-5">
            <p className="section-label mb-3">Live state</p>
            <AgentToggle />
          </div>
          <div className="surface-card p-5">
            <p className="section-label mb-3">Reception number</p>
            <PhoneNumberDisplay />
          </div>
        </div>

        {/* Right */}
        <div className="surface-card p-5">
          <Tabs defaultValue="general">
            <TabsList className="w-full grid grid-cols-3 rounded-lg bg-[#F3F4F6] p-0.5 h-9">
              <TabsTrigger
                value="general"
                className="rounded-md text-[12px] font-normal text-[#6B7280] data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:font-medium data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              >General</TabsTrigger>
              <TabsTrigger
                value="hours"
                className="rounded-md text-[12px] font-normal text-[#6B7280] data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:font-medium data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              >Schedule</TabsTrigger>
              <TabsTrigger
                value="calendar"
                className="rounded-md text-[12px] font-normal text-[#6B7280] data-[state=active]:bg-white data-[state=active]:text-[#111111] data-[state=active]:font-medium data-[state=active]:shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
              >Calendar</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="mt-5">
              <div className="rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-5">
                <AgentConfigForm />
              </div>
            </TabsContent>
            <TabsContent value="hours" className="mt-5">
              <div className="rounded-lg border border-[#EEEEEE] bg-[#FAFAFA] p-5">
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
