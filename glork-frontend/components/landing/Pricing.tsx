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
      <PanelHeader className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12 pb-6 border-b border-edge">
        <div className="flex flex-col gap-1 items-start">
          <span className="text-[13px] font-mono font-bold text-brand uppercase tracking-[0.3em] mb-2">
            Pricing
          </span>
          <PanelTitle>
            Simple, transparent pricing
            <PanelTitleSup>(03)</PanelTitleSup>
          </PanelTitle>
        </div>

        {/* Monthly / Annual toggle */}
        <div className="inline-flex items-center gap-3">
          <span className={cn("text-xs font-mono transition-colors uppercase tracking-widest", !annual ? "text-white" : "text-muted")}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            aria-label="Toggle billing period"
            className={cn(
              "relative h-5 w-9 rounded-full border transition-colors duration-200",
              annual
                ? "bg-brand border-brand"
                : "bg-white/5 border-white/20"
            )}
          >
            <span
              className={cn(
                "absolute top-[1px] h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                annual ? "translate-x-[18px]" : "translate-x-[1px]"
              )}
            />
          </button>
          <span className={cn("text-xs font-mono transition-colors uppercase tracking-widest", annual ? "text-white" : "text-muted")}>
            Annual
          </span>
          {annual && (
            <span className="inline-flex items-center rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-brand uppercase tracking-wider ml-1">
              Save 30%
            </span>
          )}
        </div>
      </PanelHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {plans.map((plan, i) => {
          const price = annual ? plan.annualPrice : plan.monthlyPrice
          return (
            <article
              key={plan.name}
              className={[
                "flex flex-col p-8 rounded-xl transition-all duration-200 relative",
                plan.highlight
                  ? "bg-white/[0.03] border border-brand shadow-[0_0_40px_rgba(255,107,0,0.15)]"
                  : "bg-white/[0.02] border border-white/[0.08] hover:border-white/15"
              ].join(" ")}
            >
              {/* Plan info */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm font-mono font-semibold uppercase tracking-widest text-white/90">
                    {plan.name}
                  </p>
                  {plan.highlight && (
                    <span className="text-[9px] font-mono font-bold text-brand uppercase tracking-widest border border-brand/30 bg-brand/10 px-2 py-0.5 rounded">
                      Popular
                    </span>
                  )}
                </div>
                
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-6xl font-serif italic font-bold text-white tracking-tight">${price}</span>
                  <span className="text-sm text-white/70 mb-2 font-mono">
                    / mo
                  </span>
                </div>
                
                <p className="text-[13px] text-white/70">
                  {plan.description}
                </p>
              </div>

              {/* Feature list */}
              <ul className="space-y-4 flex-1 mb-10">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] text-white/80 font-medium">
                    <Check className="h-4 w-4 shrink-0 text-brand" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.href}
                className={cn(
                  "block text-center rounded px-5 py-3 text-[13px] font-mono font-semibold uppercase tracking-widest transition-all duration-150 border",
                  plan.highlight
                    ? "bg-brand text-white border-brand hover:bg-brand-light hover:border-brand-light"
                    : "bg-white/5 text-white border-white/20 hover:bg-white/10"
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
