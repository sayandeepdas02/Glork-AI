"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Menu,
  Mic,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

const navLinks = [
  { href: "#product", label: "Product" },
  { href: "#workflow", label: "Workflow" },
  { href: "#proof", label: "Proof" },
]

const features = [
  {
    icon: PhoneCall,
    title: "Always-on call coverage",
    copy: "Answer every patient call with a trained voice agent that speaks clearly, gathers intent, and routes urgency correctly.",
  },
  {
    icon: CalendarDays,
    title: "Direct calendar booking",
    copy: "Slots, confirmations, reschedules, and cancellations happen in real time without your front desk chasing patients back.",
  },
  {
    icon: ShieldCheck,
    title: "Built for clinical edge cases",
    copy: "Escalate emergencies, capture follow-up context, and keep every step auditable for the team running the practice.",
  },
]

const workflow = [
  "Patient calls after hours or during peak clinic load.",
  "Hyperglork answers, captures context, and checks scheduling rules.",
  "Appointments are confirmed instantly and the practice sees the result in one command center.",
]

const proof = [
  { value: "24/7", label: "patient coverage" },
  { value: "<20s", label: "to handle most intents" },
  { value: "0 missed", label: "booking follow-ups in queue" },
]

function IconTwitterX({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconLinkedin({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconGithub({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LandingHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const smoothTransition = {
    transitionDuration: "600ms",
    transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
  } as const
  const drawerTransition = {
    transitionDuration: "500ms",
    transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
  } as const

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <header
      style={smoothTransition}
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto bg-[#0d1520] px-4 transition-all",
        scrolled && !open
          ? "max-w-4xl"
          : "max-w-6xl"
      )}
    >
      <div
        style={smoothTransition}
        className={cn(
          "transition-all",
          scrolled && !open
            ? "rounded-2xl border border-white/[0.12] bg-[#0d1520]/85 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "rounded-2xl border border-white/[0.07]"
        )}
      >
        <nav
          style={smoothTransition}
          className={cn(
            "relative flex w-full items-center justify-between transition-all",
            scrolled && !open ? "h-14 px-5" : "h-[68px] px-6"
          )}
        >
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Logo className="h-7 w-7 rounded-xl" />
            <span className="font-serif text-[22px] tracking-tight text-white">Hyperglork</span>
          </Link>

          <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-[14px] text-white/65 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="ml-auto hidden items-center gap-2 md:flex">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-[14px] text-white/65 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-[#0d1520] transition-colors hover:bg-white/90"
            >
              Start free
            </Link>
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="ml-auto p-2 text-white md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        <div
          style={drawerTransition}
          className={cn(
            "grid overflow-hidden transition-all md:hidden",
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-y-2 border-t border-white/[0.08] px-5 pb-6 pt-3">
              <div className="grid gap-y-1">
                {navLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center rounded-xl px-3 text-[16px] text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full border border-white/20 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-[#0d1520]"
                >
                  Start free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

function LandingFooter() {
  const productLinks = [
    { label: "Coverage", href: "#product" },
    { label: "Workflow", href: "#workflow" },
    { label: "Dashboard", href: "/login" },
    { label: "Agent setup", href: "/register" },
  ]
  const companyLinks = [
    { label: "For clinics", href: "#proof" },
    { label: "Front desk teams", href: "#workflow" },
    { label: "Patient experience", href: "#product" },
    { label: "Security posture", href: "#proof" },
  ]
  const resourceLinks = [
    { label: "Sign in", href: "/login" },
    { label: "Create account", href: "/register" },
    { label: "Onboarding", href: "/register" },
    { label: "Status", href: "#" },
  ]

  return (
    <footer
      className="relative overflow-hidden border-t border-white/[0.10]"
      style={{
        background: "linear-gradient(170deg, #0d1520 0%, #0d2035 40%, #1a4a70 100%)",
      }}
    >
      <div className="absolute inset-0 bg-[rgba(13,21,32,0.82)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 pb-0 pt-16 lg:px-12">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <Logo className="h-7 w-7 rounded-xl" />
              <span className="font-serif text-[20px] leading-tight text-white">Hyperglork</span>
            </div>
            <p className="mb-6 max-w-[220px] text-[13px] leading-relaxed text-white/65">
              Hyperglork helps clinics answer every patient call, manage bookings, and run a calmer front desk with AI.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" aria-label="Twitter / X" className="text-white/50 transition-colors hover:text-white">
                <IconTwitterX />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-white/50 transition-colors hover:text-white">
                <IconLinkedin />
              </a>
              <a href="#" aria-label="GitHub" className="text-white/50 transition-colors hover:text-white">
                <IconGithub />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">Product</p>
            <ul className="space-y-3">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[14px] text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">Company</p>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[14px] text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/35">Resources</p>
            <ul className="space-y-3">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-[14px] text-white/70 transition-colors hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/[0.08] pb-6 pt-5 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-[13px] text-white/50">All systems operational</span>
          </div>

          <p className="text-[13px] text-white/35">Copyright © 2026 Hyperglork</p>

          <div className="flex items-center gap-5 text-[13px] text-white/40">
            <a href="#" className="transition-colors hover:text-white/70">Privacy</a>
            <a href="#" className="transition-colors hover:text-white/70">Terms</a>
            <a href="#" className="transition-colors hover:text-white/70">Security</a>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex justify-center select-none pb-6 pointer-events-none">
        <span
          className="font-serif whitespace-nowrap leading-none"
          style={{
            fontSize: "clamp(80px, 14vw, 220px)",
            color: "rgba(255,255,255,1)",
            lineHeight: 1,
          }}
        >
          Hyperglork
        </span>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="bg-[#081120] text-white">
      <LandingHeader />

      <main>
        <section className="hero-grid relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="hero-orb absolute -left-16 top-20 h-80 w-80 blur-3xl" />
          <div className="hero-orb absolute right-0 top-0 h-[26rem] w-[26rem] opacity-80 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="max-w-3xl">
              <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                <Sparkles className="h-3.5 w-3.5 text-[#78b9ff]" />
                Notemind-style polish, rebuilt for clinic operations
              </span>

              <h1 className="mt-7 font-serif text-[3rem] leading-[0.96] tracking-tight text-white md:text-[4.7rem]">
                The AI receptionist
                <br />
                for clinics that want
                <span className="block text-[#8fc6ff]">calmer mornings.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-[16px] leading-7 text-white/68 md:text-[17px]">
                Hyperglork takes over repetitive call handling without making your practice feel robotic.
                It answers, triages, books, and confirms so staff can focus on patients already in the room.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1c80f2] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(28,128,242,0.28)] transition-transform hover:-translate-y-0.5"
                >
                  Launch your AI front desk
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-medium text-white/88 backdrop-blur transition-colors hover:bg-white/10"
                >
                  Explore dashboard
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  "Private practice",
                  "Specialty clinics",
                  "Dental groups",
                  "Follow-up heavy teams",
                ].map((item) => (
                  <span key={item} className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[12px] text-white/70">
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {proof.map((item) => (
                  <div key={item.label} className="glass-dark rounded-[24px] px-5 py-4">
                    <p className="text-[1.7rem] font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-[13px] text-white/58">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-6 top-10 hidden h-28 w-28 rounded-full border border-white/10 bg-white/6 blur-2xl lg:block" />
              <div className="glass-dark relative overflow-hidden rounded-[34px] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.32)]">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <p className="text-sm font-semibold text-white">Live reception console</p>
                    <p className="mt-1 text-xs text-white/48">One place to see calls, bookings, and action needed</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                    Agent online
                  </div>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-[#1c80f2]/16 p-3 text-[#9fd0ff]">
                        <PhoneCall className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/42">Active call</p>
                        <p className="mt-1 text-[15px] font-semibold text-white">New patient consultation</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-2xl bg-[#081120] px-4 py-3">
                      <p className="text-xs text-white/44">Intent detected</p>
                      <p className="mt-1 text-sm text-white/82">Needs first-available appointment next week</p>
                    </div>
                  </div>

                  <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-white/42">Today</p>
                        <p className="mt-1 text-[2rem] font-semibold text-white">18</p>
                      </div>
                      <div className="rounded-2xl bg-white/8 p-3 text-[#9fd0ff]">
                        <CalendarDays className="h-5 w-5" />
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-white/62">Appointments confirmed automatically with calendar sync enabled.</p>
                  </div>
                </div>

                <div className="mt-4 rounded-[28px] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">Reception queue</p>
                      <p className="text-xs text-white/44">What still needs a human</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white/66">2 items</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      "Transfer urgent medication query to staff",
                      "Approve reschedule request for Friday 10:30 AM",
                      "Review missed-call summary from 07:15 AM",
                    ].map((item, index) => (
                      <div key={item} className="flex items-center gap-3 rounded-2xl bg-[#081120]/60 px-4 py-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/6 text-xs font-semibold text-white/70">
                          0{index + 1}
                        </div>
                        <p className="text-sm text-white/78">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#f6f8fc] px-4 py-10 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {[
              "The AI answers routine demand before it hits staff.",
              "The dashboard shows exactly what the reception layer decided.",
              "The visual system feels more premium and less template-driven.",
            ].map((item) => (
              <div key={item} className="surface-card flex items-center gap-3 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="text-sm leading-7 text-ink-4">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="product" className="bg-[#f6f8fc] px-4 py-24 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="eyebrow">Product</span>
              <h2 className="mt-5 font-serif text-[2.7rem] leading-tight text-ink md:text-[3.7rem]">
                A quieter front desk, without losing clinical control.
              </h2>
              <p className="mt-4 text-[16px] leading-7 text-ink-4">
                The interface is now more deliberate and editorial, but the operating model stays grounded in actual clinic throughput.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="section-frame p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-[19px] font-semibold text-ink">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ink-4">{feature.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="bg-white px-4 py-24 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <span className="eyebrow">Workflow</span>
              <h2 className="mt-5 font-serif text-[2.7rem] leading-tight text-ink md:text-[3.6rem]">
                Designed around the rhythm of a real clinic day.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-ink-4">
                Hyperglork is strongest when the day gets messy: phones ringing during consults, reminders stacking up,
                and staff needing one source of truth for what happened.
              </p>
            </div>

            <div className="space-y-5">
              {workflow.map((item, index) => (
                <div key={item} className="surface-card flex gap-5 p-6">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-[17px] font-semibold text-ink">{item}</p>
                    <p className="mt-2 text-sm leading-7 text-ink-4">
                      {index === 0 && "Patients reach a calm, consistent voice instead of voicemail or a rushed handoff."}
                      {index === 1 && "Availability, clinic rules, and escalation logic stay inside the system instead of inside one receptionist’s head."}
                      {index === 2 && "The practice gets a clean operational log, not another stream of missed context."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="proof" className="bg-[#edf3fb] px-4 py-24 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[40px] bg-[#0c1829] px-8 py-10 text-white lg:px-12 lg:py-12">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="glass-dark inline-flex rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">
                  Why It Feels Different
                </span>
                <h2 className="mt-5 font-serif text-[2.6rem] leading-tight text-white md:text-[3.4rem]">
                  Notemind’s confidence, translated into a more clinical operating surface.
                </h2>
                <p className="mt-4 text-[15px] leading-7 text-white/62">
                  The strongest cues are in typography, contrast, navigation rhythm, and restraint. Glork now benefits from that without drifting away from its own workflow.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Mic, title: "Voice-first", text: "Call handling stays the primary visual metaphor." },
                  { icon: Stethoscope, title: "Clinic-specific", text: "Language and structure match practice operations." },
                  { icon: Clock3, title: "Operational", text: "The UI emphasizes queue clarity over decorative noise." },
                ].map((item) => (
                  <div key={item.title} className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <item.icon className="h-5 w-5 text-[#9fd0ff]" />
                    <p className="mt-4 text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-white/56">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 pb-24 pt-10 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 rounded-[40px] border border-[#dce6f2] bg-[linear-gradient(135deg,#ffffff_0%,#eff6ff_100%)] px-8 py-10 shadow-[0_30px_80px_rgba(12,24,41,0.08)] lg:flex-row lg:items-center lg:px-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-[2.5rem] leading-tight text-ink md:text-[3.3rem]">
                Give your clinic a front desk that does not drop the thread.
              </h2>
              <p className="mt-4 text-[15px] leading-7 text-ink-4">
                Start with the new experience, then wire the workflow into your actual scheduling and call-handling stack.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(28,128,242,0.24)] transition-transform hover:-translate-y-0.5"
              >
                Create account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full border border-[#d5e1ef] bg-white px-6 py-3.5 text-sm font-medium text-ink-3 transition-colors hover:border-brand/25 hover:text-brand"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
