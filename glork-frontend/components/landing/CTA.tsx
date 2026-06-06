"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section id="cta" className="bg-[#F7F6F3] border-t border-[#E0E0DB] py-20 px-6">
      <div className="max-w-[960px] mx-auto">
        <div
          className="relative overflow-hidden rounded-[32px] px-8 md:px-16 py-20 text-center"
          style={{
            background: "#0A0A0A",
            boxShadow: "0 0 0 1px rgba(245,229,66,0.10), 0 40px 100px rgba(10,10,10,0.25)",
          }}
        >
          {/* Yellow glow top center */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center top, rgba(245,229,66,0.20), transparent 70%)",
              filter: "blur(20px)",
            }}
          />

          <div className="relative z-10 max-w-lg mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35 mb-5">
              Get Started
            </p>

            <h2 className="text-[2.25rem] md:text-[3rem] font-light text-white leading-[1.06] tracking-tight mb-4">
              Every missed call is<br />
              a missed appointment.
            </h2>

            <p className="text-[15px] font-light text-white/45 leading-relaxed mb-9 max-w-[360px] mx-auto">
              Set up your AI receptionist in under 3 minutes.
              No credit card required.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-[#F5E542] text-[#0A0A0A] hover:bg-[#F9EE6E] transition-all rounded-full w-full sm:w-auto justify-center"
              >
                Set up in 3 minutes <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-2 px-7 py-3 text-[14px] font-medium text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all rounded-full bg-white/6 w-full sm:w-auto justify-center"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-0 grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E0E0DB] border-x border-b border-[#E0E0DB] rounded-b-2xl overflow-hidden">
          {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
            <div key={badge} className="py-4 text-[11px] text-[#bbb] uppercase tracking-wider flex items-center justify-center gap-1.5 bg-white/80">
              <span className="text-[#0A0A0A]/60">✓</span> {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
