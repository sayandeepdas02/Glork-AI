import Navbar       from "@/components/landing/Navbar"
import Hero         from "@/components/landing/Hero"
import Features     from "@/components/landing/Features"
import HowItWorks   from "@/components/landing/HowItWorks"
import Stats        from "@/components/landing/Stats"
import Testimonials from "@/components/landing/Testimonials"
import Pricing      from "@/components/landing/Pricing"
import CTA          from "@/components/landing/CTA"
import Footer       from "@/components/landing/Footer"

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
