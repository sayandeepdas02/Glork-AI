"use client"

const steps = [
  {
    n: "01",
    title: "Set up in 3 minutes",
    description:
      "Create your account, connect Google Calendar, and configure your greeting. No technical knowledge needed — if you can send an email, you can set up Glork.",
    detail: "Average setup: 2 min 47 sec",
  },
  {
    n: "02",
    title: "Forward your clinic number",
    description:
      "Forward your existing clinic phone to your unique Glork number. Patients call the same number they always have — nothing changes for them.",
    detail: "Works with any phone provider",
  },
  {
    n: "03",
    title: "Sit back and relax",
    description:
      "The AI handles all incoming calls. View bookings, call logs, and full transcripts on your dashboard in real time.",
    detail: "Live dashboard + notifications",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0C0A09] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section label + heading ── */}
        <div className="text-center mb-20">
          <p className="text-[10px] font-mono font-semibold text-[#FF5500] uppercase tracking-[0.25em] mb-4">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-white mb-5 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="text-lg text-[#8A8480] max-w-lg mx-auto leading-relaxed">
            No hardware, no complex integrations. Just three steps to a fully automated reception desk.
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">

          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[28px] left-[calc(16.67%+28px)] right-[calc(16.67%+28px)] h-px bg-gradient-to-r from-[#FF5500]/40 via-[#FF5500]/60 to-[#FF5500]/40" />

          {steps.map((step, idx) => (
            <div
              key={step.n}
              className="relative flex flex-col items-start md:items-center md:text-center px-6 py-8 group"
            >
              {/* Step number circle */}
              <div className="relative mb-7 shrink-0">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#FF5500]/30 bg-[#FF5500]/10 z-10 relative transition-all duration-300 group-hover:border-[#FF5500]/60 group-hover:bg-[#FF5500]/15 group-hover:shadow-glow-sm">
                  <span className="text-lg font-bold text-[#FF7733] font-mono">{step.n}</span>
                </div>
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-[#8A8480] leading-relaxed mb-4">{step.description}</p>

              {/* Detail chip */}
              <span className="inline-flex items-center rounded-full border border-white/8 bg-white/4 px-3 py-1 text-[10px] font-mono font-medium text-[#4A4540]">
                {step.detail}
              </span>

              {/* Mobile connector */}
              {idx < steps.length - 1 && (
                <div className="md:hidden mt-6 self-center w-px h-8 bg-gradient-to-b from-[#FF5500]/40 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
