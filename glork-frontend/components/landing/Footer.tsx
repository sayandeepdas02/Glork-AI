"use client"

import Link from "next/link"
import { Twitter, Github, Mail, ShieldCheck, Lock, CheckCircle2, Calendar } from "lucide-react"
import { Panel } from "@/components/ui/panel"
import { Logo } from "@/components/ui/logo"

const footerLinks = {
  Product: ["Features", "How it works", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"],
}

export default function Footer() {
  return (
    <Panel className="bg-[#FAFAF8] border-t-0">

      <div className="border-b border-[#EAEAE5]">
        <div className="px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, title: "HIPAA Compliant",  desc: "Enterprise-grade security" },
            { icon: Calendar,    title: "Google Calendar", desc: "Native seamless integration" },
            { icon: Lock,        title: "256-bit Security", desc: "Bank-level data encryption" },
            { icon: CheckCircle2,title: "99.9% Uptime",    desc: "Reliable SLA guarantee" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/6 border border-brand/12">
                <item.icon className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-[13px] text-[#111]">{item.title}</p>
                <p className="text-[11px] text-[#aaa] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="px-8 py-14 grid grid-cols-1 md:grid-cols-5 gap-10 lg:gap-14 border-b border-[#EAEAE5]">
        <div className="md:col-span-2 flex flex-col items-start">
          <Link href="/" className="flex items-center gap-2 mb-5">
            <div className="flex h-7 w-7 items-center justify-center rounded">
              <Logo className="w-full h-full rounded" />
            </div>
            <span className="text-[14px] text-[#111]">Glork</span>
          </Link>

          <p className="text-[13px] text-[#666] leading-[1.65] max-w-xs mb-7">
            AI-powered voice receptionist for doctors. Answer every call,
            book every appointment, never miss a patient.
          </p>

          <div className="flex items-center gap-2">
            {[
              { Icon: Twitter, href: "#",                      label: "Twitter" },
              { Icon: Github,  href: "#",                      label: "GitHub" },
              { Icon: Mail,    href: "mailto:hello@glork.ai",  label: "Email" },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded border border-[#E0E0DB] bg-white text-[#aaa] hover:text-[#555] hover:border-[#C8C8C3] transition-all duration-150"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>

        {Object.entries(footerLinks).map(([group, links]) => (
          <div key={group}>
            <h4 className="text-[11px] text-[#aaa] uppercase tracking-[0.2em] mb-5">
              {group}
            </h4>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-[#666] hover:text-[#111] transition-colors duration-150"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-[11px] text-[#bbb] uppercase tracking-wider">
          © {new Date().getFullYear()} Glork Technologies
        </p>
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping-dot absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
          </span>
          <span className="text-[11px] text-[#bbb] uppercase tracking-wider">All systems operational</span>
        </div>
      </div>
    </Panel>
  )
}
