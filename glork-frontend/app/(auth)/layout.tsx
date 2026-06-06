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
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-[#0F0F0F]">

      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#0F0F0F] overflow-hidden">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Yellow radial glow */}
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,224,64,0.08), transparent 70%)", transform: "translate(-30%, 30%)" }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <Logo className="w-9 h-9 rounded-xl" />
          <span className="text-[19px] font-semibold text-white tracking-tight">Hyperglork</span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="font-serif text-[2.5rem] font-normal text-white leading-[1.1] tracking-tight mb-5">
            Your clinic&rsquo;s AI receptionist,<br />
            <span className="text-[#F5E040]">always on call.</span>
          </h1>
          <p className="text-white/45 text-[15px] leading-relaxed mb-10 max-w-sm">
            Set up once, run forever. Hyperglork handles patient calls, appointments,
            and reminders so you never miss a booking.
          </p>
          <div className="space-y-4">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <Icon className="h-4 w-4 text-[#F5E040]" />
                </div>
                <span className="text-[14px] text-white/65">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/3 p-4">
            <div className="flex -space-x-2">
              {["#0F0F0F", "#1A1A1A", "#0F0F0F", "#1A1A1A"].map((bg, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#F5E040] flex items-center justify-center"
                  style={{ background: bg }}
                >
                  <span className="text-[10px] font-bold text-[#F5E040]">{["DR","JK","MV","SS"][i]}</span>
                </div>
              ))}
            </div>
            <div>
              <p className="text-[13px] font-semibold text-white">500+ clinics</p>
              <p className="text-[12px] text-white/40">already using Hyperglork</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex items-center justify-center p-6 lg:p-16 bg-white relative">
        {/* Yellow top accent line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#F5E040]" />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="text-[16px] font-semibold text-[#0F0F0F] tracking-tight">Hyperglork</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
