"use client"

import { Calendar, Clock, Globe, Phone, Shield, Zap } from "lucide-react"

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#E5E5E0] bg-[#F5E040]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F0F0F]">
      {text}
    </span>
  )
}

export default function Features() {
  return (
    <section id="features" className="bg-white border-t border-[#E5E5E0]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14">

        {/* Header */}
        <div className="pt-20 pb-14">
          <SectionLabel text="Features" />
          <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] font-normal tracking-tight text-[#0F0F0F] mt-5">
            Everything your clinic needs
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-20">

          {/* Large featured card — black bg */}
          <article className="md:col-span-2 md:row-span-2 flex flex-col justify-between p-8 rounded-2xl bg-[#0F0F0F] border border-[#1A1A1A]">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5E040] mb-5">
                <Phone className="h-4.5 w-4.5 text-[#0F0F0F]" />
              </div>
              <h3 className="text-[19px] font-semibold text-white mb-3 tracking-tight">24/7 AI Receptionist</h3>
              <p className="text-[14px] text-white/50 leading-relaxed max-w-sm">
                The AI picks up every call — after hours, weekends, public holidays.
                Never a busy signal, never voicemail. Your clinic is always open.
              </p>
            </div>

            {/* Live preview widget */}
            <div className="mt-8 p-5 rounded-xl border border-white/8 bg-white/4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F5E040] animate-pulse" />
                  <span className="text-[11px] text-white/40 uppercase tracking-wider font-medium">Live</span>
                </div>
                <span className="text-[11px] text-[#F5E040] font-medium">3 active calls</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { text: "Dr. Sharma — slot 9:00 AM confirmed", active: true },
                  { text: "Dr. Sharma — slot 10:30 AM booking…", active: true },
                  { text: "Routing emergency to Dr. Bose", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.active ? "bg-[#F5E040]/60" : "bg-amber-400"}`} />
                    <span className="text-[12px] text-white/50 font-mono truncate">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Medium card: Smart Scheduling */}
          <article className="flex flex-col p-6 rounded-2xl bg-[#F9F9F7] border border-[#E5E5E0] hover:border-[#C8C8C2] hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5E040]/15 mb-4">
              <Calendar className="h-4 w-4 text-[#0F0F0F]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#0F0F0F] mb-2 tracking-tight">Smart Scheduling</h3>
            <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
              Checks live Calendar availability and books instantly. Zero double-booking.
            </p>
          </article>

          {/* Medium card: Confirmations */}
          <article className="flex flex-col p-6 rounded-2xl bg-[#F9F9F7] border border-[#E5E5E0] hover:border-[#C8C8C2] hover:-translate-y-0.5 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5E040]/15 mb-4">
              <Zap className="h-4 w-4 text-[#0F0F0F]" />
            </div>
            <h3 className="text-[15px] font-semibold text-[#0F0F0F] mb-2 tracking-tight">Instant Confirmations</h3>
            <p className="text-[13px] text-[#6B6B6B] leading-relaxed">
              SMS and email confirmations sent the moment a booking is made.
            </p>
          </article>

          {/* Small inline cards */}
          {[
            { Icon: Globe,  title: "Multilingual",       desc: "English, Hindi, Tamil & more." },
            { Icon: Shield, title: "Emergency Handling", desc: "Routes urgent calls instantly." },
            { Icon: Clock,  title: "Custom Hours",       desc: "Books within your schedule only." },
          ].map(({ Icon, title, desc }) => (
            <article key={title} className="flex items-start gap-3.5 p-6 rounded-2xl bg-[#F9F9F7] border border-[#E5E5E0] hover:border-[#C8C8C2] hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F5E040]/15 mt-0.5">
                <Icon className="h-3.5 w-3.5 text-[#0F0F0F]" />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-[#0F0F0F] mb-1 tracking-tight">{title}</h3>
                <p className="text-[12.5px] text-[#9B9B9B] leading-relaxed">{desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
