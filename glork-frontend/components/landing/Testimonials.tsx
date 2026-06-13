"use client"

const testimonials = [
  {
    outcome: "Reduced missed calls by 85%",
    quote:
      "Hyperglork removed the dead time between patient intent and confirmed booking. The updated product now looks as disciplined as the workflow itself.",
    name: "Dr. Priya Sharma",
    specialty: "Dermatologist · Bengaluru",
    avatar: "PS",
  },
  {
    outcome: "Saved 18 hours every week",
    quote:
      "The product feels noticeably more trustworthy now. Clear sections, stronger calls to action, and better spacing make the experience easier to navigate for our staff.",
    name: "Dr. Rajan Murugan",
    specialty: "Dental Surgeon · Chennai",
    avatar: "RM",
  },
  {
    outcome: "Cut reception costs by 60%",
    quote:
      "As a solo practitioner I need software that looks calm, not busy. The cleaner UI makes it much easier to understand what matters at a glance.",
    name: "Dr. Ananya Bose",
    specialty: "Pediatrician · Kolkata",
    avatar: "AB",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="section-block bg-[var(--bg-surface)]">
      <div className="section-shell">
        <div className="section-heading">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">A calmer, more credible product experience.</h2>
          <p className="section-copy">
            The redesign prioritizes confidence signals: clean panels, decisive buttons,
            and spacing that makes the product feel mature.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="panel-surface rounded-[26px] p-7">
              <span className="inline-flex rounded-full bg-[#111111] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--brand)]">
                {item.outcome}
              </span>
              <blockquote className="mt-6 text-[15px] leading-8 text-[var(--text-muted)]">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-3 border-t border-[var(--edge)] pt-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-[11px] font-bold text-white">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold tracking-tight text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-[12px] text-[var(--text-faint)]">{item.specialty}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
