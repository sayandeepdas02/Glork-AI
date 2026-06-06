import React from "react"
import Link from "next/link"
import { Calendar, CheckCircle2, Phone, Shield } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const HIGHLIGHTS = [
  { icon: Phone, text: "Answers every patient call, 24/7" },
  { icon: Calendar, text: "Books directly to Google Calendar" },
  { icon: CheckCircle2, text: "SMS & email confirmations, automatically" },
  { icon: Shield, text: "Emergency call routing built-in" },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.1fr] bg-[#0A0A0A]">
      {/* Left — brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 bg-[#0A0A0A] overflow-hidden">
        {/* Background yellow glow */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#F5E542]/6 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#F5E542]/4 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5">
          <Logo variant="color" className="w-8 h-[38px]" />
          <span className="text-[17px] font-semibold text-white tracking-tight">Hyperglork</span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="text-[2.5rem] font-light text-white leading-[1.1] tracking-tight mb-5">
            Your clinic's AI receptionist,<br />
            <span className="text-[#F5E542]">always on call.</span>
          </h1>
          <p className="text-white/45 text-[14px] leading-relaxed mb-10 max-w-sm">
            Set up once, run forever. Hyperglork handles patient calls, appointments,
            and reminders so you never miss a booking.
          </p>
          <div className="space-y-3.5">
            {HIGHLIGHTS.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#F5E542]/15 bg-[#F5E542]/8">
                  <Icon className="h-4 w-4 text-[#F5E542]" />
                </div>
                <span className="text-[13.5px] text-white/60">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="flex -space-x-2">
              {["bg-[#F5E542]", "bg-blue-500", "bg-emerald-500", "bg-purple-500"].map((c, i) => (
                <div key={i} className={`h-8 w-8 rounded-full ${c} border-2 border-[#0A0A0A] flex items-center justify-center`}>
                  <span className="text-[10px] font-bold text-[#0A0A0A]">{["DR","JK","MV","SS"][i]}</span>
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
        {/* Yellow accent top line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-[#F5E542]" />

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-10 lg:hidden">
            <Logo variant="color" className="w-7 h-[33px]" />
            <span className="text-[16px] font-semibold text-[#0A0A0A] tracking-tight">Hyperglork</span>
          </Link>

          {children}
        </div>
      </div>
    </div>
  )
}
