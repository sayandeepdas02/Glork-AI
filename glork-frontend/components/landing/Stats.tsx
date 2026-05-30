"use client"

const stats = [
  { value: "3 min",  label: "Average setup time",    sub: "No technical skills needed" },
  { value: "24/7",   label: "Call coverage",          sub: "Including holidays" },
  { value: "99.9%",  label: "Uptime SLA",             sub: "Enterprise-grade reliability" },
  { value: "15+",    label: "Languages supported",    sub: "Serve every patient" },
]

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF5500] via-[#CC3300] to-[#991F00]" />
      {/* Noise texture */}
      <div className="absolute inset-0 bg-grid-dots opacity-20" />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((item) => (
            <div key={item.label} className="group">
              <p className="text-4xl lg:text-5xl font-bold text-white mb-2 tracking-tight">
                {item.value}
              </p>
              <p className="text-sm font-semibold text-orange-100 mb-1">{item.label}</p>
              <p className="text-xs text-orange-200/60">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
