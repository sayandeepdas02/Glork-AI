"use client"

import { Panel } from "@/components/ui/panel"

const stats = [
  { value: "3 min",  label: "Setup time",  sub: "No technical skills" },
  { value: "24/7",   label: "Coverage",    sub: "Holidays included" },
  { value: "99.9%",  label: "Uptime SLA",  sub: "Enterprise-grade" },
  { value: "15+",    label: "Languages",   sub: "Serve every patient" },
]

// Per-item border classes: correct for both 2-col (default) and 4-col (lg)
const borders = [
  "border-r border-b border-[#EAEAE5] lg:border-b-0",   // top-left
  "border-b border-[#EAEAE5] lg:border-r lg:border-b-0", // top-right → gains border-r at lg
  "border-r border-[#EAEAE5]",                            // bottom-left
  "",                                                      // bottom-right
]

export default function Stats() {
  return (
    <Panel id="stats" className="border-t border-[#EAEAE5]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <div
            key={item.label}
            className={`flex flex-col px-8 lg:px-14 py-8 hover:bg-[#FAFAF8] transition-colors duration-150 ${borders[i]}`}
          >
            <p className="text-[10px] text-[#bbb] uppercase tracking-widest mb-3">{item.label}</p>
            <p className="text-[3.25rem] font-light text-[#111] leading-none mb-2.5 tracking-tight">{item.value}</p>
            <p className="text-[12.5px] text-[#aaa]">{item.sub}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}
