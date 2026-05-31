"use client"

import { Zap, Phone, Shield, Globe } from "lucide-react"
import { Panel } from "@/components/ui/panel"

const stats = [
  { icon: Zap,    value: "3 min",  label: "Average setup time",    sub: "No technical skills needed" },
  { icon: Phone,  value: "24/7",   label: "Call coverage",          sub: "Including holidays" },
  { icon: Shield, value: "99.9%",  label: "Uptime SLA",             sub: "Enterprise-grade reliability" },
  { icon: Globe,  value: "15+",    label: "Languages supported",    sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <Panel id="stats" className="border-t-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, i) => (
          <div
            key={item.label}
            className={[
              "group flex flex-col p-10 transition-colors duration-300 hover:bg-white/[0.04]",
              /* Internal grid lines */
              "border-b border-edge",
              (i + 1) % 4 !== 0 ? "lg:border-r" : "",
              (i + 1) % 2 !== 0 ? "sm:border-r lg:border-r" : "", 
            ].join(" ")}
          >
            <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-4">
                <item.icon className="h-5 w-5 text-brand opacity-80" />
                <span className="text-[11px] font-mono text-white/50 uppercase tracking-widest">{item.label}</span>
              </div>
              <p className="text-6xl md:text-7xl font-serif italic font-bold text-white mb-4 tracking-tight">
                {item.value}
              </p>
              <p className="text-[14px] text-white/70">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}
