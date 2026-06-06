"use client"

import Link from "next/link"
import { Twitter, Github, Mail } from "lucide-react"
import { Logo } from "@/components/ui/logo"

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/hero-bg.png')" }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="px-8 lg:px-14 py-10 grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-12 border-b border-white/10">

          <div className="md:col-span-2 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Logo className="w-8 h-8 rounded-lg" />
              <span className="text-[15px] font-semibold text-white tracking-tight">Hyperglork</span>
            </Link>

            <p className="text-[13px] text-white/55 leading-[1.7] max-w-[260px] mb-6">
              AI-powered voice receptionist for doctors. Answer every call,
              book every appointment, never miss a patient.
            </p>

            <div className="flex items-center gap-2">
              {[
                { Icon: Twitter, href: "#",                           label: "Twitter" },
                { Icon: Github,  href: "#",                           label: "GitHub" },
                { Icon: Mail,    href: "mailto:hello@hyperglork.ai",  label: "Email" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-7 w-7 items-center justify-center rounded border border-white/20 bg-white/10 text-white/55 hover:text-white hover:border-white/40 hover:bg-white/15 transition-all duration-150"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-[10.5px] text-white/35 uppercase tracking-[0.2em] mb-4">
                {group}
              </h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[13px] text-white/60 hover:text-white transition-colors duration-150">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-8 lg:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11.5px] text-white/35">
            © {new Date().getFullYear()} Hyperglork Technologies
          </p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            <span className="text-[11.5px] text-white/35">All systems operational</span>
          </div>
        </div>
      </div>

      {/* Giant watermark brand name */}
      <div className="relative z-10 flex justify-center select-none pointer-events-none pb-4 overflow-hidden">
        <span
          className="font-serif whitespace-nowrap leading-none"
          style={{
            fontSize: "clamp(56px, 10vw, 160px)",
            color: "rgba(255,255,255,0.05)",
            lineHeight: 1,
          }}
        >
          Hyperglork
        </span>
      </div>
    </footer>
  )
}
