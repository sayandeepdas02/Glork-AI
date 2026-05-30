"use client"

import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Logo } from "@/components/ui/logo"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md screen-line-after border-x border-edge bg-background/80 max-w-5xl mx-auto">
      <div className="px-5 h-14 flex items-center justify-between gap-4">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="flex h-7 w-7 items-center justify-center rounded transition-transform group-hover:scale-105">
            <Logo className="w-full h-full rounded" />
          </div>
          <span className="text-[15px] font-bold text-white tracking-tight font-sans">Glork</span>
          <span className="ml-1 rounded border border-[#FF5500]/30 bg-[#FF5500]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#FF7733] uppercase tracking-widest font-mono">
            Beta
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {["Features", "How it works", "Pricing"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[13px] font-medium text-muted hover:text-white transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-white after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
            >
              {item}
            </Link>
          ))}
        </div>

        {/* Right: CTA Buttons */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium bg-white text-black hover:bg-gray-200 transition-colors rounded-md relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.7)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] cursor-pointer"
          >
            <Calendar size={14} strokeWidth={2} />
            Get Started
          </Link>
        </div>

      </div>
    </nav>
  )
}
