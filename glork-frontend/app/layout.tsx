import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/providers/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: {
    default: "Glork — AI Receptionist for Doctors",
    template: "%s | Glork",
  },
  description:
    "Glork's AI voice receptionist answers every patient call 24/7, books appointments into Google Calendar, and sends instant confirmations — so you can focus on medicine, not admin.",
  keywords: [
    "AI receptionist",
    "medical AI",
    "doctor appointment booking",
    "clinic automation",
    "AI voice assistant healthcare",
    "patient call management",
    "google calendar booking",
    "Glork",
  ],
  authors: [{ name: "Glork" }],
  creator: "Glork",
  openGraph: {
    title: "Glork — AI Receptionist for Doctors",
    description:
      "Never miss a patient call again. Glork's AI answers 24/7, books appointments, and sends confirmations automatically.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glork — AI Receptionist for Doctors",
    description:
      "AI-powered voice receptionist that books appointments, answers patient calls, and manages your calendar automatically.",
  },
  other: {
    "google-fonts-preconnect": "https://fonts.googleapis.com",
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sansation:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
