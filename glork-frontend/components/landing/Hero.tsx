"use client"

import Link from "next/link"

const logos = ["Acme Corp", "Epicurious", "Quantum2", "Foresight", "Layers"]

export default function Hero() {
  return (
    <section className="hero-image-surface relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-black/24" />
      <div className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col px-5 pb-10 pt-32 md:px-8 md:pt-40">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center text-center">
          <h1 className="max-w-6xl text-[3.6rem] leading-[0.92] tracking-[-0.05em] text-white md:text-[5.4rem] xl:text-[6.2rem]">
            AI Voice Receptionists
            <br />
            for Every Patient Call
          </h1>

          <p className="mt-10 max-w-4xl text-[20px] leading-[1.65] text-white/84 md:text-[22px]">
            Hyperglork answers questions, books appointments, qualifies inquiries,
            and resolves front-desk pressure 24/7 with natural, human-like conversations.
          </p>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex min-w-[280px] items-center justify-center rounded-full bg-white px-10 py-5 text-[18px] font-semibold text-[#161616] transition-colors hover:bg-white/92"
            >
              Start Free
            </Link>
            <Link
              href="/login"
              className="inline-flex min-w-[220px] items-center justify-center rounded-full border border-white/18 bg-white/8 px-10 py-5 text-[18px] font-semibold text-white transition-colors hover:bg-white/12"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div id="results" className="mx-auto mt-10 w-full max-w-5xl text-center">
          <p className="text-[16px] font-medium text-white/84">Backed by ambitious clinics and operator-led teams</p>
          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-left text-[18px] font-semibold text-white/88 sm:grid-cols-3 lg:grid-cols-5">
            {logos.map((logo) => (
              <div key={logo} className="flex items-center justify-center whitespace-nowrap text-center">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
