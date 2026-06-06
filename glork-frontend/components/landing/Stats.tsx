"use client"

const stats = [
  { value: "3 min",  label: "Setup time",  sub: "No technical skills needed" },
  { value: "24/7",   label: "Coverage",    sub: "Holidays & weekends included" },
  { value: "99.9%",  label: "Uptime SLA",  sub: "Enterprise-grade reliability" },
  { value: "15+",    label: "Languages",   sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <section id="stats" className="w-full bg-[#0A0A0A] border-y border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col px-8 lg:px-14 py-11 border-r border-b border-white/[0.06] lg:border-b-0 hover:bg-white/[0.03] transition-colors">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 font-mono">{stats[0].label}</p>
          <p className="text-[2.875rem] font-light text-white leading-none mb-2.5 tracking-tight">{stats[0].value}</p>
          <p className="text-[12.5px] text-white/40">{stats[0].sub}</p>
        </div>
        <div className="flex flex-col px-8 lg:px-14 py-11 border-b border-white/[0.06] lg:border-r lg:border-b-0 hover:bg-white/[0.03] transition-colors">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 font-mono">{stats[1].label}</p>
          <p className="text-[2.875rem] font-light text-white leading-none mb-2.5 tracking-tight">{stats[1].value}</p>
          <p className="text-[12.5px] text-white/40">{stats[1].sub}</p>
        </div>
        <div className="flex flex-col px-8 lg:px-14 py-11 border-r border-white/[0.06] hover:bg-white/[0.03] transition-colors">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 font-mono">{stats[2].label}</p>
          <p className="text-[2.875rem] font-light text-white leading-none mb-2.5 tracking-tight">{stats[2].value}</p>
          <p className="text-[12.5px] text-white/40">{stats[2].sub}</p>
        </div>
        <div className="flex flex-col px-8 lg:px-14 py-11 hover:bg-white/[0.03] transition-colors">
          <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mb-3 font-mono">{stats[3].label}</p>
          <p className="text-[2.875rem] font-light text-white leading-none mb-2.5 tracking-tight">{stats[3].value}</p>
          <p className="text-[12.5px] text-white/40">{stats[3].sub}</p>
        </div>
      </div>
    </section>
  )
}
