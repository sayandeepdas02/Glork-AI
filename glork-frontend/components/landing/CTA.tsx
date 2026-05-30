"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="relative bg-[#0C0A09] py-32 border-t border-white/5 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#FF5500]/40 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[300px] bg-[#FF5500]/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <p className="text-[10px] font-mono font-semibold text-[#FF5500] uppercase tracking-[0.25em] mb-6">
          Get started today
        </p>
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
          Ready to stop missing<br />
          <span className="font-serif italic gradient-text">patient calls?</span>
        </h2>
        <p className="text-lg text-[#8A8480] mb-12 max-w-xl mx-auto leading-relaxed">
          Set up your AI receptionist in 3 minutes. Free to start, no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="btn-shine inline-flex items-center gap-2 rounded-xl bg-[#FF5500] hover:bg-[#FF7733]
              px-9 py-4 text-base font-semibold text-white transition-all duration-200
              shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5"
          >
            Create your free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
            <span key={badge} className="flex items-center gap-1.5 text-xs text-[#4A4540] font-mono">
              <span className="text-[#FF5500]">✓</span> {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
