"use client"

import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/ui/panel"

const steps = [
  {
    n: "01",
    title: "Set up in 3 minutes",
    description: "Create your account, connect Google Calendar, and configure your greeting. No technical knowledge needed — if you can send an email, you can set up Glork.",
    detail: "Average setup: 2 min 47 sec",
  },
  {
    n: "02",
    title: "Forward your clinic number",
    description: "Forward your existing clinic phone to your unique Glork number. Patients call the same number they always have — nothing changes for them.",
    detail: "Works with any phone provider",
  },
  {
    n: "03",
    title: "Sit back and relax",
    description: "The AI handles all incoming calls. View bookings, call logs, and full transcripts on your dashboard in real time.",
    detail: "Live dashboard + notifications",
  },
]

export default function HowItWorks() {
  return (
    <Panel id="how-it-works">
      <PanelHeader className="flex flex-col gap-1 items-start pt-14 pb-8 border-b border-[#EAEAE5]">
        <span className="text-[12px] text-[#888] uppercase tracking-[0.25em] mb-2">
          How it works
        </span>
        <PanelTitle>
          Up and running in minutes
          <PanelTitleSup>(03)</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="flex flex-col">
        {steps.map((step, idx) => (
          <div
            key={step.n}
            className={[
              "group flex flex-col md:flex-row md:items-start gap-4 md:gap-10 px-6 lg:px-12 py-10 transition-colors duration-200 hover:bg-[#FAFAF8]",
              idx < steps.length - 1 ? "border-b border-[#EAEAE5]" : "",
            ].join(" ")}
          >
            <div className="md:w-20 shrink-0">
              <span className="text-5xl md:text-6xl text-[#E0E0DB] group-hover:text-[#D0D0CA] transition-colors duration-300 tracking-tighter leading-none select-none">
                {step.n}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-[20px] text-[#111] mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#666] leading-relaxed max-w-2xl mb-5">
                {step.description}
              </p>
              <div className="self-start">
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] text-[#888] uppercase tracking-wider border border-[#E0E0DB] bg-[#F8F8F5] rounded">
                  {step.detail}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
