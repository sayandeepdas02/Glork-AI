"use client"

import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel"

const testimonials = [
  {
    outcome: "Reduced missed calls by 85%",
    quote: "Hyperglork has completely transformed how we handle calls. We used to miss 20–30% of calls during busy hours. Now? Zero missed calls and our booking rate is up significantly.",
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
    quote: "As a solo practitioner, I couldn't afford a full-time receptionist. Hyperglork is like having a 24/7 front desk at a fraction of the cost.",
    name: "Dr. Ananya Bose",
    specialty: "Pediatrician · Kolkata",
    avatar: "AB",
  },
]

function SectionLabel({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#E0E0DB] bg-[#FAFAF8] text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#888]">
      {text}
    </span>
  )
}

export default function Testimonials() {
  return (
    <Panel id="testimonials" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <SectionLabel text="Testimonials" />
        <PanelTitle className="mt-4">Loved by doctors across India</PanelTitle>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col p-6 rounded-2xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA] hover:bg-white transition-all duration-200"
            >
              <p className="text-[10.5px] text-[#888] uppercase tracking-[0.18em] font-semibold mb-4">
                {t.outcome}
              </p>

              <blockquote className="text-[14px] text-[#444] leading-[1.72] flex-1 mb-6">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAE5]">
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#0A0A0A] flex items-center justify-center text-[11px] font-bold text-[#F5E542]">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#111]">{t.name}</p>
                  <p className="text-[11.5px] text-[#aaa] mt-0.5">{t.specialty}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </PanelContent>
    </Panel>
  )
}
