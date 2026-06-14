"use client"

const stats = [
  { value: "24/7", label: "Coverage without staffing gaps" },
  { value: "3 min", label: "Fast setup from signup to go-live" },
  { value: "99.9%", label: "Operational reliability and uptime" },
  { value: "15+", label: "Language coverage for diverse clinics" },
]

export default function Stats() {
  return (
    <section className="bg-black py-20 text-white md:py-24">
      <div className="section-shell">
        <div className="grid gap-px overflow-hidden rounded-[30px] bg-white/10 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[#141414] px-7 py-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/36">{stat.label}</p>
              <p className="mt-5 text-[3.2rem] leading-none tracking-[-0.04em] text-white">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
