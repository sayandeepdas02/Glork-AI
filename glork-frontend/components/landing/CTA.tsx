"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section id="cta" className="section-block border-t border-white/8 bg-[#111111] text-white">
      <div className="section-shell">
        <div className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 md:p-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                Ready to launch
              </span>
              <h2 className="mt-6 max-w-2xl font-serif text-4xl leading-none tracking-tight text-white md:text-5xl">
                Replace missed calls with a cleaner booking pipeline.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-7 text-white/56">
                The landing page and product shell now share the same visual discipline.
                Push that through the onboarding flow and the product will feel substantially more credible.
              </p>
            </div>

            <div className="grid gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3.5 text-[15px] font-semibold text-[#111111] transition-colors hover:bg-[var(--brand-light)]"
              >
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-white/12 px-6 py-3.5 text-[15px] font-medium text-white/70 transition-colors hover:border-white/24 hover:text-white"
              >
                Sign in to your account
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-[24px] border border-white/10 bg-white/10 md:grid-cols-4">
            {["No credit card", "Cancel anytime", "Go live fast", "Free plan available"].map((item) => (
              <div key={item} className="bg-[#161616] px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/42">
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
