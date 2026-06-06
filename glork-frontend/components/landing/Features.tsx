"use client"

import { Calendar, Clock, Globe, Phone, Shield, Zap } from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel"

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#E0E0DB] bg-[#FAFAF8] text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#888]">
      {text}
    </span>
  )
}

export default function Features() {
  return (
    <Panel id="features" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <SectionLabel text="Features" />
        <PanelTitle className="mt-4">Everything your clinic needs</PanelTitle>
        <p className="mt-3 text-[14px] text-[#888] max-w-sm leading-relaxed">
          One AI that handles every incoming call — after hours, weekends, public holidays.
        </p>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Large featured card — 2 cols, 2 rows */}
          <article className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-7 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors duration-200 group">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E542]/10 border border-[#F5E542]/20 mb-5">
                <Phone className="h-4.5 w-4.5 text-[#F5E542]" />
              </div>
              <h3 className="text-[18px] text-white font-medium mb-2.5">24/7 AI Receptionist</h3>
              <p className="text-[13.5px] text-white/55 leading-relaxed max-w-sm">
                The AI picks up every call — after hours, weekends, public holidays.
                Never a busy signal, never voicemail. Your clinic is always open.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5E542]" />
                  <span className="text-[10.5px] text-white/40 uppercase tracking-wider font-mono">Live</span>
                </div>
                <span className="text-[11px] text-[#F5E542]/80">3 active calls</span>
              </div>
              <div className="space-y-2">
                {["Dr. Sharma — slot 9:00 AM booked", "Dr. Sharma — slot 10:30 AM booked", "Routing emergency call…"].map((line, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 2 ? "bg-amber-400" : "bg-[#F5E542]/50"}`} />
                    <span className="text-[11.5px] text-white/50 truncate font-mono">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Medium cards */}
          <article className="flex flex-col p-6 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A0A0A]/6 mb-4">
              <Calendar className="h-4 w-4 text-[#0A0A0A]" />
            </div>
            <h3 className="text-[15px] text-[#111] font-medium mb-1.5">Smart Scheduling</h3>
            <p className="text-[13px] text-[#888] leading-relaxed">
              Checks live Calendar availability and books instantly. Zero double-booking.
            </p>
          </article>

          <article className="flex flex-col p-6 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0A0A0A]/6 mb-4">
              <Zap className="h-4 w-4 text-[#0A0A0A]" />
            </div>
            <h3 className="text-[15px] text-[#111] font-medium mb-1.5">Instant Confirmations</h3>
            <p className="text-[13px] text-[#888] leading-relaxed">
              SMS and email confirmations sent the moment a booking is made.
            </p>
          </article>

          {/* Small inline cards */}
          {[
            { Icon: Globe,  title: "Multilingual",       desc: "English, Hindi, Tamil & more." },
            { Icon: Shield, title: "Emergency Handling", desc: "Routes urgent calls instantly." },
            { Icon: Clock,  title: "Custom Hours",       desc: "Books within your schedule only." },
          ].map(({ Icon, title, desc }) => (
            <article key={title} className="flex items-start gap-3 p-6 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#0A0A0A]/6 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-[#0A0A0A]" />
              </div>
              <div>
                <h3 className="text-[14px] text-[#111] font-medium mb-1">{title}</h3>
                <p className="text-[12.5px] text-[#999] leading-relaxed">{desc}</p>
              </div>
            </article>
          ))}

        </div>
      </PanelContent>
    </Panel>
  )
}
