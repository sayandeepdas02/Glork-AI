import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  title: {
    default: "Hyperglork — AI Receptionist for Doctors",
    template: "%s | Hyperglork",
  },
  description:
    "Hyperglork's AI voice receptionist answers every patient call 24/7, books appointments into Google Calendar, and sends instant confirmations — so you can focus on medicine, not admin.",
  keywords: [
    "AI receptionist",
    "medical AI",
    "doctor appointment booking",
    "clinic automation",
    "AI voice assistant healthcare",
    "patient call management",
    "google calendar booking",
    "Hyperglork",
  ],
  authors: [{ name: "Hyperglork" }],
  creator: "Hyperglork",
  openGraph: {
    title: "Hyperglork — AI Receptionist for Doctors",
    description:
      "Never miss a patient call again. Hyperglork's AI answers 24/7, books appointments, and sends confirmations automatically.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyperglork — AI Receptionist for Doctors",
    description:
      "AI-powered voice receptionist that books appointments, answers patient calls, and manages your calendar automatically.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrumentSerif.variable}`}>
      <body className="antialiased font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
