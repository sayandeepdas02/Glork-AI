"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

function IconX({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function IconLinkedin({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ── Header ───────────────────────────────────────────────────

function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-[1200px] px-6">
        <nav className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <Logo className="h-6 w-6 rounded-md" />
            <span className="text-[14px] font-medium text-[#111111] tracking-tight">Hyperglork</span>
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {[
              { href: "#product", label: "Product" },
              { href: "#workflow", label: "Workflow" },
              { href: "#why", label: "Why Hyperglork" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-[13px] text-[#6B7280] hover:text-[#111111] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-[13px] text-[#6B7280] hover:text-[#111111] transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium bg-[#111111] text-white hover:bg-[#333333] transition-colors rounded-md"
            >
              Get started
            </Link>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 text-[#6B7280] hover:text-[#111111]"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </nav>
      </div>

      {open && (
        <div className="md:hidden border-t border-[#E5E7EB] bg-white px-6 py-4">
          <div className="space-y-0.5">
            {[
              { href: "#product", label: "Product" },
              { href: "#workflow", label: "Workflow" },
              { href: "#why", label: "Why Hyperglork" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-2 py-2.5 text-[14px] text-[#4A4A4A] hover:text-[#111111]"
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="px-2 py-2.5 text-[14px] text-[#4A4A4A]"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center py-2.5 text-[14px] font-medium bg-[#111111] text-white rounded-md"
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ── Hero ─────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-20 pb-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-[12px] text-[#9CA3AF] tracking-[0.04em] mb-6">
          Clinic infrastructure
        </p>
        <h1 className="text-[34px] font-[500] tracking-[-0.025em] leading-[1.18] text-[#111111] max-w-[560px] mb-5">
          Every patient call answered.<br />Every appointment confirmed.
        </h1>
        <p className="text-[15px] text-[#6B7280] leading-[1.75] max-w-[460px] mb-8">
          Hyperglork handles inbound calls for medical clinics — capturing intent,
          checking availability, booking the appointment, and sending confirmation
          without involving front desk staff.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-medium bg-[#111111] text-white hover:bg-[#333333] transition-colors rounded-md"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-5 py-2.5 text-[13px] text-[#6B7280] hover:text-[#111111] transition-colors border border-[#E5E7EB] rounded-md"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Metrics strip ─────────────────────────────────────────────

function Metrics() {
  const items = [
    { value: "24/7", label: "Patient call coverage" },
    { value: "<20s", label: "Average intent resolution" },
    { value: "Zero", label: "Missed booking follow-ups" },
  ]
  return (
    <section className="border-t border-b border-[#E5E7EB] py-10">
      <div className="mx-auto max-w-[1200px] px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[26px] font-[500] text-[#111111] tracking-[-0.02em]">
              {item.value}
            </p>
            <p className="mt-1 text-[13px] text-[#6B7280]">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Features ─────────────────────────────────────────────────

const features = [
  {
    label: "Call handling",
    title: "Always-on coverage",
    body: "Answer every inbound call 24/7. Patients reach a consistent, clear voice agent — not voicemail — regardless of how busy the front desk is.",
  },
  {
    label: "Calendar sync",
    title: "Real-time booking",
    body: "Appointments book directly into your calendar. Confirmations go out automatically. Reschedules and cancellations are resolved without back-and-forth.",
  },
  {
    label: "Oversight",
    title: "Full audit trail",
    body: "Every call, decision, and booking is logged. Urgent calls escalate to staff. The team sees exactly what happened without reviewing recordings.",
  },
]

function Features() {
  return (
    <section id="product" className="py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-[12px] text-[#9CA3AF] tracking-[0.04em] mb-5">Product</p>
        <h2 className="text-[26px] font-[500] tracking-[-0.02em] text-[#111111] max-w-[480px] mb-14">
          Designed for the volume and complexity of clinical call handling.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-[#E5E7EB] rounded-md p-6">
              <p className="text-[11px] text-[#9CA3AF] uppercase tracking-[0.08em] mb-4">
                {f.label}
              </p>
              <h3 className="text-[16px] font-[500] text-[#111111] mb-3">{f.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-[1.65]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Workflow ──────────────────────────────────────────────────

const steps = [
  {
    n: "01",
    title: "Patient calls the clinic",
    body: "Calls route to Hyperglork automatically — during hours, after hours, or when staff are occupied with patients in the room.",
  },
  {
    n: "02",
    title: "Intent captured and checked",
    body: "The agent identifies the appointment type, asks the right questions, and checks availability against your clinic's scheduling rules.",
  },
  {
    n: "03",
    title: "Booked. Confirmed. Logged.",
    body: "The appointment enters the calendar, the patient gets a confirmation, and the call is logged in the dashboard with full context.",
  },
]

function Workflow() {
  return (
    <section id="workflow" className="border-t border-[#E5E7EB] py-20 bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-[12px] text-[#9CA3AF] tracking-[0.04em] mb-5">Workflow</p>
        <h2 className="text-[26px] font-[500] tracking-[-0.02em] text-[#111111] max-w-[460px] mb-14">
          Three steps. No staff involvement for routine calls.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <p className="text-[12px] font-[500] text-[#9CA3AF] mb-4 tracking-[0.04em]">
                {s.n}
              </p>
              <h3 className="text-[16px] font-[500] text-[#111111] mb-3">{s.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-[1.65]">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Why ───────────────────────────────────────────────────────

const reasons = [
  {
    title: "Voice-first architecture",
    body: "Call handling is the core, not a feature bolted on. The system is built around how patients actually reach clinics.",
  },
  {
    title: "Clinic-specific logic",
    body: "Understands appointment types, working hours, urgency signals, and escalation paths — not generic booking flows adapted from a different domain.",
  },
  {
    title: "Operations-grade visibility",
    body: "Every action is logged, searchable, and reviewable. Your team stays in control of what requires human judgment.",
  },
]

function WhySection() {
  return (
    <section id="why" className="border-t border-[#E5E7EB] py-20">
      <div className="mx-auto max-w-[1200px] px-6">
        <p className="text-[12px] text-[#9CA3AF] tracking-[0.04em] mb-5">Why Hyperglork</p>
        <h2 className="text-[26px] font-[500] tracking-[-0.02em] text-[#111111] max-w-[500px] mb-14">
          Built for clinics. Not retrofitted from a generic AI calling product.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((r) => (
            <div key={r.title} className="border-t border-[#E5E7EB] pt-6">
              <h3 className="text-[15px] font-[500] text-[#111111] mb-3">{r.title}</h3>
              <p className="text-[14px] text-[#6B7280] leading-[1.65]">{r.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CTA ───────────────────────────────────────────────────────

function CTA() {
  return (
    <section className="border-t border-[#E5E7EB] py-20 bg-[#111111]">
      <div className="mx-auto max-w-[1200px] px-6">
        <h2 className="text-[26px] font-[500] tracking-[-0.02em] text-white mb-4 max-w-[420px]">
          Ready to put your front desk on autopilot?
        </h2>
        <p className="text-[15px] text-[#6B7280] leading-[1.7] max-w-[380px] mb-8">
          Set up takes under ten minutes. Connect your calendar, configure your agent, and go live.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-medium bg-white text-[#111111] hover:bg-[#E5E7EB] transition-colors rounded-md"
          >
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center px-5 py-2.5 text-[13px] text-[#6B7280] hover:text-white transition-colors border border-white/20 rounded-md"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────

function Footer() {
  const links = {
    Product: [
      { label: "Coverage", href: "#product" },
      { label: "Workflow", href: "#workflow" },
      { label: "Dashboard", href: "/login" },
    ],
    Account: [
      { label: "Sign in", href: "/login" },
      { label: "Create account", href: "/register" },
    ],
    Legal: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  }

  return (
    <footer className="border-t border-[#E5E7EB] py-12">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex flex-col sm:flex-row gap-12 justify-between">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <Logo className="h-5 w-5 rounded-md" />
              <span className="text-[14px] font-medium text-[#111111]">Hyperglork</span>
            </div>
            <p className="text-[13px] text-[#9CA3AF] max-w-[200px] leading-[1.6]">
              AI infrastructure for clinic front desks.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a href="#" aria-label="X / Twitter" className="text-[#9CA3AF] hover:text-[#111111] transition-colors">
                <IconX />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-[#9CA3AF] hover:text-[#111111] transition-colors">
                <IconLinkedin />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 text-[13px]">
            {Object.entries(links).map(([group, items]) => (
              <div key={group}>
                <p className="text-[11px] text-[#9CA3AF] uppercase tracking-[0.08em] mb-4">
                  {group}
                </p>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-[#6B7280] hover:text-[#111111] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[12px] text-[#9CA3AF]">© 2026 Hyperglork</p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className="text-[12px] text-[#9CA3AF]">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Page ──────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="bg-white text-[#111111]">
      <Header />
      <main>
        <Hero />
        <Metrics />
        <Features />
        <Workflow />
        <WhySection />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
