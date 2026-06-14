"use client"

const cards = [
  {
    title: "Human Conversations, Built to Scale",
    copy:
      "Serve high inbound volumes without hiring, training, or sacrificing response quality when patient demand spikes.",
  },
  {
    title: "Enterprise-Grade Reliability & Security",
    copy:
      "Designed for mission-critical operations with uptime discipline, security controls, and clear operational trust signals.",
  },
  {
    title: "24/7 Multilingual Support",
    copy:
      "Ensure every patient is understood and helped in a natural conversation across major languages and operating hours.",
  },
]

export default function Testimonials() {
  return (
    <section id="enterprise" className="bg-[var(--bg-surface)] py-24 md:py-32">
      <div className="section-shell">
        <span className="section-eyebrow">Enterprise Solution</span>
        <h2 className="mt-8 max-w-3xl text-[3rem] leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)] md:text-[5rem]">
          Why Leading Clinics
          <br />
          Choose Hyperglork
        </h2>

        <div className="mt-14 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <article className="panel-surface rounded-[30px] p-7">
            <h3 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">{cards[0].title}</h3>
            <p className="mt-4 text-[16px] leading-8 text-[var(--text-muted)]">{cards[0].copy}</p>
            <div className="hero-image-surface mt-8 h-[550px] overflow-hidden rounded-[26px] border border-black/5" />
          </article>

          <div className="grid gap-4">
            {cards.slice(1).map((card) => (
              <article key={card.title} className="panel-surface rounded-[30px] p-7">
                <h3 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">{card.title}</h3>
                <p className="mt-4 text-[16px] leading-8 text-[var(--text-muted)]">{card.copy}</p>
                <div className="hero-image-surface mt-8 h-[195px] overflow-hidden rounded-[26px] border border-black/5" />
              </article>
            ))}
          </div>

          <article className="panel-surface rounded-[30px] p-7">
            <h3 className="text-[22px] font-semibold tracking-tight text-[var(--text-primary)]">Patient conversations, made visible</h3>
            <p className="mt-4 text-[16px] leading-8 text-[var(--text-muted)]">
              The product redesign carries the same clarity into the app itself: summaries, outcomes,
              schedules, and transcripts are easier to scan, use, and trust.
            </p>
            <div className="hero-image-surface mt-8 h-[550px] overflow-hidden rounded-[26px] border border-black/5" />
          </article>
        </div>
      </div>
    </section>
  )
}
