import Link from "next/link"
import { Calendar, CheckCircle2, Phone, Shield } from "lucide-react"

const HIGHLIGHTS = [
  { icon: Phone, text: "Answers every patient call, 24/7" },
  { icon: Calendar, text: "Books directly to Google Calendar" },
  { icon: CheckCircle2, text: "SMS & email confirmations, automatically" },
  { icon: Shield, text: "Emergency call routing built-in" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-[#0a0f0d]">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#0a0f0d] overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#1d6b4a]/15 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#1d6b4a]/8 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-25 pointer-events-none" />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1d6b4a] shadow-glow">
            <Phone className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Glork</span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="text-4xl font-bold text-white leading-tight mb-5">
            Your clinic's AI receptionist,<br />
            <span className="gradient-text-light">always on call.</span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-sm">
            Set up once, run forever. Glork handles patient calls, appointments,
            and reminders so you never miss a booking.
          </p>
          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                  <Icon className="h-4 w-4 text-emerald-400" />
                </div>
                <span className="text-sm text-gray-300">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
            <div className="flex -space-x-2">
              {["bg-emerald-500", "bg-blue-500", "bg-amber-500", "bg-purple-500"].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-[#0a0f0d] flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-white">{["DR","JK","MV","SS"][i]}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">500+ clinics</p>
              <p className="text-xs text-gray-400">already using Glork</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 lg:p-16 bg-white relative">
        {/* Subtle top gradient */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#1d6b4a] via-[#2d9e6e] to-[#1d6b4a]" />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1d6b4a]">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Glork</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
