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
    <Panel className="border-t border-[#EAEAE5] bg-[#FAFAF8]">
      <div className="px-8 lg:px-14 py-14 grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-14 border-b border-[#EAEAE5]">

        <div className="md:col-span-2 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <Logo className="w-6 h-6 rounded" />
            <span className="text-[14px] text-[#111]">Glork</span>
          </Link>

          <p className="text-[13px] text-[#888] leading-[1.65] max-w-[260px] mb-6">
            AI-powered voice receptionist for doctors. Answer every call,
            book every appointment, never miss a patient.
          </p>

          <div className="flex items-center gap-2">
            {[
              { Icon: Twitter, href: "#",                     label: "Twitter" },
              { Icon: Github,  href: "#",                     label: "GitHub" },
              { Icon: Mail,    href: "mailto:hello@glork.ai", label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-7 w-7 items-center justify-center rounded border border-[#E0E0DB] bg-white text-[#bbb] hover:text-[#555] hover:border-[#C8C8C3] transition-all duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-[10.5px] text-[#bbb] uppercase tracking-[0.2em] mb-4">
              {group}
            </h4>
            <ul className="space-y-2.5">
              {links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13px] text-[#777] hover:text-[#111] transition-colors duration-150">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-8 lg:px-14 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11.5px] text-[#ccc]">
          © {new Date().getFullYear()} Glork Technologies
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span className="text-[11.5px] text-[#ccc]">All systems operational</span>
        </div>
      </div>
    </Panel>
  )
}
