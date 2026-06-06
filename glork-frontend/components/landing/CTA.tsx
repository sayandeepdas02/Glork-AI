"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section id="cta" className="bg-[#0F0F0F] border-t border-white/8">

      {/* Inner container with yellow accent border */}
      <div className="max-w-[1200px] mx-auto px-6 lg:px-14 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/8 bg-white/3 px-8 md:px-16 py-20 text-center">

          {/* Radial glow */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at center top, rgba(245,224,64,0.15), transparent 70%)" }}
          />

          <div className="relative z-10 max-w-lg mx-auto">
            <p className="text-[11px] font-semibold text-white/30 uppercase tracking-[0.24em] mb-5">
              Stop missing calls
            </p>

            <h2 className="font-serif text-[2rem] md:text-[3rem] font-normal text-white leading-[1.1] tracking-tight mb-4">
              Every missed call is a<br />missed appointment.
            </h2>

            <p className="text-[15px] text-white/45 leading-relaxed mb-10 max-w-sm mx-auto">
              Set up your AI receptionist in under 3 minutes. No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold bg-[#F5E040] text-[#0F0F0F] hover:bg-[#F8EC70] transition-colors rounded-full"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-8 py-3.5 text-[15px] font-medium text-white/60 hover:text-white border border-white/15 hover:border-white/30 transition-all rounded-full"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>

        {/* Badge strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mt-6 border border-white/8 rounded-2xl overflow-hidden">
          {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge, i) => (
            <div
              key={badge}
              className={`py-4 text-[11px] text-white/30 uppercase tracking-wider flex items-center justify-center gap-1.5 font-medium ${i > 0 ? "border-l border-white/8" : ""}`}
            >
              <span className="text-[#F5E040]/60">✓</span> {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
