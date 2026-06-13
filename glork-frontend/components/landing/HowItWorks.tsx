"use client"

const steps = [
  {
    n: "01",
    title: "Connect your clinic setup",
    description:
      "Create the account, connect Google Calendar, and define the basic rules for greetings, hours, and call routing.",
    detail: "Average setup: under 3 minutes",
  },
  {
    n: "02",
    title: "Point calls to Hyperglork",
    description:
      "Forward your current clinic line to the AI receptionist. Patients keep using the same number they already trust.",
    detail: "Works with standard carrier forwarding",
  },
  {
    n: "03",
    title: "Monitor the operation",
    description:
      "Review bookings, transcripts, and agent activity from the dashboard while the receptionist keeps taking calls around the clock.",
    detail: "Live visibility from one control surface",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-block border-y border-white/8 bg-[#111111] text-white">
      <div className="section-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="section-heading">
            <span className="section-eyebrow border-white/12 bg-white/[0.04] text-white/78">How it works</span>
            <h2 className="section-title text-white">A short path from setup to live coverage.</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-white/50">
            The flow is intentionally simple. The redesign follows the same principle:
            fewer visual interruptions, stronger spacing, clearer actions.
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <article key={step.n} className="dark-panel-surface rounded-[26px] p-6 md:p-7">
              <p className="font-serif text-6xl leading-none tracking-tight text-white/10">{step.n}</p>
              <div className="mt-8 h-px w-12 bg-[var(--brand)]" />
              <h3 className="mt-8 text-xl font-semibold tracking-tight text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-7 text-white/56">{step.description}</p>
              <p className="mt-8 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-light)]">
                {step.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
