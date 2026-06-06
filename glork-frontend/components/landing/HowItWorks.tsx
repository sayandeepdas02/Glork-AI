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

export default function HowItWorks() {
  return (
    <Panel id="how-it-works" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-3">How it works</p>
        <PanelTitle>Up and running in minutes</PanelTitle>
      </PanelHeader>

      <div>
        {steps.map((step, idx) => (
          <div
            key={step.n}
            className={[
              "flex flex-col md:flex-row md:items-start gap-5 md:gap-8 px-8 lg:px-14 py-8 hover:bg-[#FAFAF8] transition-colors duration-150",
              idx < steps.length - 1 ? "border-b border-[#EAEAE5]" : "",
            ].join(" ")}
          >
            <span className="text-[1.875rem] font-light text-[#D8D8D3] leading-none select-none shrink-0 w-10 tabular-nums">
              {step.n}
            </span>

            <div className="flex-1">
              <h3 className="text-[17px] text-[#111] mb-2">{step.title}</h3>
              <p className="text-[14px] text-[#777] leading-[1.65] max-w-xl mb-4">
                {step.description}
              </p>
              <span className="text-[12px] text-[#aaa]">→ {step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
