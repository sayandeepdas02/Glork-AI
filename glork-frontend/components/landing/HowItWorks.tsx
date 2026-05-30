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
      <PanelHeader className="flex flex-col gap-1 items-start pt-12 pb-6 border-b border-edge">
        <span className="text-[13px] font-mono font-bold text-brand uppercase tracking-[0.3em] mb-2">
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
              "group flex flex-col md:flex-row md:items-start gap-4 md:gap-8 p-6 md:p-8 transition-colors duration-200 hover:bg-white/[0.03]",
              idx < steps.length - 1 ? "border-b border-edge" : "",
            ].join(" ")}
          >
            {/* Huge Number */}
            <div className="md:w-32 shrink-0">
              <span className="text-6xl md:text-7xl font-serif italic text-white/40 group-hover:text-brand/40 transition-colors duration-300 tracking-tighter leading-none select-none">
                {step.n}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-[22px] font-semibold text-white/95 mb-2">{step.title}</h3>
              <p className="text-[15px] text-white/80 leading-relaxed max-w-2xl mb-5">
                {step.description}
              </p>
              
              <div className="self-start">
                <span className="inline-flex items-center px-2.5 py-1 text-[11px] font-mono font-medium text-white/80 uppercase tracking-widest border border-white/20 bg-white/10 rounded">
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
