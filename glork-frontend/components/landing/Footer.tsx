"use client"

import Link from "next/link"

const links = [
  "The Problem",
  "Solution",
  "Enterprise",
  "Results",
  "FAQ's",
]

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#141414] text-white">
      <div className="section-shell py-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="grid gap-4 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((link) => (
              <div key={link}>{link}</div>
            ))}
          </div>

          <div className="flex items-center gap-5 text-2xl text-white/76">
            <span>✦</span>
            <span>◌</span>
          </div>
        </div>

        <div className="mt-12 border-t border-white/8 pt-6">
          <Link href="/" className="text-sm text-white/48">
            © {new Date().getFullYear()} Hyperglork
          </Link>
        </div>
      </div>
    </footer>
  )
}
