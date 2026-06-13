"use client"

const stats = [
  { value: "3 min", label: "Setup time", sub: "From signup to live routing" },
  { value: "24/7", label: "Coverage", sub: "Evenings, weekends, and overflow" },
  { value: "99.9%", label: "Reliability", sub: "Stable front-desk availability" },
  { value: "15+", label: "Languages", sub: "Support for diverse patient bases" },
]

export default function Stats() {
  return (
    <section id="stats" className="section-block pt-0">
      <div className="section-shell">
        <div className="grid gap-px overflow-hidden rounded-[30px] border border-[var(--edge)] bg-[var(--edge)] md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="bg-white px-7 py-8 md:px-8 md:py-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--text-faint)]">{item.label}</p>
              <p className="mt-4 font-serif text-[3.25rem] leading-none tracking-tight text-[var(--text-primary)]">{item.value}</p>
              <p className="mt-3 max-w-[18ch] text-sm leading-6 text-[var(--text-muted)]">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
