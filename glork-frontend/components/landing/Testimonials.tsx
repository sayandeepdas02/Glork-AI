"use client"

import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel"

const testimonials = [
  {
    outcome: "Reduced missed calls by 85%",
    quote: "Glork has completely transformed how we handle calls. We used to miss 20–30% of calls during busy hours. Now? Zero missed calls and our booking rate is up significantly.",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist · Bengaluru",
    avatar: "PS",
  },
  {
    outcome: "Saved 18 hours every week",
    quote: "The setup took me literally 4 minutes. I was skeptical, but the AI handles everything perfectly — even my patients who call in Tamil. Incredible product.",
    name: "Dr. Rajan Murugan",
    specialty: "Dental Surgeon · Chennai",
    avatar: "RM",
  },
  {
    outcome: "Cut reception costs by 60%",
    quote: "As a solo practitioner, I couldn't afford a full-time receptionist. Glork is like having a 24/7 front desk at a fraction of the cost.",
    name: "Dr. Ananya Bose",
    specialty: "Pediatrician · Kolkata",
    avatar: "AB",
  },
]

export default function Testimonials() {
  return (
    <Panel id="testimonials" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-3">Testimonials</p>
        <PanelTitle>Loved by doctors</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col p-7 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] transition-colors duration-200"
            >
              <p className="text-[11.5px] text-[#aaa] mb-5">{t.outcome}</p>

              <blockquote className="text-[14.5px] text-[#444] leading-[1.7] flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-[#EAEAE5]">
                <div className="h-8 w-8 shrink-0 rounded-full bg-[#F0F0EC] border border-[#E0E0DB] flex items-center justify-center text-[11px] text-[#888]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] text-[#222]">{t.name}</p>
                  <p className="text-[11.5px] text-[#aaa]">{t.specialty}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PanelContent>
    </Panel>
  )
}
