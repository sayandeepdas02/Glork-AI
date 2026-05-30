"use client"

import { Star } from "lucide-react"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/ui/panel"

const testimonials = [
  {
    quote: "Glork has completely transformed how we handle calls. We used to miss 20-30% of calls during busy hours. Now? Zero missed calls and our booking rate is up 40%.",
    name: "Dr. Priya Sharma",
    clinic: "Sharma Family Clinic, Bengaluru",
    avatar: "PS",
  },
  {
    quote: "The setup took me literally 4 minutes. I was skeptical, but the AI handles everything perfectly — even my patients who call in Tamil. Incredible product.",
    name: "Dr. Rajan Murugan",
    clinic: "SmileCare Dental, Chennai",
    avatar: "RM",
  },
  {
    quote: "As a solo practitioner, I couldn't afford a full-time receptionist. Glork is like having a 24/7 receptionist at a fraction of the cost. My patients love it.",
    name: "Dr. Ananya Bose",
    clinic: "Little Stars Pediatrics, Kolkata",
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {testimonials.map((t, i) => (
          <article
            key={t.name}
            className="flex flex-col p-8 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all duration-200"
          >
            {/* Stars */}
            <div className="flex items-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 text-brand fill-brand" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-[15px] text-white/95 leading-[1.7] flex-1 mb-8">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 pt-5 border-t border-edge">
              <div className="h-10 w-10 shrink-0 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-mono font-bold text-white uppercase">
                {t.avatar}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-[11px] text-white/60 font-mono mt-0.5">{t.clinic}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
