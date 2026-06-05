"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const NAV_LINKS = [
  { label: "Features",     href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing",      href: "#pricing" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full">
      {/* Pill navbar */}
      <div className="max-w-[1200px] mx-auto px-6 pt-3">
        <div className="flex items-center justify-between h-14 px-5 bg-white/90 backdrop-blur-md border border-[#E8E8E3] rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.06)]">

          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg">
              <Logo className="w-full h-full rounded-lg" />
            </div>
            <span className="text-[15px] text-[#111]">Glork</span>
            <span className="ml-0.5 rounded border border-brand/20 bg-brand/5 px-1.5 py-0.5 text-[9px] text-brand uppercase tracking-widest">
              Beta
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[14px] text-[#666] hover:text-[#111] transition-colors duration-150"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-[14px] text-[#666] hover:text-[#111] transition-colors duration-150"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] bg-brand text-white hover:bg-brand-light transition-colors rounded-xl"
            >
              Get started →
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded text-[#666] hover:text-[#111] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden max-w-[1200px] mx-auto px-6 pt-2">
          <div className="bg-white border border-[#E8E8E3] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-5 py-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] text-[#555] hover:text-[#111] hover:bg-[#F5F5F2] rounded-lg transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#EAEAE5] mt-3 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] text-[#555] hover:text-[#111] hover:bg-[#F5F5F2] rounded-lg transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 text-[14px] bg-brand text-white rounded-xl hover:bg-brand-light transition-colors"
              >
                Get started →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
