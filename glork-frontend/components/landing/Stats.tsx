"use client"

import { Panel } from "@/components/ui/panel"

const stats = [
  { value: "3 min",  label: "Average setup time",  sub: "No technical skills needed" },
  { value: "24/7",   label: "Call coverage",        sub: "Including holidays" },
  { value: "99.9%",  label: "Uptime SLA",           sub: "Enterprise-grade reliability" },
  { value: "15+",    label: "Languages supported",  sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <Panel id="stats" className="border-t-0">
      <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-[#EAEAE5] border-b border-[#EAEAE5]">
        {stats.map((item) => (
          <div
            key={item.label}
            className="group flex flex-col px-8 lg:px-10 py-10 transition-colors duration-300 hover:bg-[#FAFAF8]"
          >
            <div className="transform transition-transform duration-300 group-hover:-translate-y-0.5">
              <p className="text-[11px] text-[#aaa] uppercase tracking-wider mb-3">{item.label}</p>
              <p className="text-5xl md:text-6xl text-[#111] mb-3 tracking-tight">{item.value}</p>
              <p className="text-[13px] text-[#888]">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
