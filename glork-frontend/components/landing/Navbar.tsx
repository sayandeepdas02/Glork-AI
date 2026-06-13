"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full px-4 pt-4 md:px-6">
      <div className="section-shell">
        <div className="panel-surface rounded-[22px]">
          <div className="flex h-16 items-center justify-between px-5 md:px-6">
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-9 w-9 rounded-xl" />
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-semibold tracking-tight text-[var(--text-primary)]">Hyperglork</span>
                <span className="rounded-full border border-[var(--edge)] bg-[var(--bg-surface)] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--text-faint)]">
                  Beta
                </span>
              </div>
            </Link>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-[14px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                href="/login"
                className="text-[14px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
              >
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#232323]"
              >
                Get started
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen((value) => !value)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-[var(--text-muted)] transition-colors hover:border-[var(--edge)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="border-t border-[var(--edge)] px-4 py-4 md:hidden">
              <div className="space-y-1">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-3 text-[14px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="mt-4 grid gap-2 border-t border-[var(--edge)] pt-4">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-3 text-[14px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#111111] px-4 py-3 text-[14px] font-semibold text-white"
                >
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
