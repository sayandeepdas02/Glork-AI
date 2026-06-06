"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F0F0F]">

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial yellow glow from center-bottom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 50% at 50% 80%, rgba(245,224,64,0.08), transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto pt-16 pb-24">

        {/* Label pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#F5E040] animate-pulse" />
          <span className="text-[11px] text-white/55 uppercase tracking-[0.2em] font-medium">AI-powered voice receptionist</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-[3.25rem] sm:text-[4.5rem] md:text-[5.75rem] lg:text-[7rem] font-normal leading-[0.95] tracking-[-0.02em] text-white mb-8">
          Never miss<br />
          a patient<br />
          <span className="text-[#F5E040]">call again.</span>
        </h1>

        {/* Sub */}
        <p className="text-[16px] md:text-[18px] text-white/45 leading-[1.75] max-w-[480px] mb-12 font-light">
          Hyperglork&rsquo;s AI answers every call 24/7, books appointments
          into Google Calendar, and sends confirmations automatically.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-14">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold bg-[#F5E040] text-[#0F0F0F] hover:bg-[#F8EC70] transition-colors rounded-full"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-8 py-3.5 text-[15px] font-medium text-white/60 hover:text-white border border-white/12 hover:border-white/25 transition-all rounded-full"
          >
            See how it works
          </a>
        </div>

        {/* Trust strip */}
        <div className="flex items-center gap-6 text-[12px] text-white/28 uppercase tracking-wider">
          <span>No credit card</span>
          <span className="w-px h-3 bg-white/15" />
          <span>Live in 3 minutes</span>
          <span className="w-px h-3 bg-white/15" />
          <span>Free plan</span>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #0F0F0F)" }}
      />
    </section>
  )
}
