"use client"

import Link from "next/link"
import { Github, Mail, Twitter } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
}

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#111111] text-white">
      <div className="section-shell py-12">
        <div className="grid gap-10 border-b border-white/8 pb-10 lg:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.5fr))]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Logo className="h-9 w-9 rounded-xl" />
              <span className="text-[15px] font-semibold tracking-tight text-white">Hyperglork</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/46">
              AI-powered voice receptionist for clinics that need more professional call handling,
              tighter booking flow, and clearer daily operations.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Github, href: "#", label: "GitHub" },
                { Icon: Mail, href: "mailto:hello@hyperglork.ai", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/50 transition-colors hover:border-white/22 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/32">{group}</p>
              <div className="mt-4 space-y-3">
                {links.map((link) => (
                  <a key={link} href="#" className="block text-sm text-white/52 transition-colors hover:text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 py-6 text-sm text-white/32 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Hyperglork Technologies</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
