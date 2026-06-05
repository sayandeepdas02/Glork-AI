"use client"

import { useState } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Panel, PanelHeader, PanelTitle, PanelContent } from "@/components/ui/panel"

const plans = [
  {
    name: "Starter",
    monthlyPrice: 0,
    annualPrice: 0,
    description: "Perfect for solo practitioners",
    features: ["50 calls / month", "Google Calendar sync", "SMS & email confirmations", "Basic analytics", "English only"],
    cta: "Get started free",
    href: "/dashboard",
    highlight: false,
  },
  {
    name: "Pro",
    monthlyPrice: 49,
    annualPrice: 34,
    description: "For busy practices",
    features: ["Unlimited calls", "Priority support", "Custom greeting script", "Advanced analytics", "15+ languages", "Emergency routing", "Call transcripts"],
    cta: "Start free trial",
    href: "/dashboard",
    highlight: true,
  },
  {
    name: "Clinic",
    monthlyPrice: 149,
    annualPrice: 104,
    description: "Multi-doctor clinics",
    features: ["Everything in Pro", "Multiple doctors", "Team dashboard", "Custom integrations", "Account manager", "99.9% SLA guarantee"],
    cta: "Contact us",
    href: "/dashboard",
    highlight: false,
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <Panel id="pricing" className="border-t border-[#EAEAE5]">
      <PanelHeader className="border-b border-[#EAEAE5]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-3">Pricing</p>
            <PanelTitle>Simple, transparent pricing</PanelTitle>
          </div>

          <div className="flex items-center gap-3 pb-1">
            <span className={cn("text-[12px] transition-colors", !annual ? "text-[#333]" : "text-[#bbb]")}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={cn(
                "relative h-5 w-9 rounded-full border transition-colors duration-200",
                annual ? "bg-brand border-brand" : "bg-[#F0F0EC] border-[#D8D8D3]"
              )}
            >
              <span className={cn(
                "absolute top-[1px] h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                annual ? "translate-x-[18px]" : "translate-x-[1px]"
              )} />
            </button>
            <span className={cn("text-[12px] transition-colors", annual ? "text-[#333]" : "text-[#bbb]")}>Annual</span>
            {annual && (
              <span className="text-[10px] text-brand border border-brand/20 bg-brand/5 px-2 py-0.5 rounded-full">Save 30%</span>
            )}
          </div>
        </div>
      </PanelHeader>

      <PanelContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice
            return (
              <article
                key={plan.name}
                className={cn(
                  "flex flex-col p-7 rounded-xl transition-all duration-200 relative",
                  plan.highlight
                    ? "bg-white border border-brand/25 ring-1 ring-brand/10 md:scale-[1.02] z-10"
                    : "bg-[#FAFAF8] border border-[#E8E8E3] hover:border-[#D0D0CA]"
                )}
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[11px] text-[#999] uppercase tracking-wider">{plan.name}</p>
                  {plan.highlight && (
                    <span className="text-[10px] text-brand border border-brand/20 bg-brand/5 px-2 py-0.5 rounded-full">
                      Most popular
                    </span>
                  )}
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-[3.25rem] font-light text-[#111] leading-none tracking-tight">${price}</span>
                    <span className="text-[12px] text-[#bbb] mb-1.5">/ mo</span>
                  </div>
                  <p className="text-[13px] text-[#999]">{plan.description}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#555]">
                      <Check className="h-3.5 w-3.5 shrink-0 text-brand" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={cn(
                    "block text-center rounded-xl px-5 py-2.5 text-[13px] transition-all duration-150 border",
                    plan.highlight
                      ? "bg-brand text-white border-brand hover:bg-brand-light"
                      : "bg-white text-[#555] border-[#DEDED9] hover:border-[#C0C0BB] hover:text-[#111]"
                  )}
                >
                  {plan.cta}
                </Link>
              </article>
            )
          })}
        </div>
      </PanelContent>
    </Panel>
  )
}
