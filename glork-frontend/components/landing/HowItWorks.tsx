"use client"

const steps = [
  {
    n: "01",
    title: "Set up in 3 minutes",
    description: "Create your account, connect Google Calendar, and configure your greeting. No technical knowledge needed — if you can send an email, you can set up Hyperglork.",
    detail: "Avg. setup: 2 min 47 sec",
  },
  {
    n: "02",
    title: "Forward your clinic number",
    description: "Forward your existing clinic phone to your unique Hyperglork number. Patients call the same number they always have — nothing changes for them.",
    detail: "Works with any phone provider",
  },
  {
    n: "03",
    title: "Sit back and relax",
    description: "The AI handles all incoming calls. View bookings, call logs, and full transcripts on your dashboard in real time.",
    detail: "Live dashboard + notifications",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#0F0F0F] border-t border-white/8">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-24">

        {/* Header */}
        <div className="mb-16">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-white/10 bg-[#F5E040]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F5E040]">
            How it works
          </span>
          <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] font-normal tracking-tight text-white mt-5">
            Up and running in minutes
          </h2>
        </div>

        {/* Steps — 3 col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step) => (
            <div key={step.n} className="flex flex-col">

              {/* Step number */}
              <p className="text-[4rem] font-serif font-normal text-white/8 leading-none mb-6 select-none">
                {step.n}
              </p>

              {/* Yellow divider */}
              <div className="w-8 h-[2px] bg-[#F5E040] mb-6" />

              <h3 className="text-[17px] font-semibold text-white mb-3 tracking-tight">{step.title}</h3>
              <p className="text-[14px] text-white/45 leading-[1.7] mb-5 flex-1">
                {step.description}
              </p>

              <span className="inline-flex items-center gap-1.5 text-[12px] text-[#F5E040]/70 font-medium">
                <span className="text-[#F5E040]">→</span> {step.detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
