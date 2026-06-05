"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center bg-white overflow-hidden">

      {/* Background placeholder — swap this div's className for a bg-image later */}
      <div className="absolute inset-0 bg-white" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto">

        {/* Label */}
        <p className="text-[13px] text-[#888] uppercase tracking-[0.25em] mb-8">
          AI-powered voice receptionist
        </p>

        {/* Heading */}
        <h1 className="text-[clamp(3rem,8vw,6.5rem)] leading-[1.04] tracking-tight text-[#111] mb-8">
          Never miss a<br />
          patient call<br />
          <span className="text-brand">again.</span>
        </h1>

        {/* Sub */}
        <p className="text-[16px] md:text-[18px] text-[#666] leading-[1.65] max-w-[540px] mb-12">
          Glork&rsquo;s AI answers every call 24/7, books appointments into
          Google Calendar, and sends confirmations — so you can focus on
          medicine, not admin.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-14">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-7 py-3 text-[15px] bg-brand text-white hover:bg-brand-light transition-colors rounded-full"
          >
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 px-7 py-3 text-[15px] text-[#555] hover:text-[#111] border border-[#D8D8D3] hover:border-[#B8B8B3] transition-all rounded-full bg-white"
          >
            See how it works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex items-center gap-6 text-[12px] text-[#aaa] uppercase tracking-wider">
          <span>No credit card</span>
          <span className="text-[#ddd]">·</span>
          <span>Live in 3 minutes</span>
          <span className="text-[#ddd]">·</span>
          <span>Free plan</span>
        </div>
      </div>
    </section>
  )
}
