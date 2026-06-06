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
      <div className="max-w-[1200px] mx-auto px-5 pt-4">
        <div className="flex items-center justify-between h-14 px-5 bg-white/95 backdrop-blur-md border border-[#E5E5E0] rounded-2xl shadow-[0_2px_20px_rgba(0,0,0,0.07)]">

          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo className="w-8 h-8 rounded-lg" />
            <span className="text-[15px] font-semibold text-[#0F0F0F] tracking-tight">Hyperglork</span>
            <span className="ml-0.5 rounded-full border border-[#E5E5E0] bg-[#F9F9F7] px-2 py-0.5 text-[9px] text-[#9B9B9B] uppercase tracking-widest font-medium">
              Beta
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[14px] text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors duration-150 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <Link
              href="/login"
              className="text-[14px] text-[#6B6B6B] hover:text-[#0F0F0F] transition-colors duration-150 font-medium"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold bg-[#F5E040] text-[#0F0F0F] hover:bg-[#F8EC70] transition-colors rounded-xl"
            >
              Get started →
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg text-[#6B6B6B] hover:text-[#0F0F0F] hover:bg-[#F2F2EE] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden max-w-[1200px] mx-auto px-5 pt-2">
          <div className="bg-white border border-[#E5E5E0] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] px-4 py-4 space-y-1">
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] font-medium text-[#4A4A4A] hover:text-[#0F0F0F] hover:bg-[#F9F9F7] rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[#E5E5E0] mt-2 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-[14px] font-medium text-[#4A4A4A] hover:text-[#0F0F0F] hover:bg-[#F9F9F7] rounded-xl transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center px-4 py-2.5 text-[14px] font-semibold bg-[#F5E040] text-[#0F0F0F] rounded-xl hover:bg-[#F8EC70] transition-colors"
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
