"use client"

import { Calendar, Clock3, Globe2, Phone, Shield, Sparkles, Zap } from "lucide-react"

const featureCards = [
  {
    Icon: Calendar,
    title: "Real-time scheduling",
    description: "Checks live calendar availability and books the right appointment without back-and-forth.",
  },
  {
    Icon: Zap,
    title: "Immediate confirmations",
    description: "Patients get confirmation messages as soon as the booking is placed.",
  },
  {
    Icon: Globe2,
    title: "Multilingual conversations",
    description: "Serve a broader patient base with natural voice support across major languages.",
  },
  {
    Icon: Shield,
    title: "Urgency routing",
    description: "Escalate emergencies or sensitive calls using predefined clinic rules.",
  },
  {
    Icon: Clock3,
    title: "Hours and guardrails",
    description: "Only books inside the windows, durations, and doctor constraints you define.",
  },
]

export default function Features() {
  return (
    <section id="features" className="section-block">
      <div className="section-shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
          <div className="section-heading">
            <span className="section-eyebrow">Features</span>
            <h2 className="section-title">Built to run the front desk with less friction.</h2>
            <p className="section-copy">
              Inspired by product-led enterprise pages, the interface now leans on stronger
              alignment, quieter chrome, and more deliberate information density.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { value: "0", label: "Missed handoffs in flow" },
              { value: "24/7", label: "Coverage without staffing gaps" },
              { value: "< 1 min", label: "Typical booking resolution" },
            ].map((item) => (
              <div key={item.label} className="panel-surface rounded-[24px] p-5">
                <p className="font-serif text-4xl leading-none tracking-tight text-[var(--text-primary)]">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <article className="rounded-[30px] bg-[#121212] p-7 text-white md:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand)] text-[#111111]">
              <Phone className="h-5 w-5" />
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">Core workflow</p>
                <h3 className="mt-4 text-3xl font-semibold tracking-tight text-white">
                  24/7 AI receptionist with clear operating rules.
                </h3>
                <p className="mt-4 max-w-md text-[15px] leading-7 text-white/58">
                  Every inbound call follows a structured path: greet, qualify, book, confirm, or
                  route. The UI mirrors that discipline with cleaner edges and stronger layout rhythm.
                </p>
              </div>

              <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between border-b border-white/8 pb-4">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/38">Current queue</p>
                  <span className="rounded-full bg-[var(--brand)]/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-light)]">
                    3 active
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  {[
                    "Dr. Sharma follow-up confirmed for 09:00",
                    "Dr. Iyer new consultation being scheduled",
                    "Urgent callback routed to the duty desk",
                  ].map((item, index) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] px-4 py-3">
                      <div className={`h-2 w-2 rounded-full ${index === 2 ? "bg-amber-400" : "bg-[var(--brand)]"}`} />
                      <span className="text-sm text-white/58">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {featureCards.slice(0, 2).map(({ Icon, title, description }) => (
              <article key={title} className="panel-surface rounded-[24px] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-dim)] text-[var(--text-primary)]">
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {featureCards.slice(2).map(({ Icon, title, description }) => (
            <article key={title} className="panel-surface rounded-[24px] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-[var(--text-primary)]">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">{description}</p>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--bg-surface)] text-[var(--text-primary)]">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </article>
          ))}

          <article className="panel-surface rounded-[24px] p-6 md:col-span-3">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">Why this matters</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  A cleaner UI builds trust before the first interaction.
                </h3>
                <p className="mt-2 text-sm leading-7 text-[var(--text-muted)]">
                  The updated hierarchy borrows the discipline of strong B2B product sites:
                  consistent section widths, sharper button weights, and quieter surfaces around the content.
                </p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#111111] text-[var(--brand)]">
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
