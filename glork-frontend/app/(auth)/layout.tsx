import Link from "next/link"
import { Activity, CalendarClock, PhoneCall, Shield, Sparkles } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const highlights = [
  { icon: PhoneCall, text: "AI answers every inbound patient call" },
  { icon: CalendarClock, text: "Books directly into your live calendar" },
  { icon: Shield, text: "Flags urgent situations for human follow-up" },
  { icon: Activity, text: "Keeps a clean operational history for the team" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#081120] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
      <div className="hero-grid relative hidden overflow-hidden lg:flex">
        <div className="hero-orb absolute -left-20 top-20 h-80 w-80 blur-3xl" />
        <div className="hero-orb absolute bottom-0 right-0 h-[26rem] w-[26rem] opacity-70 blur-3xl" />

        <div className="relative flex w-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-3">
            <Logo className="h-10 w-10 rounded-2xl" />
            <span className="font-serif text-[24px] tracking-tight text-white">Hyperglork</span>
          </Link>

          <div className="max-w-xl">
            <span className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/68">
              <Sparkles className="h-3.5 w-3.5 text-[#8fc6ff]" />
              A calmer clinical front desk
            </span>

            <h1 className="mt-8 font-serif text-[4.5rem] leading-[0.96] tracking-tight text-white">
              Your clinic’s new
              <span className="block text-[#8fc6ff]">first response.</span>
            </h1>

            <p className="mt-6 max-w-lg text-[17px] leading-8 text-white/60">
              Hyperglork keeps your practice reachable without forcing the team to live inside the phone queue.
              Sign in to manage the operating surface, not just a settings page.
            </p>

            <div className="mt-10 grid gap-3">
              {highlights.map((item) => (
                <div key={item.text} className="glass-dark flex items-center gap-3 rounded-[22px] px-4 py-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/8 text-[#9fd0ff]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="text-sm text-white/74">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-dark max-w-md rounded-[28px] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/44">Operator note</p>
            <p className="mt-3 text-sm leading-7 text-white/68">
              The new frontend keeps the same product behavior, but the visual model is now closer to a premium
              operating console than a generic SaaS dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#f8fbff_0%,#eff5fd_100%)] px-5 py-8 sm:px-8 lg:px-12">
        <div className="w-full max-w-[430px]">
          <Link href="/" className="mb-10 flex items-center gap-3 lg:hidden">
            <Logo className="h-9 w-9 rounded-xl" />
            <span className="font-serif text-[23px] tracking-tight text-ink">Hyperglork</span>
          </Link>

          <div className="surface-card p-7 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
