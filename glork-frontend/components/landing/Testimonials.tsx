"use client"

import { Star } from "lucide-react"

const testimonials = [
  {
    quote:
      "Glork has completely transformed how we handle calls. We used to miss 20-30% of calls during busy hours. Now? Zero missed calls and our booking rate is up 40%.",
    name: "Dr. Priya Sharma",
    role: "General Practitioner",
    clinic: "Sharma Family Clinic, Bengaluru",
    avatar: "PS",
    avatarColor: "bg-violet-500/20 text-violet-300",
    stars: 5,
  },
  {
    quote:
      "The setup took me literally 4 minutes. I was skeptical, but the AI handles everything perfectly — even my patients who call in Tamil. Incredible product.",
    name: "Dr. Rajan Murugan",
    role: "Dentist",
    clinic: "SmileCare Dental, Chennai",
    avatar: "RM",
    avatarColor: "bg-blue-500/20 text-blue-300",
    stars: 5,
  },
  {
    quote:
      "As a solo practitioner, I couldn't afford a full-time receptionist. Glork is like having a 24/7 receptionist at a fraction of the cost. My patients love it.",
    name: "Dr. Ananya Bose",
    role: "Pediatrician",
    clinic: "Little Stars Pediatrics, Kolkata",
    avatar: "AB",
    avatarColor: "bg-emerald-500/20 text-emerald-300",
    stars: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="bg-[#141210] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section label + heading ── */}
        <div className="text-center mb-16">
          <p className="text-[10px] font-mono font-semibold text-[#FF5500] uppercase tracking-[0.25em] mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-white mb-5 tracking-tight">
            Loved by doctors
          </h2>
          <p className="text-lg text-[#8A8480] max-w-lg mx-auto">
            Join hundreds of clinics already saving hours every week.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bento-card rounded-2xl border border-white/6 bg-[#1C1916] p-7 flex flex-col gap-5"
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 text-[#FF5500] fill-[#FF5500]" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-sm text-[#8A8480] leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                <div className={`h-9 w-9 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${t.avatarColor}`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs text-[#4A4540] font-mono">{t.clinic}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
