"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section id="cta" className="relative overflow-hidden border-t border-[#EAEAE5]">
      {/* Dark background */}
      <div
        className="relative overflow-hidden"
        style={{ background: "linear-gradient(170deg, #080d0b 0%, #0d1a14 45%, #080d0b 100%)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center top, rgba(29,107,74,0.25), transparent 70%)" }}
        />

        <div className="relative z-10 flex flex-col items-center justify-center py-20 px-6 text-center">
          <p className="text-[11px] text-white/35 uppercase tracking-[0.24em] mb-5">
            Stop missing calls
          </p>

          <h2 className="font-serif text-[2rem] md:text-[2.625rem] font-normal text-white mb-4 leading-[1.12] tracking-tight max-w-xl">
            Every missed call is a missed appointment.
          </h2>

          <p className="text-[14px] text-white/50 mb-9 max-w-[360px] mx-auto leading-relaxed">
            Set up your AI receptionist in under 3 minutes. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-white text-[#111] hover:bg-white/90 transition-colors rounded-full"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 px-7 py-3 text-[14px] font-medium text-white/75 hover:text-white border border-white/18 hover:border-white/35 transition-all rounded-full"
            >
              Sign in to your account
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8 border-t border-white/8 text-center">
          {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
            <div key={badge} className="py-4 text-[11px] text-white/30 uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="text-emerald-500/60">✓</span> {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
