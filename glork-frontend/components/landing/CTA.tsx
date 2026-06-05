"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Panel } from "@/components/ui/panel"

export default function CTA() {
  return (
    <Panel id="cta" className="border-t border-[#EAEAE5] bg-[#F7F6F3]">
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-b border-[#E0E0DB]">

        <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-5">
          Stop missing calls
        </p>

        <h2 className="text-[1.75rem] md:text-[2.25rem] font-light text-[#111] mb-4 leading-[1.15] tracking-tight max-w-2xl">
          Every missed call is a missed appointment.
        </h2>

        <p className="text-[14px] text-[#777] mb-8 max-w-sm mx-auto leading-relaxed">
          Set up your AI receptionist in under 3 minutes. No credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 text-[14px] bg-brand text-white hover:bg-brand-light transition-colors rounded-full"
          >
            Set up in 3 minutes <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/login"
            className="text-[14px] text-[#888] hover:text-[#333] transition-colors"
          >
            Already have an account →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E0E0DB] text-center">
        {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
          <div key={badge} className="py-4 text-[11px] text-[#bbb] uppercase tracking-wider flex items-center justify-center gap-1.5">
            <span className="text-brand/70">✓</span> {badge}
          </div>
        ))}
      </div>
    </Panel>
  )
}
