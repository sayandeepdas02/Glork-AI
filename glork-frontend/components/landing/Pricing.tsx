"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for solo practitioners",
    features: ["50 calls / month", "Google Calendar sync", "SMS & email confirmations", "Basic analytics", "English only"],
    cta: "Get started free",
    href: "/dashboard",
    featured: false,
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 34,
    description: "For busy practices",
    features: ["Unlimited calls", "Priority support", "Custom greeting script", "Advanced analytics", "15+ languages", "Emergency routing", "Call transcripts"],
    cta: "Start free trial",
    href: "/dashboard",
    featured: true,
  },
  {
    name: "Clinic",
    monthlyPrice: 149,
    annualPrice: 104,
    description: "Multi-doctor clinics",
    features: ["Everything in Pro", "Multiple doctors", "Team dashboard", "Custom integrations", "Account manager", "99.9% SLA guarantee"],
    cta: "Contact us",
    href: "/dashboard",
    featured: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="bg-white border-t border-[#E5E5E0]">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-24">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-[#E5E5E0] bg-[#F5E040]/10 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#0F0F0F]">
              Pricing
            </span>
            <h2 className="font-serif text-[2rem] md:text-[2.75rem] leading-[1.1] font-normal tracking-tight text-[#0F0F0F] mt-5">
              Simple, transparent pricing
            </h2>
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 pb-1">
            <span className={cn("text-[13px] font-medium transition-colors", !annual ? "text-[#0F0F0F]" : "text-[#9B9B9B]")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative h-6 w-11 rounded-full border transition-all duration-200",
                annual ? "bg-[#F5E040] border-[#D4C01A]" : "bg-[#F2F2EE] border-[#C8C8C2]"
              )}
            >
              <span className={cn(
                "absolute top-[2px] h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200",
                annual ? "translate-x-[22px]" : "translate-x-[2px]"
              )} />
            </button>
            <span className={cn("text-[13px] font-medium transition-colors", annual ? "text-[#0F0F0F]" : "text-[#9B9B9B]")}>Annual</span>
            {annual && (
              <span className="text-[10px] font-bold text-[#0F0F0F] bg-[#F5E040] px-2 py-0.5 rounded-full">Save 30%</span>
            )}
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <article
                key={plan.name}
                className={cn(
                  "relative flex flex-col rounded-2xl overflow-hidden transition-all duration-200",
                  plan.featured
                    ? "bg-[#0F0F0F]"
                    : "bg-[#F9F9F7] border border-[#E5E5E0] hover:border-[#C8C8C2]"
                )}
              >
                {/* Featured top stripe */}
                {plan.featured && (
                  <div className="h-[3px] bg-[#F5E040]" />
                )}

                <div className="p-7 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-5">
                    <p className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.14em]",
                      plan.featured ? "text-white/50" : "text-[#9B9B9B]"
                    )}>
                      {plan.name}
                    </p>
                    {plan.featured && (
                      <span className="text-[10px] font-bold bg-[#F5E040] text-[#0F0F0F] px-2.5 py-1 rounded-full">
                        Most popular
                      </span>
                    )}
                  </div>

                  <div className="mb-5">
                    <div className="flex items-end gap-1 mb-1.5">
                      <span className={cn(
                        "font-serif text-[3rem] font-normal leading-none tracking-tight",
                        plan.featured ? "text-white" : "text-[#0F0F0F]"
                      )}>
                        ${price}
                      </span>
                      <span className={cn(
                        "text-[13px] self-end mb-1",
                        plan.featured ? "text-white/35" : "text-[#9B9B9B]"
                      )}>
                        / mo
                      </span>
                    </div>
                    <p className={cn("text-[13px]", plan.featured ? "text-white/40" : "text-[#9B9B9B]")}>
                      {plan.description}
                    </p>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-7">
                    {plan.features.map((f) => (
                      <li key={f} className={cn("flex items-center gap-2.5 text-[13.5px]", plan.featured ? "text-white/75" : "text-[#4A4A4A]")}>
                        <Check className={cn("h-3.5 w-3.5 shrink-0", plan.featured ? "text-[#F5E040]" : "text-[#0F0F0F]")} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
                    className={cn(
                      "block text-center rounded-xl px-5 py-3 text-[14px] font-semibold transition-all duration-150",
                      plan.featured
                        ? "bg-[#F5E040] text-[#0F0F0F] hover:bg-[#F8EC70]"
                        : "bg-white text-[#0F0F0F] border border-[#C8C8C2] hover:border-[#0F0F0F] hover:bg-[#F9F9F7]"
                    )}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
