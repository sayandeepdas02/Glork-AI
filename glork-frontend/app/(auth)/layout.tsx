import Link from "next/link"
import { CalendarClock, PhoneCall, Shield, Activity } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const highlights = [
  { icon: PhoneCall,    text: "AI answers every inbound patient call" },
  { icon: CalendarClock, text: "Books directly into your live calendar" },
  { icon: Shield,       text: "Flags urgent situations for human follow-up" },
  { icon: Activity,     text: "Keeps a clean operational history for the team" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08111E] lg:grid lg:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel (hero) ── */}
      <div className="hero-grid relative hidden overflow-hidden lg:flex">
        {/* Orbs */}
        <div className="hero-orb pointer-events-none absolute -left-24 top-16 h-96 w-96 opacity-70 blur-3xl" />
        <div className="hero-orb pointer-events-none absolute bottom-0 right-0 h-[28rem] w-[28rem] opacity-50 blur-3xl" />

        <div className="relative flex w-full flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-9 w-9 rounded-xl" />
            <span className="font-serif text-[22px] font-semibold tracking-tight text-white">Hyperglork</span>
          </Link>

          {/* Hero copy */}
          <div className="max-w-xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
              AI-powered clinic front desk
            </p>

            <h1 className="font-serif text-[4rem] font-semibold leading-[0.95] tracking-tight text-white">
              Your clinic&rsquo;s new<br />
              <em className="not-italic text-[#7BBEF8]">first response.</em>
            </h1>

            <p className="mt-5 max-w-md text-[16px] leading-8 text-white/55">
              Hyperglork keeps your practice reachable without forcing the team to live inside the phone queue.
            </p>

            <div className="mt-8 space-y-2.5">
              {highlights.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/4 px-4 py-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/8">
                    <item.icon className="h-4 w-4 text-[#7BBEF8]" />
                  </div>
                  <p className="text-[13px] text-white/70">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="rounded-xl border border-white/6 bg-white/4 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 mb-2">
              Operator note
            </p>
            <p className="text-[13px] leading-6 text-white/50">
              Review live call summaries, tune agent behavior, and manage appointment flow — all from a single console.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo className="h-8 w-8 rounded-lg" />
            <span className="font-serif text-[21px] font-semibold tracking-tight text-ink">Hyperglork</span>
          </Link>

          {/* Form card */}
          <div className="rounded-xl border border-gray-100 bg-white p-7 shadow-card-lg sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
