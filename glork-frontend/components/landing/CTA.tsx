"use client"

import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"
import { Panel, PanelHeader, PanelTitle } from "@/components/ui/panel"

export default function CTA() {
  return (
    <Panel id="cta" className="bg-surface relative overflow-hidden">
      {/* Noise background for CTA */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDIiIC8+Cjwvc3ZnPg==')] opacity-40 pointer-events-none" />

      {/* Subtle radial glow inside CTA */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(255,107,0,0.08), transparent 60%)' }} />

      <div className="flex flex-col items-center justify-center py-[120px] px-6 text-center relative z-10 border-b border-edge">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand/10 border border-brand/30 mb-8">
          <Phone className="h-5 w-5 text-brand" />
        </div>

        <p className="text-[13px] font-mono font-bold text-brand uppercase tracking-[0.3em] mb-4">
          Get started today
        </p>
        
        <h2 className="text-5xl lg:text-6xl font-medium text-white/95 mb-6 leading-tight tracking-tight">
          Ready to stop missing<br />
          <span className="font-serif italic text-brand">patient calls?</span>
        </h2>
        
        <p className="text-[15px] text-white/80 mb-12 max-w-xl mx-auto leading-relaxed">
          Set up your AI receptionist in 3 minutes. Free to start, no credit card required.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 text-sm font-medium bg-white text-black hover:bg-gray-200 transition-colors rounded-md relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.7)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] cursor-pointer"
          >
            Create your free account <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      
      {/* Footer Info Bar of CTA */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-edge border-b border-edge text-center bg-black/20">
        {["No credit card", "Cancel anytime", "Live in 3 minutes", "Free forever plan"].map((badge) => (
          <div key={badge} className="py-4 px-2 text-[11px] text-white/70 font-mono font-medium uppercase tracking-widest flex items-center justify-center gap-1.5">
             <span className="text-brand font-bold">✓</span> {badge}
          </div>
        ))}
      </div>
    </Panel>
  )
}
