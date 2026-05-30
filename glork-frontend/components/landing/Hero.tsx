"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Check, CheckCircle2, Phone } from "lucide-react"

/* ── Typewriter hook ──────────────────────────────────────── */
const BADGES = ["AI-powered", "24/7 available", "HIPAA-friendly", "No-code setup"]

function useTypewriter(words: string[], typingSpeed = 65, erasingSpeed = 38, pauseMs = 1600) {
  const [index, setIndex]     = useState(0)
  const [text, setText]       = useState("")
  const [phase, setPhase]     = useState<"typing" | "pausing" | "erasing">("typing")

  useEffect(() => {
    const current = words[index]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed)
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs)
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("erasing"), 0)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), erasingSpeed)
      } else {
        setIndex((i) => (i + 1) % words.length)
        setPhase("typing")
      }
    }
    return () => clearTimeout(timeout)
  }, [phase, text, index, words, typingSpeed, erasingSpeed, pauseMs])

  return text
}

export default function Hero() {
  const badgeText = useTypewriter(BADGES)

  return (
    <section className="relative min-h-screen hero-glow-orange flex items-center overflow-hidden">

      {/* ── Background grid dots ── */}
      <div className="absolute inset-0 bg-grid-dots opacity-100 pointer-events-none" />

      {/* ── Glow orbs ── */}
      <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full bg-[#FF5500]/8 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#FF5500]/5 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Copy ── */}
          <div className="animate-slide-up">

            {/* Typewriter badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#FF5500]/25 bg-[#FF5500]/10 px-4 py-1.5 text-xs font-medium text-[#FF7733] mb-8">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5500]" />
              </span>
              <span className="font-mono">
                {badgeText}
                <span className="inline-block w-[1.5px] h-[0.85em] bg-[#FF7733]/80 ml-[1px] align-middle animate-cursor-blink" />
              </span>
              &nbsp;medical receptionist
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-[4.5rem] font-bold text-white leading-[1.05] tracking-tight mb-6">
              Never miss a<br />
              patient call<br />
              <span className="font-serif italic gradient-text">again.</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-lg text-[#8A8480] leading-relaxed max-w-md mb-10">
              Glork&rsquo;s AI answers every call 24/7, books appointments straight
              into Google Calendar, and sends confirmations &mdash; so you can focus
              on medicine, not admin.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <Link
                href="/dashboard"
                className="btn-shine inline-flex items-center gap-2 rounded-xl bg-[#FF5500] hover:bg-[#FF7733]
                  px-7 py-3.5 text-base font-semibold text-white transition-colors duration-200
                  shadow-glow hover:-translate-y-0.5 transition-all"
              >
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5
                  hover:bg-white/10 px-7 py-3.5 text-base font-medium text-[#8A8480] hover:text-white
                  transition-all duration-200"
              >
                See how it works
              </a>
            </div>

            <p className="text-sm text-[#4A4540]">
              No credit card &middot; Live in 3 minutes &middot; Free forever plan
            </p>
          </div>

          {/* ── Right: Floating UI mockup ── */}
          <div className="relative h-[480px] hidden lg:block">

            {/* Live call card */}
            <div className="absolute top-0 right-0 w-[300px] rounded-2xl bg-[#141210] border border-white/8 p-5 shadow-dark-card animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#FF5500] flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#FF5500] border-2 border-[#141210] animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-[#FF7733] uppercase tracking-wider font-mono">Live call</p>
                  <p className="text-sm font-semibold text-white">+1 (555) 234-5678</p>
                </div>
                <div className="ml-auto text-[10px] text-[#4A4540] tabular-nums font-mono">0:42</div>
              </div>
              <div className="space-y-2.5">
                <div className="rounded-xl rounded-tl-none bg-[#FF5500]/15 px-3.5 py-2.5 text-xs text-[#FFB380] leading-relaxed">
                  &ldquo;Hi, I&rsquo;d like to book an appointment for next Tuesday around 10am&rdquo;
                </div>
                <div className="rounded-xl rounded-tr-none bg-white/6 px-3.5 py-2.5 text-xs text-[#8A8480] leading-relaxed ml-6">
                  &ldquo;Of course! I have 10:00 AM and 10:30 AM available. Which works better?&rdquo;
                </div>
              </div>
              {/* Voice waveform */}
              <div className="mt-4 flex items-center gap-1.5">
                {[70, 100, 45, 80, 60, 90, 35].map((w, i) => (
                  <div key={i} className="h-1.5 flex-1 rounded-full bg-[#FF5500]/20">
                    <div className="h-full rounded-full bg-[#FF5500]" style={{ width: `${w}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="absolute top-48 left-0 w-48 rounded-2xl bg-[#141210] border border-white/8 p-4 shadow-dark-card animate-float-slow">
              <p className="text-[10px] font-mono font-semibold text-[#4A4540] uppercase tracking-wider mb-1.5">This month</p>
              <p className="text-3xl font-bold text-white">48</p>
              <p className="text-xs text-[#FF7733] mt-1.5 flex items-center gap-1">
                <span>↑</span> 12 more than last month
              </p>
            </div>

            {/* Booking confirmed */}
            <div className="absolute bottom-12 right-4 w-[270px] rounded-2xl bg-white p-4 shadow-dark-card animate-float-slower">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-orange-50 flex items-center justify-center">
                  <CheckCircle2 className="h-4.5 w-4.5 text-[#FF5500]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">Booking confirmed</p>
                  <p className="text-xs text-gray-500 mt-0.5">Sarah J. &middot; Tue, 10:00 AM</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-[#FF5500]" /> SMS sent</span>
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-[#FF5500]" /> Calendar</span>
                <span className="flex items-center gap-1"><Check className="h-3 w-3 text-[#FF5500]" /> Email</span>
              </div>
            </div>

            {/* Decorative dots */}
            <div className="absolute top-24 left-28 h-2 w-2 rounded-full bg-[#FF5500]/40" />
            <div className="absolute bottom-44 left-12 h-1.5 w-1.5 rounded-full bg-[#FF5500]/25" />
            <div className="absolute top-10 left-52 h-1 w-1 rounded-full bg-white/20" />
          </div>
        </div>

        {/* ── Marquee trust strip ── */}
        <div className="mt-20 pt-12 border-t border-white/5">
          <p className="text-[10px] font-mono font-semibold text-[#4A4540] uppercase tracking-[0.2em] text-center mb-8">
            Trusted by clinics across specialties
          </p>
          <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex w-max animate-marquee gap-16">
              {[
                "General Practice", "Pediatrics", "Dermatology", "Dental",
                "Orthopedics", "Psychology", "Cardiology", "ENT",
                "General Practice", "Pediatrics", "Dermatology", "Dental",
                "Orthopedics", "Psychology", "Cardiology", "ENT",
              ].map((s, i) => (
                <span key={i} className="text-sm font-medium text-[#4A4540] whitespace-nowrap">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
