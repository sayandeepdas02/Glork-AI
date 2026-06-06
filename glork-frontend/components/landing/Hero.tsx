"use client"

import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full min-h-[68vh] flex flex-col items-center justify-center overflow-hidden py-24 md:py-32">

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0a0f0d]/62" />

      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(29,107,74,0.12), transparent 80%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        {/* Section label */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] text-white/65 uppercase tracking-[0.18em]">AI-powered voice receptionist</span>
        </div>

        <h1 className="font-serif text-[2.5rem] md:text-[3.5rem] font-normal leading-[1.1] tracking-tight text-white mb-5">
          Never miss a patient call<br />
          <span className="text-emerald-400">again.</span>
        </h1>

        <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.75] max-w-[440px] mb-10">
          Hyperglork&rsquo;s AI answers every call 24/7, books appointments into
          Google Calendar, and sends confirmations — so you can focus on
          medicine, not admin.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-10">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 text-[14px] font-semibold bg-white text-[#111] hover:bg-white/90 transition-colors rounded-full"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-7 py-3 text-[14px] font-medium text-white hover:text-white/90 border border-white/25 hover:border-white/45 transition-all rounded-full bg-white/5 backdrop-blur-sm"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center gap-5 text-[11px] text-white/38 uppercase tracking-wider">
          <span>No credit card</span>
          <span>·</span>
          <span>Live in 3 minutes</span>
          <span>·</span>
          <span>Free plan</span>
        </div>
      </div>
    </section>
  )
}
