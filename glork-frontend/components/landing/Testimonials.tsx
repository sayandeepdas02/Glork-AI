"use client"

import { Star } from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/ui/panel"

const testimonials = [
  {
    outcome: "Reduced missed calls by 85%",
    quote: "Glork has completely transformed how we handle calls. We used to miss 20-30% of calls during busy hours. Now? Zero missed calls and our booking rate is up significantly.",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist",
    clinicSize: "400 Patients / Month",
    location: "Bengaluru, IN",
    avatar: "PS",
  },
  {
    outcome: "Saved 18 hours weekly",
    quote: "The setup took me literally 4 minutes. I was skeptical, but the AI handles everything perfectly — even my patients who call in Tamil. Incredible product.",
    name: "Dr. Rajan Murugan",
    specialty: "Dental Surgeon",
    clinicSize: "250 Patients / Month",
    location: "Chennai, IN",
    avatar: "RM",
  },
  {
    outcome: "Cut reception costs by 60%",
    quote: "As a solo practitioner, I couldn't afford a full-time receptionist. Glork is like having a 24/7 front desk at a fraction of the cost. My patients love the instant booking.",
    name: "Dr. Ananya Bose",
    specialty: "Pediatrician",
    clinicSize: "Solo Practice",
    location: "Kolkata, IN",
    avatar: "AB",
  },
]

export default function Testimonials() {
  return (
    <Panel id="testimonials">
      <PanelHeader className="flex flex-col gap-1 items-start pt-12 pb-6 border-b border-edge">
        <span className="text-[13px] font-mono font-bold text-brand uppercase tracking-[0.3em] mb-2">
          Testimonials
        </span>
        <PanelTitle>
          Loved by doctors
          <PanelTitleSup>(03)</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 lg:p-10">
        {testimonials.map((t, i) => (
          <article
            key={t.name}
            className="flex flex-col p-8 lg:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all duration-300 relative overflow-hidden group"
          >
            {/* Subtle Top Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Author Top */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 shrink-0 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-[13px] font-mono font-bold text-brand uppercase shadow-[0_0_15px_rgba(255,107,0,0.1)]">
                {t.avatar}
              </div>
              <div>
                <p className="text-base font-semibold text-white">{t.name}</p>
                <p className="text-[12px] text-white/50 font-mono mt-0.5">{t.specialty}</p>
              </div>
            </div>

            {/* Outcome Highlight */}
            <div className="mb-5 inline-flex self-start">
              <span className="text-[12px] font-mono font-bold text-white uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-md border border-white/10">
                {t.outcome}
              </span>
            </div>

            {/* Quote */}
            <blockquote className="text-[15px] lg:text-[16px] text-white/80 leading-[1.7] flex-1 mb-8">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between pt-5 border-t border-white/[0.06]">
              <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">{t.clinicSize}</span>
              <span className="text-[11px] text-white/40 font-mono uppercase tracking-wider">{t.location}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
