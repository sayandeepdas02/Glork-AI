"use client"

import Link from "next/link"
import { Twitter, Github, Mail } from "lucide-react"
import { Panel } from "@/components/ui/panel"
import { Logo } from "@/components/ui/logo"

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
}

export default function Footer() {
  return (
    <Panel className="bg-background border-t-0">

      {/* ── Main footer ── */}
      <div className="px-8 py-16 grid grid-cols-1 md:grid-cols-5 gap-12 lg:gap-16 border-b border-edge">

        {/* Brand col */}
        <div className="md:col-span-2 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group mb-6">
            <div className="flex h-7 w-7 items-center justify-center rounded transition-transform group-hover:scale-105">
              <Logo className="w-full h-full rounded" />
            </div>
            <span className="text-[15px] font-bold text-white tracking-tight font-sans">Glork</span>
          </Link>
          
          <p className="text-[13px] text-white/80 leading-[1.6] max-w-xs mb-8 font-sans">
            AI-powered voice receptionist for doctors. Answer every call,
            book every appointment, never miss a patient.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-3 mt-auto">
            {[
              { Icon: Twitter, href: "#", label: "Twitter" },
              { Icon: Github,  href: "#", label: "GitHub" },
              { Icon: Mail,    href: "mailto:hello@glork.ai", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded border border-edge bg-white/5 text-white/70 hover:text-white hover:border-brand/30 hover:bg-brand/10 transition-all duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Link cols */}
        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-[11px] font-mono font-bold text-white/90 uppercase tracking-[0.2em] mb-6">
              {group}
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-white/70 hover:text-white transition-colors duration-150 font-sans"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/20">
        <p className="text-[11px] text-white/60 font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} Glork Technologies
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
          </span>
          <span className="text-[11px] text-white/60 font-mono uppercase tracking-widest">All systems operational</span>
        </div>
      </div>
    </Panel>
  )
}
