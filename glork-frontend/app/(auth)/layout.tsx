import Link from "next/link"
import { ArrowUpRight, Calendar, CheckCircle2, Phone, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const HIGHLIGHTS = [
  { icon: Phone, text: "Answers every patient call without front-desk bottlenecks" },
  { icon: Calendar, text: "Books directly into your live Google Calendar" },
  { icon: CheckCircle2, text: "Sends confirmations automatically after each booking" },
  { icon: Shield, text: "Escalates urgent calls using clinic-specific rules" },
]

const METRICS = [
  { value: "24/7", label: "Inbound coverage" },
  { value: "3 min", label: "Typical setup time" },
  { value: "15+", label: "Languages supported" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-[#111111] lg:grid-cols-[minmax(0,1.15fr)_minmax(440px,0.85fr)]">
      <div className="relative hidden overflow-hidden border-r border-white/8 lg:flex">
        <div className="hero-image-surface absolute inset-0" />
        <div className="absolute inset-0 bg-black/42" />

        <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-10 w-10 rounded-xl" />
              <span className="text-lg font-semibold tracking-tight text-white">Hyperglork</span>
            </Link>
            <span className="rounded-full border border-white/12 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/48">
              Clinic OS
            </span>
          </div>

          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />
              Professional call handling
            </span>
            <h1 className="mt-8 font-serif text-6xl leading-[0.95] tracking-[-0.04em] text-white">
              A sharper front
              <br />
              desk experience,
              <br />
              built into software.
            </h1>
            <p className="mt-7 max-w-lg text-[17px] leading-8 text-white/58">
              Hyperglork gives clinics a more responsive call flow, clearer scheduling,
              and calmer operations without adding manual coordination.
            </p>

            <div className="mt-10 grid gap-3">
              {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                <div key={text} className="dark-panel-surface flex items-center gap-3 rounded-[22px] px-4 py-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/[0.05] text-[var(--brand)]">
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm leading-6 text-white/66">{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
            <div className="dark-panel-surface rounded-[26px] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/36">
                Trusted by clinics
              </p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["DR", "JK", "MV", "SS"].map((initials) => (
                    <div
                      key={initials}
                      className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#111111] bg-[var(--brand)] text-[10px] font-bold text-[#111111]"
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">500+ clinics onboarded</p>
                  <p className="mt-1 text-sm text-white/44">Responsive call handling without full-time reception overhead</p>
                </div>
              </div>
            </div>

            <div className="rounded-[26px] border border-white/10 bg-white/[0.03] p-5">
              <div className="space-y-4">
                {METRICS.map((item) => (
                  <div key={item.label}>
                    <p className="font-serif text-3xl leading-none tracking-tight text-white">{item.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-white/36">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex min-h-screen items-center justify-center bg-[var(--bg-surface)] px-5 py-8 sm:px-8 lg:px-12">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at top, rgba(255,106,0,0.12), transparent 25%), linear-gradient(to bottom, rgba(255,255,255,0.55), rgba(247,245,240,0.92))",
          }}
        />
        <div className="relative w-full max-w-[460px]">
          <Link href="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <Logo className="h-9 w-9 rounded-xl" />
            <span className="text-base font-semibold tracking-tight text-[var(--text-primary)]">Hyperglork</span>
          </Link>

          <div className="panel-surface rounded-[32px] p-6 sm:p-8">
            {children}
          </div>

          <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[12px] text-[var(--text-faint)]">
            Need product help?
            <Link href="/" className="inline-flex items-center gap-1 font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--brand-dark)]">
              Learn more
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
