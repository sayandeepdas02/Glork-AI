"use client"

import Link from "next/link"
import { Zap, Twitter, Github, Mail } from "lucide-react"

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
}

export default function Footer() {
  return (
    <footer className="bg-[#0C0A09] border-t border-white/5">

      {/* ── Main footer ── */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-16">

          {/* Brand col */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF5500] shadow-glow-sm transition-all group-hover:shadow-glow">
                <Zap className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-base font-bold text-white">Glork</span>
            </Link>
            <p className="text-sm text-[#4A4540] leading-relaxed max-w-xs mb-6">
              AI-powered voice receptionist for doctors. Answer every call,
              book every appointment, never miss a patient.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              {[
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Github,  href: "#", label: "GitHub" },
                { Icon: Mail,    href: "mailto:hello@glork.ai", label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/8 bg-white/4 text-[#4A4540] hover:text-white hover:border-[#FF5500]/30 hover:bg-[#FF5500]/10 transition-all duration-150"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10px] font-mono font-semibold text-[#4A4540] uppercase tracking-[0.2em] mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-[#8A8480] hover:text-white transition-colors duration-150"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#4A4540] font-mono">
            © {new Date().getFullYear()} Glork Technologies. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-[#FF5500] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF5500]" />
            </span>
            <span className="text-xs text-[#4A4540] font-mono">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
