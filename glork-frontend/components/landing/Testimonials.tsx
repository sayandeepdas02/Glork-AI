"use client"

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

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-[#F9F9F7] border-t border-[#E5E5E0]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-24">

        {/* Header */}
        <div className="mb-14">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#E5E5E0] bg-[#F5E040]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F0F0F]">
            Testimonials
          </span>
          <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] font-normal tracking-tight text-[#0F0F0F] mt-5">
            Loved by doctors
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="flex flex-col p-7 rounded-2xl bg-white border border-[#E5E5E0] hover:border-[#C8C8C2] hover:shadow-card-hover transition-all duration-200"
            >
              {/* Outcome tag */}
              <div className="inline-flex self-start items-center px-3 py-1 rounded-full bg-[#F5E040] text-[11px] font-semibold text-[#0F0F0F] mb-5">
                {t.outcome}
              </div>

              <blockquote className="text-[14.5px] text-[#4A4A4A] leading-[1.75] flex-1 mb-7">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-5 border-t border-[#E5E5E0]">
                <div className="h-9 w-9 shrink-0 rounded-full bg-[#0F0F0F] flex items-center justify-center text-[11px] font-bold text-white">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F0F0F] tracking-tight">{t.name}</p>
                  <p className="text-[12px] text-[#9B9B9B] mt-0.5">{t.specialty}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
