import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Mic,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react"
import { Logo } from "@/components/ui/logo"

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

export default function LandingPage() {
  return (
    <div className="bg-[#081120] text-white">
      <header className="fixed inset-x-0 top-4 z-50 px-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-[24px] border border-white/10 bg-[#0b1728]/85 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-8 w-8 rounded-xl" />
            <span className="font-serif text-[22px] tracking-tight text-white">Hyperglork</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {[
              { href: "#product", label: "Product" },
              { href: "#workflow", label: "Workflow" },
              { href: "#proof", label: "Proof" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm text-white/75 transition-colors hover:bg-white/8 hover:text-white sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#081120] transition-transform hover:-translate-y-0.5"
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-grid relative overflow-hidden px-4 pb-20 pt-32 sm:px-6 lg:px-8">
          <div className="hero-orb absolute -left-16 top-20 h-80 w-80 blur-3xl" />
          <div className="hero-orb absolute right-0 top-0 h-[26rem] w-[26rem] opacity-80 blur-3xl" />

          <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-3xl">
              <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/75">
                <Sparkles className="h-3.5 w-3.5 text-[#78b9ff]" />
                Inspired by editorial SaaS, rebuilt for clinics
              </span>

              <h1 className="mt-7 font-serif text-[3.4rem] leading-[0.95] tracking-tight text-white md:text-[5.4rem]">
                The AI receptionist
                <br />
                for clinics that want
                <span className="block text-[#8fc6ff]">calmer mornings.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
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

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {proof.map((item) => (
                  <div key={item.label} className="glass-dark rounded-[24px] px-5 py-4">
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-white/58">{item.label}</p>
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
                        <p className="mt-1 text-base font-semibold text-white">New patient consultation</p>
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
                        <p className="mt-1 text-3xl font-semibold text-white">18</p>
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

        <section id="product" className="bg-[#f6f8fc] px-4 py-24 text-ink sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="max-w-2xl">
              <span className="eyebrow">Product</span>
              <h2 className="mt-5 font-serif text-5xl leading-tight text-ink">
                A quieter front desk, without losing clinical control.
              </h2>
              <p className="mt-4 text-lg leading-8 text-ink-4">
                The old interface looked generic and crowded. This rebuild makes the product feel more deliberate:
                more like a command center, less like a template.
              </p>
            </div>

            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="section-frame p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-ink">{feature.title}</h3>
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
              <h2 className="mt-5 font-serif text-5xl leading-tight text-ink">
                Designed around the rhythm of a real clinic day.
              </h2>
              <p className="mt-4 text-base leading-8 text-ink-4">
                Hyperglork is strongest when the day gets messy: phones ringing during consults, reminders stacking up,
                and staff needing one source of truth for what happened.
              </p>
            </div>

            <div className="space-y-5">
              {workflow.map((item, index) => (
                <div key={item} className="surface-card flex gap-5 p-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                    0{index + 1}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-ink">{item}</p>
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
                <h2 className="mt-5 font-serif text-4xl leading-tight text-white md:text-5xl">
                  Notemind’s confidence, translated into a more clinical operating surface.
                </h2>
                <p className="mt-4 text-base leading-8 text-white/62">
                  The reference I pulled from is strongest in typography, contrast, and restraint. This version applies
                  those cues to Glork’s healthcare workflow instead of copying another product’s content or IA.
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
              <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
                Give your clinic a front desk that does not drop the thread.
              </h2>
              <p className="mt-4 text-base leading-8 text-ink-4">
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
    </div>
  )
}
