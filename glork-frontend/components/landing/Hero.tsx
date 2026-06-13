"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, PhoneCall, ShieldCheck } from "lucide-react"

const checkpoints = [
  "No call queues or voicemail loops",
  "Books directly into your calendar",
  "Escalates urgent callers immediately",
]

const metrics = [
  { label: "Calls answered", value: "24/7" },
  { label: "Setup time", value: "3 min" },
  { label: "Avg. booking flow", value: "42 sec" },
]

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/8 bg-[#111111] text-white">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 12%, rgba(232,197,71,0.24), transparent 26%), radial-gradient(circle at 85% 70%, rgba(232,197,71,0.12), transparent 28%)",
        }}
      />

      <div className="section-shell relative z-10 pb-20 pt-14 md:pb-28 md:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:gap-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              AI receptionist for modern practices
            </div>

            <h1 className="mt-8 max-w-4xl font-serif text-[3.6rem] leading-[0.93] tracking-[-0.04em] text-white sm:text-[4.6rem] lg:text-[6.4rem]">
              Patient calls,
              <br />
              handled with
              <br />
              speed and clarity.
            </h1>

            <p className="mt-8 max-w-xl text-[17px] leading-8 text-white/62 md:text-[18px]">
              Hyperglork answers inbound calls, books the right slot, confirms the
              appointment, and keeps your clinic responsive without adding front-desk load.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-7 py-3.5 text-[15px] font-semibold text-[#111111] transition-colors hover:bg-[var(--brand-light)]"
              >
                Start free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.03] px-7 py-3.5 text-[15px] font-medium text-white/72 transition-colors hover:border-white/28 hover:text-white"
              >
                Explore the product
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] font-medium uppercase tracking-[0.18em] text-white/42">
              <span>No credit card</span>
              <span className="h-1 w-1 rounded-full bg-white/18" />
              <span>Live in minutes</span>
              <span className="h-1 w-1 rounded-full bg-white/18" />
              <span>Calendar sync included</span>
            </div>
          </div>

          <div className="dark-panel-surface rounded-[28px] p-5 md:p-6">
            <div className="rounded-[22px] border border-white/10 bg-[#171717] p-5">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/38">
                    Live booking workflow
                  </p>
                  <p className="mt-2 text-lg font-semibold text-white">Monday, 09:42 AM</p>
                </div>
                <div className="rounded-full border border-[var(--brand-border)] bg-[var(--brand-dim)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand-light)]">
                  Active call
                </div>
              </div>

              <div className="space-y-3 py-5">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-[var(--brand)]/12 p-2 text-[var(--brand-light)]">
                      <PhoneCall className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Incoming patient call</p>
                      <p className="mt-1 text-sm leading-6 text-white/52">
                        Follow-up visit request for Dr. Bose, prefers today after 5 PM.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-white/6 p-2 text-white/70">
                      <CalendarClock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Best slot found</p>
                      <p className="mt-1 text-sm leading-6 text-white/52">
                        5:30 PM confirmed against live calendar availability, confirmation sent.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-white/6 p-2 text-white/70">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">Guardrails applied</p>
                      <p className="mt-1 text-sm leading-6 text-white/52">
                        Emergency routing, working hours, and booking rules enforced automatically.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/8 pt-4 sm:grid-cols-3">
                {metrics.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <p className="text-xl font-semibold tracking-tight text-white">{item.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/36">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 text-sm text-white/56">
              {checkpoints.map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.025] px-3.5 py-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
