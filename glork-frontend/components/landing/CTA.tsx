"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Panel } from "@/components/ui/panel"

export default function CTA() {
  return (
    <Panel id="cta" className="bg-[#FAFAF8]">
      <div className="flex flex-col items-center justify-center py-28 px-6 text-center border-b border-[#EAEAE5]">
        <p className="text-[12px] text-[#888] uppercase tracking-[0.25em] mb-5">
          Stop missing calls
        </p>

        <h2 className="text-4xl lg:text-5xl text-[#111] mb-5 leading-[1.1] tracking-tight max-w-2xl">
          Every missed call is a missed appointment.
        </h2>

        <p className="text-[15px] text-[#666] mb-10 max-w-md mx-auto leading-relaxed">
          Set up your AI receptionist in under 3 minutes. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 text-[14px] bg-brand text-white hover:bg-brand-light transition-colors rounded-md"
          >
            Set up in 3 minutes <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-7 py-3 text-[14px] text-[#555] hover:text-[#111] border border-[#DEDED9] hover:border-[#C8C8C3] transition-all rounded-md bg-white"
          >
            Sign in
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#EAEAE5] border-b border-[#EAEAE5] text-center">
        {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
          <div key={badge} className="py-4 px-2 text-[11px] text-[#aaa] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <span className="text-brand">✓</span> {badge}
          </div>
        ))}
      </div>
    </Panel>
  )
}
