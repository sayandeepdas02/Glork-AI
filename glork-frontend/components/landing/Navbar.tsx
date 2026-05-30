"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Calendar } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0C0A09]/90 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 h-16 flex items-center justify-between gap-4">

        {/* Left: Logo + wordmark */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105">
            <Logo className="w-full h-full rounded-lg" />
          </div>
          <span className="text-[16px] font-bold text-white tracking-tight font-sans">Glork</span>
          <span className="ml-0.5 rounded border border-brand/30 bg-brand/10 px-1.5 py-0.5 text-[9px] font-bold text-brand uppercase tracking-widest font-mono">
            Beta
          </span>
        </Link>

        {/* Center: Navigation Links — desktop */}
        <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[14px] font-medium text-white/65 hover:text-white transition-colors duration-200 relative after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-full after:origin-right after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: CTA */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          <Link
            href="/dashboard"
            className="text-[14px] font-medium text-white/65 hover:text-white transition-colors duration-200 px-3 py-1.5"
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-lg relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.6)_50%,transparent_75%)] before:bg-[length:250%_250%] before:bg-[position:200%_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-700 hover:before:bg-[position:-100%_0]"
          >
            <Calendar size={13} strokeWidth={2.5} />
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/70 hover:bg-white/8 hover:text-white transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/8 bg-[#0C0A09] px-6 py-5 space-y-1">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-[15px] font-medium text-white/75 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/8 mt-3 flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 text-[15px] font-medium text-white/65 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 text-[14px] font-semibold bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              <Calendar size={14} />
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
