import Link from "next/link"
import { CalendarClock, PhoneCall, Shield, Activity } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const highlights = [
  { icon: PhoneCall,     text: "AI answers every inbound patient call" },
  { icon: CalendarClock, text: "Books directly into your live calendar" },
  { icon: Shield,        text: "Flags urgent situations for human follow-up" },
  { icon: Activity,      text: "Keeps a clean operational history for the team" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] lg:grid lg:grid-cols-[1.1fr_0.9fr]">

      {/* ── Left panel ── */}
      <div className="relative hidden overflow-hidden lg:flex">
        <div className="relative flex w-full flex-col justify-between p-12 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7 rounded-md shrink-0" />
            <span className="text-[15px] font-medium tracking-tight text-white">Hyperglork</span>
          </Link>

          {/* Copy */}
          <div className="max-w-lg">
            <p className="text-[11px] font-normal tracking-[0.06em] text-[#6B7280] mb-5 uppercase">
              AI-powered clinic front desk
            </p>
            <h1 className="text-[3.5rem] font-light leading-[1.05] tracking-[-0.03em] text-white">
              Your clinic&rsquo;s new<br />first response.
            </h1>
            <p className="mt-5 text-[14px] font-light text-[#6B7280] leading-relaxed max-w-sm">
              Hyperglork keeps your practice reachable without forcing the team to live inside the phone queue.
            </p>

            <div className="mt-8 space-y-2">
              {highlights.map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-3 rounded-lg border border-white/6 bg-white/[0.03] px-4 py-3"
                >
                  <item.icon className="h-4 w-4 shrink-0 text-[#6B7280]" strokeWidth={1.5} />
                  <p className="text-[13px] font-light text-[#6B7280]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div className="rounded-lg border border-white/6 bg-white/[0.03] p-4 max-w-sm">
            <p className="text-[10px] font-medium uppercase tracking-[0.10em] text-[#444444] mb-1.5">
              Operator note
            </p>
            <p className="text-[12px] font-light leading-6 text-[#444444]">
              Review live call summaries, tune agent behavior, and manage appointment flow — from a single console.
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex min-h-screen items-center justify-center bg-white px-6 py-10 sm:px-8 lg:px-12">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo className="h-6 w-6 rounded-md" />
            <span className="text-[14px] font-medium tracking-tight text-[#111111]">Hyperglork</span>
          </Link>

          {/* Form container — no card shadow on desktop, just content */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
