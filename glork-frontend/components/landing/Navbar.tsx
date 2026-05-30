"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Menu, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [scrolled, setScrolled]               = useState(false)
  const [mobileOpen, setMobileOpen]           = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const navLinks = ["Features", "How it works", "Pricing"]

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-[#0C0A09]/90 backdrop-blur-xl border-b border-white/5 py-3"
            : "bg-transparent py-5"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] shadow-glow-sm transition-all duration-200 group-hover:shadow-glow">
              <Zap className="h-4 w-4 text-white fill-white" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">Glork</span>
            <span className="hidden sm:inline-flex items-center rounded-full border border-[#FF5500]/30 bg-[#FF5500]/10 px-2 py-0.5 text-[10px] font-semibold text-[#FF7733] uppercase tracking-wider">
              beta
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-[#8A8480] hover:text-white transition-colors duration-150 relative
                  after:absolute after:bottom-[-2px] after:left-0 after:h-[1px] after:w-full
                  after:origin-right after:scale-x-0 after:bg-[#FF5500]
                  after:transition-transform after:duration-300
                  hover:after:origin-left hover:after:scale-x-100"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="text-sm text-[#8A8480] hover:text-white transition-colors duration-150 px-3 py-1.5"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="btn-shine inline-flex items-center gap-1.5 rounded-lg bg-[#FF5500] hover:bg-[#FF7733]
                px-4 py-2 text-sm font-semibold text-white transition-colors duration-150 shadow-glow-sm"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="md:hidden p-2 text-[#8A8480] hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="md:hidden absolute top-full inset-x-0 bg-[#0C0A09]/95 backdrop-blur-xl border-b border-white/5">
            <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-[#8A8480] hover:text-white transition-colors py-2 border-b border-white/5"
                >
                  {item}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" className="text-sm text-[#8A8480] hover:text-white py-2 transition-colors">
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  className="btn-shine inline-flex items-center justify-center gap-2 rounded-lg bg-[#FF5500]
                    px-5 py-3 text-sm font-semibold text-white shadow-glow-sm"
                >
                  Get started <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
