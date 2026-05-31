"use client"

import {
  Calendar, Clock, Globe, Phone, Shield, Sparkles, Zap,
} from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup, PanelContent } from "@/components/ui/panel"

const features = [
  {
    icon: Phone,
    title: "24/7 Call Answering",
    description: "The AI picks up every call — after hours, weekends, public holidays. Never a busy signal, never voicemail. Your clinic is always open.",
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Checks your live Google Calendar availability and slots new bookings in real time. Zero double-booking, zero back-and-forth.",
  },
  {
    icon: Zap,
    title: "Instant Confirmations",
    description: "SMS and email confirmations with calendar invites sent the moment a booking is made — automatically.",
  },
  {
    icon: Shield,
    title: "Emergency Handling",
    description: "Recognises urgent calls and transfers them directly to your emergency contact number.",
  },
  {
    icon: Globe,
    title: "Multilingual",
    description: "English, Hindi, Tamil, and more. Patients speak in their preferred language.",
  },
  {
    icon: Clock,
    title: "Custom Hours",
    description: "Set your working hours per day. The AI only books within your schedule.",
  },
]

export default function Features() {
  return (
    <Panel id="features">
      <PanelHeader className="flex flex-col gap-1 items-start pt-12 pb-6 border-b border-edge">
        <span className="text-[13px] font-mono font-bold text-brand uppercase tracking-[0.3em] mb-2">
          Features
        </span>
        <PanelTitle>
          Everything your clinic needs
          <PanelTitleSup>(06)</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      {/* Bento Grid */}
      <div className="p-6 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[220px]">
          
          {/* Large Featured Card (2 cols, 2 rows) */}
          <article className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] relative overflow-hidden group">
            {/* Visual background glow */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/20 blur-[100px] rounded-full pointer-events-none group-hover:bg-brand/30 transition-colors duration-700" />
            
            <div className="relative z-10 max-w-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand/10 mb-6">
                <Phone className="h-6 w-6 text-brand" />
              </div>
              <h3 className="text-2xl font-serif text-white mb-3">24/7 AI Receptionist</h3>
              <p className="text-[15px] text-white/70 leading-relaxed">
                The AI picks up every call — after hours, weekends, public holidays. Never a busy signal, never voicemail. Your clinic is always open.
              </p>
            </div>

            {/* Faux UI element inside the card */}
            <div className="relative z-10 mt-10 p-5 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm self-start w-full max-w-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[11px] font-mono text-white/60 uppercase tracking-widest">Live Status</span>
                </div>
                <span className="text-[11px] font-mono text-brand">Handling 3 calls</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-brand w-[85%]" />
                </div>
                <div className="flex justify-between text-[10px] text-white/40 font-mono">
                  <span>Coverage</span>
                  <span>100% uptime</span>
                </div>
              </div>
            </div>
          </article>

          {/* Medium Card 1 */}
          <article className="md:col-span-1 md:row-span-1 flex flex-col p-6 lg:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
            <Calendar className="h-6 w-6 text-white mb-5 opacity-80" />
            <h3 className="text-lg font-semibold text-white mb-2">Smart Scheduling</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              Checks live Calendar availability and slots new bookings instantly. Zero double-booking.
            </p>
          </article>

          {/* Medium Card 2 */}
          <article className="md:col-span-1 md:row-span-1 flex flex-col p-6 lg:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
            <Zap className="h-6 w-6 text-white mb-5 opacity-80" />
            <h3 className="text-lg font-semibold text-white mb-2">Instant Confirmations</h3>
            <p className="text-[14px] text-white/60 leading-relaxed">
              SMS and email confirmations sent automatically the moment a booking is made.
            </p>
          </article>

          {/* Small Card 1 */}
          <article className="md:col-span-1 flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
            <Globe className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-1">Multilingual</h3>
              <p className="text-[13px] text-white/60">English, Hindi, Tamil & more.</p>
            </div>
          </article>

          {/* Small Card 2 */}
          <article className="md:col-span-1 flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
            <Shield className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-1">Emergency Handling</h3>
              <p className="text-[13px] text-white/60">Routes urgent calls instantly.</p>
            </div>
          </article>

          {/* Small Card 3 */}
          <article className="md:col-span-1 flex items-start gap-4 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300">
            <Clock className="h-5 w-5 text-brand shrink-0 mt-0.5" />
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-1">Custom Hours</h3>
              <p className="text-[13px] text-white/60">Books strictly within your schedule.</p>
            </div>
          </article>

        </div>
      </div>
    </Panel>
  )
}
