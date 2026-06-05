"use client"

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
      <PanelHeader className="flex flex-col gap-1 items-start pt-14 pb-8 border-b border-[#EAEAE5]">
        <span className="text-[12px] text-[#888] uppercase tracking-[0.25em] mb-2">
          Testimonials
        </span>
        <PanelTitle>
          Loved by doctors
          <PanelTitleSup>(03)</PanelTitleSup>
        </PanelTitle>
      </PanelHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 lg:p-10">
        {testimonials.map((t) => (
          <article
            key={t.name}
            className="flex flex-col p-7 lg:p-8 rounded-xl bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3] hover:shadow-card transition-all duration-300"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-10 w-10 shrink-0 rounded-full bg-brand/8 border border-brand/15 flex items-center justify-center text-[12px] text-brand">
                {t.avatar}
              </div>
              <div>
                <p className="text-[14px] text-[#111]">{t.name}</p>
                <p className="text-[12px] text-[#aaa] mt-0.5">{t.specialty}</p>
              </div>
            </div>

            <div className="mb-4 inline-flex self-start">
              <span className="text-[11px] text-[#555] uppercase tracking-wider bg-[#F0F0EC] px-2.5 py-1 rounded border border-[#E0E0DB]">
                {t.outcome}
              </span>
            </div>

            <blockquote className="text-[14px] lg:text-[15px] text-[#555] leading-[1.7] flex-1 mb-6">
              &ldquo;{t.quote}&rdquo;
            </blockquote>

            <div className="flex items-center justify-between pt-4 border-t border-[#EAEAE5]">
              <span className="text-[11px] text-[#bbb] uppercase tracking-wider">{t.clinicSize}</span>
              <span className="text-[11px] text-[#bbb] uppercase tracking-wider">{t.location}</span>
            </div>
          </article>
        ))}
      </div>
    </Panel>
  )
}
