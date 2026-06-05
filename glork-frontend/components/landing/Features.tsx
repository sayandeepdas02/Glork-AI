"use client"

import {
  Calendar, Clock, Globe, Phone, Shield, Zap,
} from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup, PanelContent } from "@/components/ui/panel"

export default function Features() {
  return (
    <Panel id="features">
      <PanelHeader className="flex flex-col gap-1 items-start pt-14 pb-8 border-b border-[#EAEAE5]">
        <span className="text-[12px] text-[#888] uppercase tracking-[0.25em] mb-2">
          Features
        </span>
        <PanelTitle>
          Everything your clinic needs
          <PanelTitleSup>(06)</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Large Featured Card */}
          <article className="md:col-span-2 md:row-span-2 min-h-[400px] flex flex-col justify-between p-8 lg:p-10 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] transition-all duration-300 relative overflow-hidden group">
            <div className="max-w-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand/15 bg-brand/6 mb-6">
                <Phone className="h-5 w-5 text-brand" />
              </div>
              <h3 className="text-[22px] text-[#111] mb-3">24/7 AI Receptionist</h3>
              <p className="text-[14px] text-[#666] leading-relaxed">
                The AI picks up every call — after hours, weekends, public holidays. Never a busy signal, never voicemail. Your clinic is always open.
              </p>
            </div>

            <div className="mt-8 p-4 rounded-xl border border-[#E0E0DB] bg-white self-start w-full max-w-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] text-[#888] uppercase tracking-wider">Live Status</span>
                </div>
                <span className="text-[11px] text-brand">Handling 3 calls</span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 w-full bg-[#F0F0EC] rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[85%] rounded-full" />
                </div>
                <div className="flex justify-between text-[10px] text-[#bbb]">
                  <span>Coverage</span>
                  <span>100% uptime</span>
                </div>
              </div>
            </div>
          </article>

          {/* Medium Card 1 */}
          <article className="flex flex-col p-6 lg:p-7 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300">
            <Calendar className="h-5 w-5 text-[#888] mb-4" />
            <h3 className="text-[16px] text-[#111] mb-2">Smart Scheduling</h3>
            <p className="text-[13px] text-[#666] leading-relaxed">
              Checks live Calendar availability and slots new bookings instantly. Zero double-booking.
            </p>
          </article>

          {/* Medium Card 2 */}
          <article className="flex flex-col p-6 lg:p-7 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300">
            <Zap className="h-5 w-5 text-[#888] mb-4" />
            <h3 className="text-[16px] text-[#111] mb-2">Instant Confirmations</h3>
            <p className="text-[13px] text-[#666] leading-relaxed">
              SMS and email confirmations sent automatically the moment a booking is made.
            </p>
          </article>

          {/* Small Card 1 */}
          <article className="flex items-start gap-4 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300">
            <Globe className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] text-[#111] mb-1">Multilingual</h3>
              <p className="text-[12px] text-[#888]">English, Hindi, Tamil & more.</p>
            </div>
          </article>

          {/* Small Card 2 */}
          <article className="flex items-start gap-4 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300">
            <Shield className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] text-[#111] mb-1">Emergency Handling</h3>
              <p className="text-[12px] text-[#888]">Routes urgent calls instantly.</p>
            </div>
          </article>

          {/* Small Card 3 */}
          <article className="flex items-start gap-4 p-6 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300">
            <Clock className="h-4 w-4 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[14px] text-[#111] mb-1">Custom Hours</h3>
              <p className="text-[12px] text-[#888]">Books strictly within your schedule.</p>
            </div>
          </article>

        </div>
      </PanelContent>
    </Panel>
  )
}
