"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full min-h-[62vh] flex flex-col items-center justify-center bg-white overflow-hidden py-20 md:py-28">

      {/* Swap this div for a bg-image later */}
      <div className="absolute inset-0 bg-white" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto">

        <p className="text-[11px] text-[#aaa] uppercase tracking-[0.22em] mb-5">
          AI-powered voice receptionist
        </p>

        <h1 className="text-[2.25rem] md:text-[2.875rem] font-light leading-[1.08] tracking-tight text-[#111] mb-5">
          Never miss a patient call<br />
          <span className="text-brand">again.</span>
        </h1>

        <p className="text-[14px] md:text-[15px] text-[#777] leading-[1.7] max-w-[440px] mb-8">
          Glork&rsquo;s AI answers every call 24/7, books appointments into
          Google Calendar, and sends confirmations — so you can focus on
          medicine, not admin.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] bg-brand text-white hover:bg-brand-light transition-colors rounded-full"
          >
            Start for free <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-6 py-2.5 text-[13px] text-[#666] hover:text-[#111] border border-[#D8D8D3] hover:border-[#B8B8B3] transition-all rounded-full bg-white"
          >
            See how it works
          </a>
        </div>

        <div className="flex items-center gap-5 text-[10.5px] text-[#c0c0bb] uppercase tracking-wider">
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
