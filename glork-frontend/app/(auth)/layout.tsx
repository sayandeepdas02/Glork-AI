import Link from "next/link"
import { Calendar, CheckCircle2, Phone, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const HIGHLIGHTS = [
  { icon: Phone,        text: "Answers every patient call, 24/7" },
  { icon: Calendar,     text: "Books directly to Google Calendar" },
  { icon: CheckCircle2, text: "SMS & email confirmations, automatically" },
  { icon: Shield,       text: "Emergency call routing built-in" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-[#080d0b]">

      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#080d0b] overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-700/12 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-700/8 rounded-full blur-[90px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <Logo className="w-9 h-9 rounded-xl" />
          <span className="text-[20px] font-semibold text-white tracking-tight">Hyperglork</span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="font-serif text-[2.5rem] font-normal text-white leading-[1.1] tracking-tight mb-5">
            Your clinic&rsquo;s AI receptionist,<br />
            <span className="text-emerald-400">always on call.</span>
          </h1>
          <p className="text-white/55 text-[15px] leading-relaxed mb-10 max-w-sm">
            Set up once, run forever. Hyperglork handles patient calls, appointments,
            and reminders so you never miss a booking.
          </p>
          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-[14px] text-white/75">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
            <div className="flex -space-x-2">
              {["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500"].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-[#080d0b] flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">{["DR","JK","MV","SS"][i]}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">500+ clinics</p>
              <p className="text-[12px] text-white/45">already using Hyperglork</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 lg:p-16 bg-white relative">
        {/* Subtle top accent */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-600/30 to-transparent" />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="text-[16px] font-semibold text-[#111] tracking-tight">Hyperglork</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
