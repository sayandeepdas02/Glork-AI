"use client"

import {
  Calendar, Clock, Globe, Phone, Shield, Sparkles, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Phone,
    size: "large",
    title: "24/7 Call Answering",
    description:
      "The AI picks up every call — after hours, weekends, public holidays. Never a busy signal, never voicemail. Your clinic is always open.",
    accent: "from-[#FF5500]/20 to-transparent",
    iconBg: "bg-[#FF5500]/15 text-[#FF7733] border-[#FF5500]/25",
  },
  {
    icon: Calendar,
    size: "large",
    title: "Smart Scheduling",
    description:
      "Checks your live Google Calendar availability and slots new bookings in real time. Zero double-booking, zero back-and-forth.",
    accent: "from-blue-500/15 to-transparent",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: Zap,
    size: "small",
    title: "Instant Confirmations",
    description:
      "SMS and email confirmations with calendar invites sent the moment a booking is made — automatically.",
    accent: "",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    icon: Shield,
    size: "small",
    title: "Emergency Handling",
    description:
      "Recognises urgent calls and transfers them directly to your emergency contact number.",
    accent: "",
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    icon: Globe,
    size: "small",
    title: "Multilingual",
    description:
      "English, Hindi, Tamil, and more. Patients speak in their preferred language.",
    accent: "",
    iconBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  {
    icon: Clock,
    size: "small",
    title: "Custom Hours",
    description:
      "Set your working hours per day. The AI only books within your schedule.",
    accent: "",
    iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
]

export default function Features() {
  const large  = features.filter(f => f.size === "large")
  const small  = features.filter(f => f.size === "small")

  return (
    <section id="features" className="bg-[#0C0A09] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section label + heading ── */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono font-semibold text-[#FF5500] uppercase tracking-[0.25em] mb-4">
            Features
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-white mb-5 tracking-tight">
            Everything your clinic needs
          </h2>
          <p className="text-lg text-[#8A8480] max-w-xl mx-auto leading-relaxed">
            Glork handles the entire receptionist workflow so your staff can focus on patients.
          </p>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Two large cards side-by-side */}
          {large.map((f) => (
            <div
              key={f.title}
              className={cn(
                "bento-card group relative rounded-2xl border border-white/6 bg-[#141210] p-7 overflow-hidden"
              )}
            >
              {/* Gradient glow in corner */}
              <div className={cn("absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] opacity-60", f.accent)} />

              <div className={cn("relative inline-flex h-12 w-12 items-center justify-center rounded-xl border mb-5", f.iconBg)}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 relative">{f.title}</h3>
              <p className="text-sm text-[#8A8480] leading-relaxed relative">{f.description}</p>
            </div>
          ))}

          {/* Four small cards in 2×2 */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {small.map((f) => (
              <div
                key={f.title}
                className="bento-card group rounded-2xl border border-white/6 bg-[#141210] p-6"
              >
                <div className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl border mb-4", f.iconBg)}>
                  <f.icon className="h-4 w-4" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-xs text-[#8A8480] leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
