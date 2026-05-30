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

      {/* Grid container with gap and visible cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {features.map((f, i) => (
          <article
            key={f.title}
            className="flex flex-col p-6 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-brand/30 hover:bg-white/[0.03] transition-all duration-200 group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded border border-edge bg-white/5 mb-6 group-hover:border-white/10 group-hover:bg-white/10 transition-colors">
              <f.icon className="h-4 w-4 text-white" />
            </div>
            
            <h3 className="text-[15px] font-semibold leading-snug text-white mb-2">
              {f.title}
            </h3>
            
            <p className="text-[13px] text-white/75 leading-relaxed">
              {f.description}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  )
}
