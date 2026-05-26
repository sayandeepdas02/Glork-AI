"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  ArrowRight, Calendar, Check, CheckCircle2, Clock,
  Phone, Shield, Sparkles, Star, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

/* ─── Navbar ─────────────────────────────────────────────── */
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
          {["Features", "How it works", "Pricing"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-150">
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
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1d6b4a] hover:bg-[#2d9e6e] px-4 py-2 text-sm font-semibold text-white transition-all duration-150 shadow-glow">
            Get started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0a0f0d] flex items-center overflow-hidden hero-glow">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#1d6b4a]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#1d6b4a]/05 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Copy */}
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              AI-powered medical receptionist
            </div>

            <h1 className="text-5xl lg:text-[4.25rem] font-bold text-white leading-[1.06] tracking-tight mb-6">
              Never miss a<br />
              patient call<br />
              <span className="gradient-text-light">again.</span>
            </h1>

            <p className="text-lg text-gray-400 leading-relaxed max-w-md mb-10">
              Glork's AI answers every call 24/7, books appointments straight
              into Google Calendar, and sends confirmations — so you can focus
              on medicine, not admin.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-3 mb-8">
              <Link href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-[#1d6b4a] hover:bg-[#2d9e6e] px-7 py-3.5 text-base font-semibold text-white transition-all duration-200 shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5">
                Start for free <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#how-it-works"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-7 py-3.5 text-base font-medium text-gray-300 hover:text-white transition-all duration-200">
                See how it works
              </a>
            </div>

            <p className="text-sm text-gray-600">
              No credit card · Live in 3 minutes · Free forever plan
            </p>
          </div>

          {/* Visual mockup */}
          <div className="relative h-[460px] hidden lg:block">
            {/* Main card: live call */}
            <div className="absolute top-0 right-0 w-[300px] rounded-2xl bg-[#0f1f17] border border-emerald-900/40 p-5 shadow-dark-card animate-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#1d6b4a] flex items-center justify-center">
                    <Phone className="h-4.5 w-4.5 text-white" />
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
                <div className="rounded-xl rounded-tr-none bg-white/8 px-3.5 py-2.5 text-xs text-gray-300 leading-relaxed ml-6">
                  "Of course! I have 10:00 AM and 10:30 AM available. Which works better?"
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-1 flex-1 rounded-full bg-emerald-600/40">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${[70,100,45,80][i-1]}%` }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Stats card */}
            <div className="absolute top-44 left-0 w-44 rounded-xl bg-[#0f1f17] border border-white/8 p-4 shadow-dark-card">
              <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1.5">This month</p>
              <p className="text-3xl font-bold text-white">48</p>
              <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                <span>↑</span> 12 more than last month
              </p>
            </div>

            {/* Booking confirmed notification */}
            <div className="absolute bottom-16 right-4 w-[260px] rounded-2xl bg-white p-4 shadow-dark-card">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
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

            {/* Small dot decorations */}
            <div className="absolute top-24 left-28 h-2 w-2 rounded-full bg-emerald-500/40" />
            <div className="absolute bottom-40 left-10 h-1.5 w-1.5 rounded-full bg-emerald-500/30" />
            <div className="absolute top-8 left-48 h-1 w-1 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-20 pt-12 border-t border-white/5">
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

/* ─── Features ───────────────────────────────────────────── */
function Features() {
  const features = [
    {
      icon: Phone,
      color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      title: "24/7 Call Answering",
      description: "The AI picks up every call — after hours, weekends, public holidays. Never a busy signal, never voicemail.",
    },
    {
      icon: Calendar,
      color: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      title: "Smart Scheduling",
      description: "Checks your live Google Calendar availability and slots new bookings in real time. Zero double-booking.",
    },
    {
      icon: Zap,
      color: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      title: "Instant Confirmations",
      description: "SMS and email confirmations with calendar invites sent the moment a booking is made — automatically.",
    },
    {
      icon: Shield,
      color: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      title: "Emergency Handling",
      description: "The AI recognises urgent calls and transfers them directly to your emergency contact number.",
    },
    {
      icon: Sparkles,
      color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      title: "Multilingual",
      description: "Supports English, Hindi, and Tamil. Patients can speak in their preferred language.",
    },
    {
      icon: Clock,
      color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      title: "Custom Hours",
      description: "Set your working hours per day of the week. The AI only books appointments within your schedule.",
    },
  ]

  return (
    <section id="features" className="bg-[#050807] py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">Features</p>
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything your clinic needs
          </h2>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            Glork handles the entire receptionist workflow so your staff can focus on patients in the clinic.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title}
              className="group rounded-2xl border border-white/5 bg-white/3 p-6 hover:bg-white/6 hover:border-white/10 transition-all duration-200">
              <div className={cn("inline-flex h-11 w-11 items-center justify-center rounded-xl border mb-4", f.color)}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── How it works ───────────────────────────────────────── */
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
    <section id="how-it-works" className="bg-[#0a0f0d] py-28 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">How it works</p>
          <h2 className="text-4xl font-bold text-white mb-4">Up and running in minutes</h2>
          <p className="text-lg text-gray-400 max-w-lg mx-auto">
            No hardware, no complex integrations. Just three steps to a fully automated reception desk.
          </p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
          {steps.map((step) => (
            <div key={step.n} className="relative flex flex-col items-start">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 mb-6">
                <span className="text-lg font-bold text-emerald-400 font-mono">{step.n}</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Stats ──────────────────────────────────────────────── */
function Stats() {
  const items = [
    { value: "3 min", label: "Average setup time" },
    { value: "24/7", label: "Call coverage" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "15+", label: "Languages supported" },
  ]

  return (
    <section className="bg-[#1d6b4a] py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {items.map((item) => (
            <div key={item.label}>
              <p className="text-4xl font-bold text-white mb-2">{item.value}</p>
              <p className="text-sm text-emerald-200">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Pricing teaser ─────────────────────────────────────── */
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
    <section id="pricing" className="bg-[#050807] py-28 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">Pricing</p>
          <h2 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-gray-400">Start for free. No credit card required.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div key={plan.name}
              className={cn(
                "relative rounded-2xl p-7 flex flex-col",
                plan.highlight
                  ? "bg-[#1d6b4a] border border-[#2d9e6e]/50 shadow-glow-lg"
                  : "bg-white/3 border border-white/8"
              )}>
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1d6b4a]">
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
                  "block text-center rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-150",
                  plan.highlight
                    ? "bg-white text-[#1d6b4a] hover:bg-emerald-50"
                    : "bg-white/10 text-white border border-white/15 hover:bg-white/15"
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

/* ─── Final CTA ──────────────────────────────────────────── */
function CTA() {
  return (
    <section className="bg-[#0a0f0d] py-28 border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
          Ready to stop missing<br />patient calls?
        </h2>
        <p className="text-lg text-gray-400 mb-10">
          Set up your AI receptionist in 3 minutes. Free to start.
        </p>
        <Link href="/register"
          className="inline-flex items-center gap-2 rounded-xl bg-[#1d6b4a] hover:bg-[#2d9e6e] px-8 py-4 text-base font-semibold text-white transition-all duration-200 shadow-glow hover:shadow-glow-lg hover:-translate-y-0.5">
          Create your free account <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-5 text-sm text-gray-600">No credit card · Cancel anytime</p>
      </div>
    </section>
  )
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[#050807] border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#1d6b4a]">
              <Phone className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Glork</span>
          </div>
          <div className="flex items-center gap-8">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a key={l} href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">{l}</a>
            ))}
          </div>
          <p className="text-xs text-gray-700">© 2025 Glork. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Pricing />
      <CTA />
      <Footer />
    </>
  )
}
