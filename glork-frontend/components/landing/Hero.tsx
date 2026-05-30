"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Phone, Calendar } from "lucide-react"
import Image from "next/image"

const BADGES = ["AI-powered", "24/7 available", "HIPAA-friendly", "No-code setup"]

function useTypewriter(words: string[], typingSpeed = 65, erasingSpeed = 38, pauseMs = 1600) {
  const [index, setIndex]     = useState(0)
  const [text, setText]       = useState("")
  const [phase, setPhase]     = useState<"typing" | "pausing" | "erasing">("typing")

  useEffect(() => {
    const current = words[index]
    let timeout: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      if (text.length < current.length) {
        timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), typingSpeed)
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseMs)
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => setPhase("erasing"), 0)
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), erasingSpeed)
      } else {
        setIndex((i) => (i + 1) % words.length)
        setPhase("typing")
      }
    }
    return () => clearTimeout(timeout)
  }, [phase, text, index, words, typingSpeed, erasingSpeed, pauseMs])

  return text
}

export default function Hero() {
  const badgeText = useTypewriter(BADGES)

  return (
    <div className="screen-line-after flex flex-col md:flex-row border-x border-white/6 max-w-[1200px] mx-auto min-h-[88vh]">
      
      {/* ── Left Column: Main Copy ── */}
      <div className="flex flex-1 flex-col border-b md:border-b-0 md:border-r border-edge bg-noise relative">
        
        {/* Subtle grid background noise via class if needed, or just pure solid dark */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiIC8+Cjwvc3ZnPg==')] opacity-20 pointer-events-none" />

        <div className="flex flex-col flex-1 justify-center p-10 lg:p-16 z-10">
          
          <div className="mb-5">
            <span className="font-mono text-[12px] font-bold text-brand uppercase tracking-[0.25em] inline-flex items-center gap-[2px]">
              {badgeText}
              <span className="inline-block w-[1.5px] h-[0.85em] bg-muted ml-[1px] align-middle animate-cursor-blink" />
            </span>
          </div>

          <h1 className="text-5xl lg:text-[4rem] font-medium text-white leading-[1.05] tracking-tight mb-6">
            Never miss a<br />
            patient call<br />
            <span className="font-serif italic text-brand">again.</span>
          </h1>

          <p className="text-[16px] text-white/80 leading-[1.65] max-w-[600px] font-normal mb-10 font-sans">
            Glork&rsquo;s AI answers every call 24/7, books appointments straight
            into Google Calendar, and sends confirmations &mdash; so you can focus
            on medicine, not admin.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mt-auto">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors rounded-md relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.7)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] cursor-pointer"
            >
              <Calendar size={16} strokeWidth={2} />
              Start for free
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-md border border-edge bg-transparent
                hover:bg-white/5 px-5 py-2.5 text-sm font-medium text-muted hover:text-white
                transition-all duration-200"
            >
              See how it works
            </a>
          </div>
          
        </div>
        
        {/* Footer info bar inside the cell */}
        <div className="border-t border-white/8 px-10 lg:px-16 py-4 flex items-center gap-4 text-[11px] font-mono text-white/50 uppercase tracking-widest bg-black/20">
          <span>No credit card</span>
          <span className="hidden sm:inline">&middot; Live in 3 mins</span>
          <span className="hidden sm:inline">&middot; Free plan</span>
        </div>
      </div>

      {/* ── Right Column: UI Mockup ── */}
      <div className="flex-1 md:w-[45%] flex flex-col bg-surface overflow-hidden relative group">
        
        {/* Mockup Header */}
        <div className="border-b border-edge px-4 py-3 flex items-center justify-between bg-black/40">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          </div>
          <span className="text-[10px] font-mono text-muted">Incoming Call</span>
        </div>

        {/* Mockup Content */}
        <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
          
          {/* Wireframe Phone Card */}
          <div className="w-full max-w-[300px] rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-2xl overflow-hidden relative">
            <div className="p-5 flex flex-col items-center border-b border-white/10 relative z-10">
              <div className="w-16 h-16 rounded-full bg-brand/15 border border-brand/40 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-500">
                <Phone className="h-6 w-6 text-brand" />
              </div>
              <p className="text-xs font-mono text-brand tracking-widest uppercase mb-1 font-semibold">AI Agent</p>
              <p className="text-base font-semibold text-white">+1 (555) 234-5678</p>
              <p className="text-[13px] text-muted mt-0.5 tabular-nums">00:42</p>
            </div>
            
            <div className="p-4 space-y-3 relative z-10">
              <div className="text-[10px] font-mono text-muted uppercase tracking-widest border-b border-edge pb-1.5 mb-2">Transcript</div>
              <div className="space-y-3">
                <p className="text-xs text-white leading-relaxed bg-brand/20 border border-brand/30 p-3 rounded-md rounded-tl-none font-medium">
                  "Hi, I'd like to book an appointment for next Tuesday around 10am."
                </p>
                <p className="text-xs text-white/90 leading-relaxed bg-white/10 border border-white/20 p-3 rounded-md rounded-tr-none ml-6">
                  "Of course! I have 10:00 AM and 10:30 AM available. Which works better?"
                </p>
              </div>
            </div>

            {/* Subtle radial glow inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[#FF5500]/5 blur-3xl pointer-events-none" />
          </div>

        </div>

      </div>
    </div>
  )
}
