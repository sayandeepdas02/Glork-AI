"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Calendar, Check, CheckCircle2, Clock,
  Phone, Shield, Sparkles, Star, Zap,
  Plus, Minus, Mail, MessageSquare, CreditCard,
  Globe, Database, FileText, Hash, Clipboard, Plug,
  Twitter, Linkedin, Instagram, Facebook,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── Shared mockup sub-components ─────────────────────────── */
function LiveCallCard() {
  return (
    <div className="w-[300px] rounded-2xl bg-[#0f1f17] border border-emerald-900/40 p-5 shadow-dark-card animate-float">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full bg-[#1d6b4a] flex items-center justify-center">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#0f1f17] animate-pulse" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider">Live call</p>
          <p className="text-sm font-semibold text-white">+1 (555) 234-5678</p>
        </div>
        <div className="ml-auto text-[10px] text-gray-500 tabular-nums">0:42</div>
      </div>
      <div className="space-y-2.5">
        <div className="rounded-xl rounded-tl-none bg-[#1d6b4a]/20 px-3.5 py-2.5 text-xs text-emerald-300 leading-relaxed">
          "Hi, I'd like to book an appointment for next Tuesday around 10am"
        </div>
        <div className="rounded-xl rounded-tr-none bg-white/[0.08] px-3.5 py-2.5 text-xs text-gray-300 leading-relaxed ml-6">
          "Of course! I have 10:00 AM and 10:30 AM available. Which works better?"
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        {[70, 100, 45, 80].map((w, i) => (
          <div key={i} className="h-1 flex-1 rounded-full bg-emerald-600/40">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${w}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function StatsCard() {
  return (
    <div className="w-44 rounded-xl bg-[#0f1f17] border border-white/[0.08] p-4 shadow-dark-card">
      <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">This month</p>
      <p className="text-3xl font-bold text-white">48</p>
      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
        <span>↑</span> 12 more than last month
      </p>
    </div>
  )
}

function BookingConfirmedCard() {
  return (
    <div className="w-[260px] rounded-2xl bg-white p-4 shadow-dark-card">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900">Booking confirmed</p>
          <p className="text-xs text-gray-500 mt-0.5">Sarah J. · Tue, 10:00 AM</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2 text-[10px] text-gray-400">
        <Check className="h-3 w-3 text-emerald-500" /> SMS sent
        <Check className="h-3 w-3 text-emerald-500" /> Calendar updated
        <Check className="h-3 w-3 text-emerald-500" /> Email sent
      </div>
    </div>
  )
}

/* ─── Navbar ─────────────────────────────────────────────────── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      scrolled
        ? "bg-[#0a0f0d]/90 backdrop-blur-xl border-b border-white/5 py-3"
        : "bg-transparent py-5"
    )}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d6b4a]">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Glork</span>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">
            beta
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How it works", "Pricing", "Blog"].map((item) => (
            <a
              key={item}
              href={item === "Blog" ? "/blog" : `#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login"
            className="text-sm text-gray-400 hover:text-white transition-colors duration-150 px-3 py-1.5">
            Sign in
          </Link>
          <Link href="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#b9f264] text-[#0a0f0d] font-semibold px-5 py-2 text-sm hover:brightness-105 transition-all duration-200 active:scale-[0.98]">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0a0f0d] flex items-center overflow-hidden hero-glow-center">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 w-full">
        {/* Center column */}
        <div className="flex flex-col items-center text-center">

          {/* Section label */}
          <div className="section-label-dark mb-8">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            AI-powered medical receptionist
          </div>

          {/* H1 */}
          <h1 className="text-6xl lg:text-7xl font-bold text-white leading-[1.04] tracking-tight mb-6 max-w-3xl">
            Never miss a patient<br />
            call <span className="gradient-text-lime">again.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-gray-400 leading-relaxed max-w-xl mb-10">
            Glork's AI answers every call 24/7, books appointments straight
            into Google Calendar, and sends confirmations — so you can focus
            on medicine, not admin.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
            <Link href="/register" className="btn-lime-lg">
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#how-it-works" className="btn-ghost-dark">
              See how it works
            </a>
          </div>

          {/* Social proof strip */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 mb-20">
            <span className="flex items-center gap-1.5">
              <span className="text-amber-400 tracking-tight">★★★★★</span>
              <span>Rated 4.9 by clinics</span>
            </span>
            <span className="h-4 w-px bg-white/10 hidden sm:block" />
            <span>Used by 200+ practices</span>
            <span className="h-4 w-px bg-white/10 hidden sm:block" />
            <span>No credit card required</span>
          </div>

          {/* Mockup panel */}
          <div className="relative hidden lg:block w-full max-w-2xl h-[440px] mx-auto">
            <div className="absolute inset-0 bg-[#1d6b4a]/8 blur-[100px] rounded-full pointer-events-none" />
            {/* Live call card */}
            <div className="absolute top-0 right-0">
              <LiveCallCard />
            </div>
            {/* Stats card */}
            <div className="absolute top-44 left-0">
              <StatsCard />
            </div>
            {/* Booking confirmed */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/4">
              <BookingConfirmedCard />
            </div>
            {/* Dot decorations */}
            <div className="absolute top-24 left-28 h-2 w-2 rounded-full bg-emerald-500/40" />
            <div className="absolute bottom-40 left-10 h-1.5 w-1.5 rounded-full bg-emerald-500/30" />
            <div className="absolute top-8 left-52 h-1 w-1 rounded-full bg-white/20" />
          </div>

        </div>

        {/* Trust strip */}
        <div className="mt-20 pt-10 border-t border-white/5">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-widest text-center mb-8">
            Trusted by clinics across specialties
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {["General Practice", "Pediatrics", "Dermatology", "Dental", "Orthopedics", "Psychology"].map((s) => (
              <span key={s} className="text-sm font-medium text-gray-600">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Problem Section ────────────────────────────────────────── */
function ProblemSection() {
  const stats = [
    {
      chip: "After-hours coverage",
      stat: ">60%",
      bold: "of calls go unanswered after 5 PM",
      body: "Patients hang up and book elsewhere. Every missed call is a missed appointment and lost revenue.",
    },
    {
      chip: "Patient dropout",
      stat: "30%",
      bold: "of patients abandon if put on hold",
      body: "Phone tag and wait times drive patients to competitors. Frustration costs you bookings every day.",
    },
    {
      chip: "Admin burden",
      stat: "8h+",
      bold: "per week lost to manual scheduling",
      body: "Your staff spend hours on bookings, reminders, and rescheduling. That's time off the floor.",
    },
  ]

  return (
    <section className="bg-[#f7f8f6] py-28 lg:py-36">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-center mb-6">
          <span className="section-label-light">✦ The problem</span>
        </div>

        <h2 className="text-center text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-4">
          Calls are being missed.
        </h2>
        <p className="text-center text-lg text-gray-500 max-w-xl mx-auto mb-16">
          Most clinics aren't losing patients because of care quality — they're
          losing them between the ring and the pickup.
        </p>

        {/* Staggered stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {stats.map((s, i) => (
            <div
              key={s.chip}
              className={cn(
                "rounded-2xl bg-white border border-gray-100 shadow-sm p-8",
                i === 1 && "md:mt-8"
              )}
            >
              <span className="section-label-light mb-5 inline-flex">{s.chip}</span>
              <p className="text-5xl font-bold text-gray-900 mt-4 mb-2 tracking-tight">{s.stat}</p>
              <p className="text-base font-semibold text-gray-900 mb-2">{s.bold}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

/* ─── Solution Section ───────────────────────────────────────── */
function SolutionSection() {
  return (
    <section className="bg-[#0a0f0d] py-28 lg:py-36 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#1d6b4a]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6">

        <div className="flex justify-center mb-6">
          <span className="section-label-dark">✦ The solution</span>
        </div>

        <h2 className="text-center text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6 max-w-3xl mx-auto">
          Glork handles the{" "}
          <span className="gradient-text-light">entire receptionist</span>
          {" "}workflow
        </h2>
        <p className="text-center text-lg text-gray-400 max-w-xl mx-auto mb-16">
          One phone number. Infinite patience. Zero missed calls.
        </p>

        {/* Mockup panel */}
        <div className="relative hidden lg:block mx-auto max-w-3xl h-[440px]">
          <div className="absolute inset-0 bg-[#1d6b4a]/8 blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute top-0 right-0">
            <LiveCallCard />
          </div>
          <div className="absolute top-40 left-0">
            <StatsCard />
          </div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/3">
            <BookingConfirmedCard />
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── Features Section ───────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section id="features">

      {/* Row 1 — dark bg, text left, mockup right */}
      <div className="bg-[#0a0f0d] py-28 lg:py-36 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            <div>
              <span className="section-label-dark mb-6 inline-flex">✦ Real-time call handling</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                Every call answered,<br />every time.
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Glork's voice AI picks up in under 2 seconds — day or night, weekday
                or holiday. Your patients always reach a live, helpful voice.
              </p>
              <ul className="space-y-4">
                {[
                  "24/7 availability including weekends and public holidays",
                  "Emergency detection with instant warm-transfer",
                  "Handles multiple concurrent calls without hold music",
                  "English, Hindi, and Tamil support out of the box",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-300">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <Check className="h-3 w-3 text-emerald-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative flex justify-center">
              <div className="relative">
                <LiveCallCard />
                <div className="absolute -inset-8 bg-[#1d6b4a]/8 blur-[60px] rounded-full pointer-events-none -z-10" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Row 2 — light bg, mockup left, text right */}
      <div className="bg-[#f7f8f6] py-28 lg:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Mockup col */}
            <div className="relative flex justify-center order-2 lg:order-1">
              <div className="relative w-[300px] h-[340px]">
                <div className="absolute top-0 left-4">
                  <BookingConfirmedCard />
                </div>
                <div className="absolute bottom-0 right-0">
                  <StatsCard />
                </div>
              </div>
            </div>

            {/* Text col */}
            <div className="order-1 lg:order-2">
              <span className="section-label-light mb-6 inline-flex">✦ Smart scheduling</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
                Bookings that sync<br />instantly.
              </h2>
              <p className="text-lg text-gray-500 leading-relaxed mb-8">
                Glork reads your live Google Calendar availability and slots new
                appointments in real time — zero double-bookings, zero manual entry.
              </p>
              <ul className="space-y-4">
                {[
                  "Real-time Google Calendar read & write",
                  "SMS and email confirmation sent automatically",
                  "Custom working hours per day of the week",
                  "Reschedule and cancellation handling via voice",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-gray-700">
                    <div className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-[#1d6b4a]/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-[#1d6b4a]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}

/* ─── How it works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Set up in 3 minutes",
      description: "Create your account, connect Google Calendar, and configure your greeting message. No technical knowledge needed.",
    },
    {
      n: "02",
      title: "Forward your clinic number",
      description: "Forward your existing clinic phone to your unique Glork number. Patients call the same number they always have.",
    },
    {
      n: "03",
      title: "Sit back and relax",
      description: "The AI handles all incoming calls. View bookings, call logs and transcripts on your dashboard in real time.",
    },
  ]

  return (
    <section id="how-it-works" className="bg-[#0a0f0d] py-28 lg:py-36 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-6">
          <span className="section-label-dark">✦ How it works</span>
        </div>
        <h2 className="text-center text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
          Up and running in minutes
        </h2>
        <p className="text-center text-lg text-gray-400 max-w-lg mx-auto mb-16">
          No hardware, no complex integrations. Just three steps to a fully automated reception desk.
        </p>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute top-9 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          {steps.map((step) => (
            <div key={step.n} className="relative flex flex-col items-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 mb-6">
                <span className="text-2xl font-bold text-emerald-400 font-mono">{step.n}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ──────────────────────────────────────────────────── */
function Stats() {
  const items = [
    { value: "3 min", label: "Average setup time" },
    { value: "24/7", label: "Call coverage" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "15+", label: "Languages supported" },
  ]

  return (
    <section className="bg-[#1d6b4a] py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20 pointer-events-none" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex justify-center mb-12">
          <span className="section-label-dark">✦ By the numbers</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-5xl font-bold text-white mb-1">{item.value}</p>
              <div className="w-8 h-0.5 bg-white/20 mx-auto mt-3 mb-3" />
              <p className="text-sm text-emerald-200">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Integrations ───────────────────────────────────────────── */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar, Mail, Phone, MessageSquare, Sparkles, CreditCard,
  Zap, Globe, Database, FileText, Hash, Clipboard, Plug, Plus,
}

const INTEGRATIONS = [
  // Row 1
  { name: "Google Calendar", icon: "Calendar", color: "bg-blue-50", iconColor: "text-blue-500" },
  { name: "Gmail", icon: "Mail", color: "bg-red-50", iconColor: "text-red-500" },
  { name: "Twilio", icon: "Phone", color: "bg-red-50", iconColor: "text-red-600" },
  { name: "WhatsApp", icon: "MessageSquare", color: "bg-green-50", iconColor: "text-green-600" },
  { name: "OpenAI", icon: "Sparkles", color: "bg-gray-50", iconColor: "text-gray-700" },
  { name: "Stripe", icon: "CreditCard", color: "bg-indigo-50", iconColor: "text-indigo-600" },
  { name: "Zapier", icon: "Zap", color: "bg-orange-50", iconColor: "text-orange-500" },
  { name: "HubSpot", icon: "Globe", color: "bg-orange-50", iconColor: "text-orange-600" },
  // Row 2
  { name: "Salesforce", icon: "Database", color: "bg-blue-50", iconColor: "text-blue-600" },
  { name: "Notion", icon: "FileText", color: "bg-gray-50", iconColor: "text-gray-700" },
  { name: "Slack", icon: "Hash", color: "bg-purple-50", iconColor: "text-purple-600" },
  { name: "EHR Systems", icon: "Clipboard", color: "bg-emerald-50", iconColor: "text-emerald-600" },
  { name: "Pabbly", icon: "Plug", color: "bg-rose-50", iconColor: "text-rose-500" },
  { name: "Coming soon", icon: "Plus", color: "bg-gray-100", iconColor: "text-gray-400", faded: true },
  { name: "Coming soon", icon: "Plus", color: "bg-gray-100", iconColor: "text-gray-400", faded: true },
  { name: "Coming soon", icon: "Plus", color: "bg-gray-100", iconColor: "text-gray-400", faded: true },
]

function IntegrationsSection() {
  const row1 = INTEGRATIONS.slice(0, 8)
  const row2 = INTEGRATIONS.slice(8, 16)

  return (
    <section className="bg-[#f7f8f6] py-28 lg:py-36 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">

        <div className="flex justify-center mb-6">
          <span className="section-label-light">✦ Integrations</span>
        </div>

        <h2 className="text-center text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-4">
          Works with the tools<br />your clinic already uses
        </h2>
        <p className="text-center text-lg text-gray-500 max-w-lg mx-auto mb-16">
          Connect Glork to your existing stack in one click. No engineering required.
        </p>

        {/* Row 1 */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-3">
          {row1.map((item) => {
            const Icon = ICON_MAP[item.icon] ?? Plug
            return (
              <div
                key={item.name}
                className="flex flex-col items-center gap-2 rounded-2xl p-4 border border-gray-100 bg-white shadow-sm"
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", item.color)}>
                  <Icon className={cn("h-5 w-5", item.iconColor)} />
                </div>
                <span className="text-[10px] text-center font-medium text-gray-600 leading-tight">{item.name}</span>
              </div>
            )
          })}
        </div>

        {/* Row 2 — offset for stagger effect */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:ml-[6.25%]">
          {row2.map((item, i) => {
            const Icon = ICON_MAP[item.icon] ?? Plug
            return (
              <div
                key={`${item.name}-r2-${i}`}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-4 border border-gray-100 bg-white shadow-sm",
                  (item as { faded?: boolean }).faded && "opacity-40"
                )}
              >
                <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center", item.color)}>
                  <Icon className={cn("h-5 w-5", item.iconColor)} />
                </div>
                <span className="text-[10px] text-center font-medium text-gray-600 leading-tight">{item.name}</span>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

/* ─── Pricing ────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/ month",
      description: "Perfect for solo practitioners",
      features: ["50 calls/month", "Google Calendar sync", "SMS & email confirmations", "Basic analytics"],
      cta: "Get started free",
      href: "/register",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$49",
      period: "/ month",
      description: "For busy practices",
      features: ["Unlimited calls", "Priority support", "Custom greeting", "Advanced analytics", "Multiple languages", "Emergency routing"],
      cta: "Start free trial",
      href: "/register",
      highlight: true,
    },
    {
      name: "Clinic",
      price: "$149",
      period: "/ month",
      description: "Multi-doctor clinics",
      features: ["Everything in Pro", "Multiple doctors", "Team dashboard", "Custom integrations", "Dedicated support", "SLA guarantee"],
      cta: "Contact us",
      href: "/register",
      highlight: false,
    },
  ]

  return (
    <section id="pricing" className="bg-[#050807] py-28 lg:py-36 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex justify-center mb-6">
          <span className="section-label-dark">✦ Pricing</span>
        </div>
        <h2 className="text-center text-4xl lg:text-5xl font-bold text-white leading-[1.1] tracking-tight mb-4">
          Simple, transparent pricing
        </h2>
        <p className="text-center text-lg text-gray-400 mb-16">Start for free. No credit card required.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.name}
              className={cn(
                "relative rounded-2xl p-8 lg:p-9 flex flex-col",
                plan.highlight
                  ? "bg-[#1d6b4a] border border-[#2d9e6e]/50 shadow-glow-lg"
                  : "bg-white/[0.03] border border-white/[0.08]"
              )}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1d6b4a] shadow-sm">
                    <Star className="h-3 w-3 fill-current" /> Most popular
                  </span>
                </div>
              )}
              <div className="mb-6">
                <p className={cn("text-sm font-semibold mb-1", plan.highlight ? "text-emerald-200" : "text-gray-400")}>{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className={cn("text-sm mb-1.5", plan.highlight ? "text-emerald-200" : "text-gray-500")}>{plan.period}</span>
                </div>
                <p className={cn("text-xs mt-2", plan.highlight ? "text-emerald-200" : "text-gray-500")}>{plan.description}</p>
              </div>
              <ul className="space-y-2.5 flex-1 mb-7">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={cn("h-4 w-4 shrink-0", plan.highlight ? "text-white" : "text-emerald-500")} />
                    <span className={plan.highlight ? "text-emerald-50" : "text-gray-300"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className={cn(
                  "block text-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-150",
                  plan.highlight
                    ? "bg-[#b9f264] text-[#0a0f0d] hover:brightness-105"
                    : "bg-white/[0.08] text-white border border-white/15 hover:bg-white/15"
                )}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ Section ────────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  const faqs = [
    {
      q: "How long does setup take?",
      a: "Most clinics are live in under 3 minutes. You create your account, connect your Google Calendar, record or type your greeting, and forward your clinic number. No technical knowledge required.",
    },
    {
      q: "Do I need to change my clinic's phone number?",
      a: "No. You keep your existing number. You simply set up a call forward to your Glork number. Patients call the same number they always have — Glork answers on your behalf.",
    },
    {
      q: "Is Glork HIPAA compliant?",
      a: "Glork is built with HIPAA compliance in mind. Call recordings, transcripts, and patient data are encrypted at rest and in transit. We do not sell or share any patient information. A BAA is available for Pro and Clinic plans.",
    },
    {
      q: "What languages does Glork support?",
      a: "Glork currently supports English, Hindi, and Tamil. Additional languages are on our roadmap. The AI automatically detects the caller's preferred language within the first few seconds.",
    },
    {
      q: "How does Glork handle medical emergencies?",
      a: "Glork is trained to detect emergency language — chest pain, difficulty breathing, etc. — and immediately warm-transfers the call to your designated emergency contact. It also provides the local emergency services number if configured.",
    },
  ]

  return (
    <section className="bg-white py-28 lg:py-36 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left col */}
          <div className="lg:sticky lg:top-28">
            <span className="section-label-light mb-6 inline-flex">✦ FAQ</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-[1.1] tracking-tight mb-6">
              Common questions,<br />straight answers.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              Can't find what you're looking for?<br />We're happy to help within one business day.
            </p>
            <a href="mailto:support@glork.ai" className="btn-dark-on-light">
              Contact us <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          {/* Right col — accordion */}
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="py-5">
                <button
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-base font-semibold text-gray-900">{faq.q}</span>
                  <span className="shrink-0 h-7 w-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500">
                    {open === i
                      ? <Minus className="h-3.5 w-3.5" />
                      : <Plus className="h-3.5 w-3.5" />
                    }
                  </span>
                </button>
                {open === i && (
                  <p className="mt-4 text-sm text-gray-500 leading-relaxed pr-12 animate-fade-in">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

/* ─── Final CTA ──────────────────────────────────────────────── */
function CTA() {
  return (
    <section className="bg-[#0a0f0d] py-28 lg:py-36 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#1d6b4a]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-[1.05] tracking-tight">
          Ready to stop missing<br />patient calls?
        </h2>
        <p className="text-lg text-gray-400 mb-10">
          Set up your AI receptionist in 3 minutes. Free to start.
        </p>
        <Link href="/register" className="btn-lime-lg">
          Create your free account <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-5 text-sm text-gray-600">No credit card · Cancel anytime</p>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const companyLinks = ["About", "Features", "Pricing", "Blog", "Careers"]
  const legalLinks = ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"]

  return (
    <footer className="bg-[#0a0f0d] pb-12 px-6">
      <div className="max-w-6xl mx-auto rounded-2xl bg-white px-8 lg:px-12 py-12 shadow-footer-card">

        {/* Top row — 4 columns */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Col 1: Logo + tagline */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d6b4a]">
                <Phone className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-bold text-gray-900">Glork</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[180px]">
              The AI receptionist for modern clinics.
            </p>
          </div>

          {/* Col 2: Company */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Stay updated</p>
            <p className="text-sm text-gray-500 mb-4 leading-relaxed">Product updates, no spam.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="you@clinic.com"
                className="flex-1 min-w-0 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1d6b4a]/30 focus:border-[#1d6b4a]/50"
              />
              <button
                type="button"
                className="rounded-full bg-[#0f1f17] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1d6b4a] transition-colors shrink-0"
              >
                →
              </button>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2025 Glork Technologies, Inc. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {(
              [
                { Icon: Twitter, label: "Twitter" },
                { Icon: Linkedin, label: "LinkedIn" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Facebook, label: "Facebook" },
              ] as const
            ).map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <Stats />
      <IntegrationsSection />
      <Pricing />
      <FAQSection />
      <CTA />
      <Footer />
    </>
  )
}
