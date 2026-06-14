"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const NAV_LINKS = [
  { label: "The Problem", href: "#problem" },
  { label: "Solution", href: "#solution" },
  { label: "Enterprise", href: "#enterprise" },
  { label: "Results", href: "#results" },
  { label: "FAQ's", href: "#faq" },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="absolute inset-x-0 top-0 z-50 px-5 py-5 md:px-8">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between text-white">
        <Link href="/" className="flex items-center gap-4">
          <Logo className="h-12 w-12 rounded-2xl" />
          <span className="text-[20px] font-semibold tracking-tight">Hyperglork</span>
        </Link>

        <div className="hidden items-center gap-14 lg:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.label} href={item.href} className="text-[15px] font-medium text-white/92 transition-colors hover:text-white">
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-9 py-4 text-[15px] font-semibold text-white transition-colors hover:bg-[var(--brand-light)]"
          >
            Get Started Free
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-xl border border-white/12 bg-white/5 p-3 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mx-auto mt-4 max-w-[1600px] rounded-[28px] border border-white/12 bg-black/85 p-4 backdrop-blur-md lg:hidden">
          <div className="grid gap-2">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-white/82 transition-colors hover:bg-white/6 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex justify-center rounded-full bg-[var(--brand)] px-6 py-3.5 text-sm font-semibold text-white"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
