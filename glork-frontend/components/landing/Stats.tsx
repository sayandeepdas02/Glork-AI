"use client"

import { Panel, PanelContent } from "@/components/ui/panel"

const stats = [
  { value: "3 min",  label: "Average setup time",    sub: "No technical skills needed" },
  { value: "24/7",   label: "Call coverage",          sub: "Including holidays" },
  { value: "99.9%",  label: "Uptime SLA",             sub: "Enterprise-grade reliability" },
  { value: "15+",    label: "Languages supported",    sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <Panel id="stats" className="border-t-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <div
            key={item.label}
            className={[
              "flex flex-col p-8 transition-colors duration-150 hover:bg-white/5",
              /* Internal grid lines */
              "border-b border-edge",
              (i + 1) % 4 !== 0 ? "lg:border-r" : "",
              (i + 1) % 2 !== 0 ? "sm:border-r lg:border-r" : "", 
            ].join(" ")}
          >
            <p className="text-5xl md:text-6xl font-serif italic font-bold text-white/95 mb-4 tracking-tight">
              {item.value}
            </p>
            <p className="text-[15px] font-semibold text-white/90 mb-1">{item.label}</p>
            <p className="text-[13px] text-white/75">{item.sub}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}
