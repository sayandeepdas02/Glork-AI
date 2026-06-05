"use client"

import { Calendar, Clock, Globe, Phone, Shield, Zap } from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel"

export default function Features() {
  return (
    <Panel id="features" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-3">Features</p>
        <PanelTitle>Everything your clinic needs</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Large featured card — 2 cols, 2 rows */}
          <article className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-7 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200 group">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/8 mb-4">
                <Phone className="h-4 w-4 text-brand" />
              </div>
              <h3 className="text-[17px] text-[#111] mb-2">24/7 AI Receptionist</h3>
              <p className="text-[13.5px] text-[#777] leading-relaxed max-w-sm">
                The AI picks up every call — after hours, weekends, public holidays.
                Never a busy signal, never voicemail. Your clinic is always open.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-lg border border-[#E0E0DB] bg-white">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[11px] text-[#999] uppercase tracking-wider">Live</span>
                </div>
                <span className="text-[11px] text-brand">3 active calls</span>
              </div>
              <div className="space-y-2">
                {["Dr. Sharma — slot 9:00 AM", "Dr. Sharma — slot 10:30 AM", "Routing emergency..."].map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 2 ? "bg-amber-400" : "bg-brand/40"}`} />
                    <span className="text-[11.5px] text-[#888] truncate">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Medium cards */}
          <article className="flex flex-col p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
            <Calendar className="h-4 w-4 text-[#aaa] mb-4 shrink-0" />
            <h3 className="text-[15px] text-[#111] mb-1.5">Smart Scheduling</h3>
            <p className="text-[13px] text-[#888] leading-relaxed">
              Checks live Calendar availability and books instantly. Zero double-booking.
            </p>
          </article>

          <article className="flex flex-col p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
            <Zap className="h-4 w-4 text-[#aaa] mb-4 shrink-0" />
            <h3 className="text-[15px] text-[#111] mb-1.5">Instant Confirmations</h3>
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
            <article key={title} className="flex items-start gap-3 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/8 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-brand" />
              </div>
              <div>
                <h3 className="text-[14px] text-[#111] mb-1">{title}</h3>
                <p className="text-[12.5px] text-[#999] leading-relaxed">{desc}</p>
              </div>
            </article>
          ))}

        </div>
      </PanelContent>
    </Panel>
  )
}
