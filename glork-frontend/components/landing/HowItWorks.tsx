"use client"

import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel"

const steps = [
  {
    n: "01",
    title: "Set up in 3 minutes",
    description: "Create your account, connect Google Calendar, and configure your greeting. No technical knowledge needed — if you can send an email, you can set up Hyperglork.",
    detail: "Avg. setup: 2 min 47 sec",
  },
  {
    n: "02",
    title: "Forward your clinic number",
    description: "Forward your existing clinic phone to your unique Hyperglork number. Patients call the same number they always have — nothing changes for them.",
    detail: "Works with any phone provider",
  },
  {
    n: "03",
    title: "Sit back and relax",
    description: "The AI handles all incoming calls. View bookings, call logs, and full transcripts on your dashboard in real time.",
    detail: "Live dashboard + notifications",
  },
]

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#E0E0DB] bg-[#FAFAF8] text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#888]">
      {text}
    </span>
  )
}

export default function HowItWorks() {
  return (
    <Panel id="how-it-works" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <SectionLabel text="How it works" />
        <PanelTitle className="mt-4">Up and running in minutes</PanelTitle>
        <p className="mt-3 text-[14px] text-[#888] max-w-sm leading-relaxed">
          Three simple steps to your AI receptionist.
        </p>
      </PanelHeader>

      <div>
        {steps.map((step, idx) => (
          <div
            key={step.n}
            className={[
              "flex flex-col md:flex-row md:items-start gap-5 md:gap-10 px-8 lg:px-14 py-9 hover:bg-[#FAFAF8] transition-colors duration-150 group",
              idx < steps.length - 1 ? "border-b border-[#EAEAE5]" : "",
            ].join(" ")}
          >
            <span className="text-[2.5rem] font-light text-[#DEDED9] leading-none select-none shrink-0 w-12 tabular-nums group-hover:text-[#C8C8C3] transition-colors">
              {step.n}
            </span>

            <div className="flex-1">
              <h3 className="text-[17px] text-[#111] font-medium mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#777] leading-[1.68] max-w-xl mb-4">
                {step.description}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#999]">
                <span className="text-[#0A0A0A]">→</span> {step.detail}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
