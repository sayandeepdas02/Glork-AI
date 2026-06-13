"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "For solo practitioners validating the workflow.",
    features: ["50 calls / month", "Calendar sync", "SMS and email confirmations", "Basic analytics", "Single-language assistant"],
    cta: "Get started free",
    href: "/dashboard",
    featured: false,
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 34,
    description: "For busy clinics that need dependable inbound coverage.",
    features: ["Unlimited calls", "Advanced booking rules", "Priority support", "Transcripts and analytics", "15+ languages", "Urgency routing"],
    cta: "Start free trial",
    href: "/dashboard",
    featured: true,
  },
  {
    name: "Clinic",
    monthlyPrice: 149,
    annualPrice: 104,
    description: "For multi-doctor operations with custom requirements.",
    features: ["Everything in Pro", "Multiple doctors", "Shared team dashboard", "Custom integrations", "Account manager", "SLA-backed support"],
    cta: "Contact sales",
    href: "/dashboard",
    featured: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="section-block">
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="section-heading">
            <span className="section-eyebrow">Pricing</span>
            <h2 className="section-title">Straightforward plans with room to grow.</h2>
            <p className="section-copy">
              The section has been tightened to read more like a serious product decision,
              not a decorative pricing grid.
            </p>
          </div>

          <div className="panel-surface flex w-fit items-center gap-3 rounded-full px-4 py-3">
            <span className={cn("text-[13px] font-medium", !annual ? "text-[var(--text-primary)]" : "text-[var(--text-faint)]")}>Monthly</span>
            <button
              onClick={() => setAnnual((value) => !value)}
              className={cn(
                "relative h-7 w-12 rounded-full border transition-colors",
                annual ? "border-[var(--brand-dark)] bg-[var(--brand)]" : "border-[var(--edge-strong)] bg-[var(--bg-surface-2)]"
              )}
              aria-label="Toggle annual pricing"
            >
              <span
                className={cn(
                  "absolute top-[3px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                  annual ? "translate-x-6" : "translate-x-[3px]"
                )}
              />
            </button>
            <span className={cn("text-[13px] font-medium", annual ? "text-[var(--text-primary)]" : "text-[var(--text-faint)]")}>Annual</span>
            <span className="rounded-full bg-[#111111] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              Save 30%
            </span>
          </div>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice

            return (
              <article
                key={plan.name}
                className={cn(
                  "rounded-[28px] p-6 md:p-7",
                  plan.featured ? "bg-[#111111] text-white shadow-[0_24px_50px_rgba(17,17,17,0.18)]" : "panel-surface"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className={cn("text-[11px] font-semibold uppercase tracking-[0.18em]", plan.featured ? "text-white/42" : "text-[var(--text-faint)]")}>
                      {plan.name}
                    </p>
                    <p className={cn("mt-3 text-sm leading-7", plan.featured ? "text-white/58" : "text-[var(--text-muted)]")}>
                      {plan.description}
                    </p>
                  </div>
                  {plan.featured && (
                    <span className="rounded-full bg-[var(--brand)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#111111]">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-8 border-t border-black/8 pt-7 dark:border-white/8">
                  <div className="flex items-end gap-1.5">
                    <span className={cn("font-serif text-[3.4rem] leading-none tracking-tight", plan.featured ? "text-white" : "text-[var(--text-primary)]")}>
                      ${price}
                    </span>
                    <span className={cn("pb-1 text-sm", plan.featured ? "text-white/42" : "text-[var(--text-faint)]")}>/ month</span>
                  </div>
                </div>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className={cn("flex items-start gap-3 text-sm leading-7", plan.featured ? "text-white/70" : "text-[var(--text-muted)]")}>
                      <Check className={cn("mt-1 h-4 w-4 shrink-0", plan.featured ? "text-[var(--brand)]" : "text-[var(--text-primary)]")} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-semibold transition-colors",
                    plan.featured
                      ? "bg-[var(--brand)] text-[#111111] hover:bg-[var(--brand-light)]"
                      : "bg-[#111111] text-white hover:bg-[#232323]"
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
