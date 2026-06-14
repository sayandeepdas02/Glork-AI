"use client"

import Link from "next/link"

const items = [
  {
    n: "01.",
    title: "Human-Like Voice Conversations",
    copy:
      "Your AI receptionist speaks naturally, understands intent, and responds like a trained human agent rather than a brittle script.",
  },
  {
    n: "02.",
    title: "Instant 24/7 Call Handling",
    copy:
      "Every inbound call is answered immediately, even during peak hours, after hours, and on weekends.",
  },
  {
    n: "03.",
    title: "Smart Escalation to Humans",
    copy:
      "Urgent conversations, handoffs, and exception cases can be routed with clean operational guardrails.",
  },
  {
    n: "04.",
    title: "Actionable Call Insights",
    copy:
      "Review summaries, call outcomes, and transcripts in a clearer interface built for real daily use.",
  },
]

export default function HowItWorks() {
  return (
    <section id="solution" className="bg-[var(--bg-surface)] py-24 md:py-32">
      <div className="section-shell">
        <div className="grid gap-12 xl:grid-cols-[minmax(0,0.95fr)_minmax(540px,0.85fr)]">
          <div>
            <span className="section-eyebrow">The Solution</span>
            <h2 className="mt-8 max-w-3xl text-[3rem] leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)] md:text-[5rem]">
              One Voice Agent.
              <br />
              Unlimited Conversations.
            </h2>
            <p className="mt-8 max-w-2xl text-[19px] leading-9 text-[var(--text-muted)]">
              Deploy AI voice receptionists that understand patient intent, respond naturally,
              and resolve real clinic needs in seconds.
            </p>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-[#121212] px-9 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-[#232323]"
            >
              Get Started Free
            </Link>

            <div className="mt-14">
              {items.map((item, index) => (
                <div key={item.title} className={`grid grid-cols-[60px_minmax(0,1fr)_40px] gap-4 border-b border-[var(--edge)] py-7 ${index === 0 ? "border-t" : ""}`}>
                  <div className="pt-1 text-[18px] text-[var(--text-faint)]">{item.n}</div>
                  <div>
                    <h3 className={`text-[22px] font-semibold tracking-tight ${index === 0 ? "text-[var(--text-primary)]" : "text-[var(--text-faint)]"}`}>
                      {item.title}
                    </h3>
                    {index === 0 && (
                      <p className="mt-4 max-w-xl text-[16px] leading-8 text-[var(--text-muted)]">
                        {item.copy}
                      </p>
                    )}
                  </div>
                  <div className="pt-1 text-right text-[42px] leading-none text-[var(--text-primary)]">
                    {index === 0 ? "→" : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px]">
            <div className="h-full min-h-[760px] w-full bg-[url('/hero-bg.png')] bg-cover bg-center" />
          </div>
        </div>
      </div>
    </section>
  )
}
