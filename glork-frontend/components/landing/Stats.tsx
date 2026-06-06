"use client"

const stats = [
  { value: "3 min",  label: "Setup time",  sub: "No technical skills required" },
  { value: "24/7",   label: "Coverage",    sub: "Including holidays & weekends" },
  { value: "99.9%",  label: "Uptime SLA",  sub: "Enterprise-grade reliability" },
  { value: "15+",    label: "Languages",   sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <section id="stats" className="bg-white border-t border-[#E5E5E0]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#E5E5E0]">
          {stats.map((item, i) => (
            <div
              key={item.label}
              className={`flex flex-col px-8 lg:px-12 py-14 ${i < 2 ? "border-b border-[#E5E5E0] lg:border-b-0" : ""}`}
            >
              <p className="text-[11px] font-semibold text-[#9B9B9B] uppercase tracking-[0.16em] mb-3">{item.label}</p>
              <p className="font-serif text-[3rem] md:text-[3.5rem] font-normal text-[#0F0F0F] leading-none mb-2 tracking-tight">{item.value}</p>
              <p className="text-[13px] text-[#9B9B9B] leading-snug">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
