"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const HERO_BG_FALLBACK = `
  linear-gradient(165deg,
    #0A0A0A 0%,
    #121212 30%,
    #0F1318 60%,
    #0A0C10 100%
  )
`

export default function Hero() {
  return (
    <section
      className="relative w-full min-h-[92vh] flex flex-col overflow-hidden"
      style={{ background: HERO_BG_FALLBACK }}
    >
      {/* Background image layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.35,
        }}
      />

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.65) 0%, rgba(10,10,10,0.35) 50%, rgba(10,10,10,0.60) 100%)",
        }}
      />

      {/* Subtle brand-yellow glow at top */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(245,229,66,0.14), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto w-full pt-40 pb-20">

        <p className="text-[12px] text-white/55 uppercase tracking-[0.24em] mb-6 font-medium">
          AI-powered voice receptionist
        </p>

        <h1 className="text-[2.5rem] md:text-[4.5rem] font-light leading-[1.04] tracking-tight text-white mb-6">
          Never miss a patient call
          <br />
          <span className="text-[#F5E542]">again.</span>
        </h1>

        <p className="text-[15px] md:text-[16px] font-light text-white/60 leading-[1.75] max-w-[460px] mb-10">
          Hyperglork's AI answers every call 24/7, books appointments into
          Google Calendar, and sends instant confirmations — so you can focus
          on medicine, not admin.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-[#F5E542] text-[#0A0A0A] hover:bg-[#F9EE6E] transition-colors rounded-full w-full sm:w-auto justify-center"
          >
            Start for free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-7 py-3 text-[14px] font-medium text-white hover:text-white/90 border border-white/25 hover:border-white/45 transition-all rounded-full bg-white/8 backdrop-blur-sm w-full sm:w-auto justify-center"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center gap-5 text-[10.5px] text-white/35 uppercase tracking-[0.18em]">
          <span>No credit card</span>
          <span>·</span>
          <span>Live in 3 minutes</span>
          <span>·</span>
          <span>Free plan</span>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #ffffff)",
        }}
      />
    </section>
  )
}
