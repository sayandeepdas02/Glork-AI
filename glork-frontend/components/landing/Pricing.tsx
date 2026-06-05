"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Panel, PanelHeader, PanelTitle, PanelTitleSup } from "@/components/ui/panel"

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
      "Emergency routing",
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
      "Multiple doctors",
      "Team dashboard",
      "Custom integrations",
      "Account manager",
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
    <Panel id="pricing">
      <PanelHeader className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-14 pb-8 border-b border-[#EAEAE5]">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[12px] text-[#888] uppercase tracking-[0.25em] mb-2">
            Pricing
          </span>
          <PanelTitle>
            Simple, transparent pricing
            <PanelTitleSup>(03)</PanelTitleSup>
          </PanelTitle>
        </div>

        <div className="inline-flex items-center gap-3">
          <span className={cn("text-[12px] uppercase tracking-wider transition-colors", !annual ? "text-[#111]" : "text-[#bbb]")}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-label="Toggle billing period"
            className={cn(
              "relative h-5 w-9 rounded-full border transition-colors duration-200",
              annual ? "bg-brand border-brand" : "bg-[#F0F0EC] border-[#D8D8D3]"
            )}
          >
            <span
              className={cn(
                "absolute top-[1px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                annual ? "translate-x-[18px]" : "translate-x-[1px]"
              )}
            />
          </button>
          <span className={cn("text-[12px] uppercase tracking-wider transition-colors", annual ? "text-[#111]" : "text-[#bbb]")}>
            Annual
          </span>
          {annual && (
            <span className="inline-flex items-center rounded border border-brand/20 bg-brand/6 px-2 py-0.5 text-[10px] text-brand uppercase tracking-wider ml-1">
              Save 30%
            </span>
          )}
        </div>
      </PanelHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 lg:p-8">
        {plans.map((plan) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice
          return (
            <article
              key={plan.name}
              className={cn(
                "flex flex-col p-7 lg:p-8 rounded-xl transition-all duration-300 relative",
                plan.highlight
                  ? "bg-white border border-brand/30 shadow-[0_4px_24px_rgba(255,107,0,0.08)] md:scale-[1.02] z-10"
                  : "bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D8D8D3]"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <span className="text-[10px] text-white uppercase tracking-wider bg-brand px-3 py-1 rounded-full whitespace-nowrap">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-7 mt-2">
                <p className="text-[12px] text-[#888] uppercase tracking-wider mb-4">
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-5xl lg:text-6xl text-[#111] tracking-tight">${price}</span>
                  <span className="text-[13px] text-[#aaa] mb-1.5">/ mo</span>
                </div>
                <p className="text-[13px] text-[#888]">{plan.description}</p>
              </div>

              <ul className="space-y-3.5 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-[#555]">
                    <Check className="h-3.5 w-3.5 shrink-0 text-brand mt-[2px]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={cn(
                  "block text-center rounded-md px-5 py-2.5 text-[13px] transition-all duration-150 border",
                  plan.highlight
                    ? "bg-brand text-white border-brand hover:bg-brand-light"
                    : "bg-white text-[#555] border-[#DEDED9] hover:border-[#C8C8C3] hover:text-[#111]"
                )}
              >
                {plan.cta}
              </Link>
            </article>
          )
        })}
      </div>
    </Panel>
  )
}
