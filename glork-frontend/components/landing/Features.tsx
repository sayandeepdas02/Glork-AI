"use client"

const cards = [
  {
    title: "Missed Calls Mean Lost Revenue",
    copy:
      "When patients can’t get through, they abandon the booking, choose another clinic, and rarely try again. The loss compounds quietly.",
    labels: ["Incoming call", "Call unattended", "Missed opportunity"],
  },
  {
    title: "Long Wait Times Damage Trust",
    copy:
      "Patients expect immediate responses. Being put on hold creates frustration, lowers satisfaction, and increases repeat follow-ups.",
    labels: ["Call on hold", "Patient waiting", "Friction increases"],
  },
  {
    title: "Support Teams Don’t Scale With Demand",
    copy:
      "As call volume grows, teams struggle to keep up. Hiring and training takes time while patient demand rises overnight.",
    labels: ["Queue grows", "Calls overlap", "Coverage drops"],
  },
]

export default function Features() {
  return (
    <section id="problem" className="bg-black py-24 text-white md:py-32">
      <div className="section-shell">
        <span className="section-eyebrow text-white/88">The Problem</span>
        <h2 className="mt-8 max-w-5xl text-[3rem] leading-[0.95] tracking-[-0.05em] md:text-[5rem]">
          Invisible operational drag
          <br />
          turns every missed call
          <br />
          into lost trust.
        </h2>

        <div className="mt-14 grid gap-8 xl:grid-cols-3">
          {cards.map((card, index) => (
            <article key={card.title}>
              <div className="hero-image-surface relative overflow-hidden rounded-[32px] p-7">
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.10),rgba(0,0,0,0.45))]" />
                <div className="relative flex h-[360px] flex-col justify-between">
                  <div className="space-y-4">
                    {card.labels.map((label, labelIndex) => (
                      <div
                        key={label}
                        className="w-fit rounded-2xl border border-white/10 bg-[#2b120e]/78 px-5 py-4 text-[20px] font-medium text-white shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
                        style={{ marginLeft: `${labelIndex * 28}px` }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-[#2b120e]/84 px-5 py-4 text-sm text-white/82">
                    Scenario {String(index + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
              <h3 className="mt-6 text-[22px] font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-3 max-w-xl text-[16px] leading-8 text-white/72">{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
