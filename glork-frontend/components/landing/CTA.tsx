"use client"

import Link from "next/link"

export default function CTA() {
  return (
    <section className="bg-[#141414] py-24 text-white md:py-28">
      <div className="section-shell text-center">
        <h2 className="text-[3rem] leading-[0.95] tracking-[-0.05em] md:text-[4.8rem]">
          Start Answering
          <br />
          Every Call Today
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-8 text-white/62">
          Launch your AI voice receptionist in minutes and deliver better patient experiences
          without increasing front-desk load.
        </p>
        <Link
          href="/register"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-[var(--brand)] px-8 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[var(--brand-light)]"
        >
          Get Started Free
        </Link>
      </div>
    </section>
  )
}
