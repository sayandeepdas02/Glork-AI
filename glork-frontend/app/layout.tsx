import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: {
    default: "Hyperglork — AI Receptionist for Modern Clinics",
    template: "%s | Hyperglork",
  },
  description:
    "Hyperglork answers patient calls, books appointments, and keeps clinics responsive with an AI receptionist built for healthcare teams.",
  keywords: [
    "AI receptionist",
    "healthcare automation",
    "clinic call handling",
    "appointment booking",
    "medical AI assistant",
    "patient scheduling",
    "Hyperglork",
  ],
  authors: [{ name: "Hyperglork" }],
  creator: "Hyperglork",
  openGraph: {
    title: "Hyperglork — AI Receptionist for Modern Clinics",
    description:
      "A clinical front desk that never sleeps. Answer every patient call, route urgency, and book appointments automatically.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hyperglork — AI Receptionist for Modern Clinics",
    description:
      "AI-powered call handling and booking for clinics that want a calmer front desk.",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="app-shell font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
