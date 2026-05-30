"use client"

import { useState } from "react"
import Link from "next/link"
import { Check, Star } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for solo practitioners",
    features: [
      "50 calls / month",
      "Google Calendar sync",
      "SMS & email confirmations",
      "Basic analytics",
      "English only",
    ],
    cta: "Get started free",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 34,
    description: "For busy practices",
    features: [
      "Unlimited calls",
      "Priority support",
      "Custom greeting script",
      "Advanced analytics",
      "15+ languages",
      "Emergency call routing",
      "Call transcripts",
    ],
    cta: "Start free trial",
    href: "/dashboard",
    highlight: true,
  },
  {
    name: "Clinic",
    monthlyPrice: 149,
    annualPrice: 104,
    description: "Multi-doctor clinics",
    features: [
      "Everything in Pro",
      "Multiple doctors / rooms",
      "Team dashboard",
      "Custom integrations",
      "Dedicated account manager",
      "99.9% SLA guarantee",
    ],
    cta: "Contact us",
    href: "/dashboard",
    highlight: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="bg-[#0C0A09] py-28 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">

        {/* ── Section label + heading ── */}
        <div className="text-center mb-14">
          <p className="text-[10px] font-mono font-semibold text-[#FF5500] uppercase tracking-[0.25em] mb-4">
            Pricing
          </p>
          <h2 className="text-4xl lg:text-5xl font-serif italic font-normal text-white mb-5 tracking-tight">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-[#8A8480] mb-8">
            Start for free. No credit card required.
          </p>

          {/* Monthly / Annual toggle */}
          <div className="inline-flex items-center gap-3">
            <span className={cn("text-sm font-medium transition-colors", !annual ? "text-white" : "text-[#4A4540]")}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle billing period"
              className={cn(
                "relative h-6 w-12 rounded-full border transition-colors duration-200",
                annual
                  ? "bg-[#FF5500] border-[#FF5500]"
                  : "bg-white/8 border-white/12"
              )}
            >
              <span
                className={cn(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200",
                  annual ? "translate-x-6" : "translate-x-0.5"
                )}
              />
            </button>
            <span className={cn("text-sm font-medium transition-colors", annual ? "text-white" : "text-[#4A4540]")}>
              Annual
            </span>
            {annual && (
              <span className="inline-flex items-center rounded-full bg-[#FF5500]/15 border border-[#FF5500]/25 px-2.5 py-0.5 text-[10px] font-semibold text-[#FF7733]">
                Save 30%
              </span>
            )}
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <div
                key={plan.name}
                className={cn(
                  "relative rounded-2xl p-7 flex flex-col transition-all duration-200",
                  plan.highlight
                    ? "bg-[#FF5500] border border-[#FF7733]/40 shadow-glow"
                    : "bg-[#141210] border border-white/6 hover:border-white/12"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-[#FF5500]">
                      <Star className="h-3 w-3 fill-current" /> Most popular
                    </span>
                  </div>
                )}

                {/* Plan info */}
                <div className="mb-6">
                  <p className={cn("text-xs font-mono font-semibold uppercase tracking-widest mb-2", plan.highlight ? "text-orange-100" : "text-[#4A4540]")}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className={cn("text-sm mb-1.5", plan.highlight ? "text-orange-100" : "text-[#4A4540]")}>
                      / mo{annual && price > 0 ? " billed annually" : ""}
                    </span>
                  </div>
                  <p className={cn("text-xs mt-2", plan.highlight ? "text-orange-200" : "text-[#4A4540]")}>
                    {plan.description}
                  </p>
                </div>

                {/* Feature list */}
                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0 mt-0.5",
                          plan.highlight ? "text-white" : "text-[#FF5500]"
                        )}
                      />
                      <span className={plan.highlight ? "text-orange-50" : "text-[#8A8480]"}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={cn(
                    "btn-shine block text-center rounded-xl px-5 py-3 text-sm font-semibold transition-all duration-150",
                    plan.highlight
                      ? "bg-white text-[#FF5500] hover:bg-orange-50"
                      : "bg-white/8 text-white border border-white/12 hover:bg-white/14"
                  )}
                >
                  {plan.cta}
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
