"use client"

import { useState } from "react"
import Link from "next/link"

const faqs = [
  {
    q: "What can Hyperglork handle?",
    a: "The agent can answer FAQs, handle booking requests, qualify incoming inquiries, and route calls to humans when needed.",
  },
  { q: "Does the voice agent sound human?", a: "Yes. It is designed for natural turn-taking, intent recognition, and conversational responses." },
  { q: "How long does it take to set up?", a: "Most clinics can be live in a few minutes once calendar access and routing rules are configured." },
  { q: "Can it integrate with our existing tools?", a: "Yes. The system is designed around direct calendar workflows and extensible operational integrations." },
  { q: "Is it secure and enterprise-ready?", a: "The redesign positions the product with a more enterprise-ready interface and operational clarity throughout the experience." },
]

export default function Pricing() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="bg-[var(--bg-surface)] pt-24 md:pt-32">
      <div className="section-shell">
        <div className="grid gap-14 xl:grid-cols-[420px_minmax(0,1fr)]">
          <div>
            <span className="section-eyebrow">FAQ</span>
            <h2 className="mt-8 text-[3rem] leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)] md:text-[4.6rem]">
              Questions
              <br />
              resolved in
              <br />
              one place
            </h2>
            <Link
              href="/register"
              className="mt-10 inline-flex items-center justify-center rounded-full bg-[#121212] px-9 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-[#232323]"
            >
              Get Started Free
            </Link>
          </div>

          <div>
            {faqs.map((faq, index) => {
              const isOpen = open === index
              return (
                <button
                  key={faq.q}
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="w-full border-t border-[var(--edge)] py-6 text-left last:border-b"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-[24px] font-semibold tracking-tight text-[var(--text-primary)]">{faq.q}</p>
                      {isOpen && <p className="mt-4 max-w-3xl text-[16px] leading-8 text-[var(--text-muted)]">{faq.a}</p>}
                    </div>
                    <span className="pt-1 text-2xl text-[var(--text-primary)]">{isOpen ? "×" : "+"}</span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
