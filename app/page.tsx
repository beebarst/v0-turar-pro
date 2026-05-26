import { AmbientGlow } from "@/components/ambient-glow"
import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { Calculator } from "@/components/calculator"
import { ContactFooter } from "@/components/contact-footer"
import { FloatingBadge } from "@/components/floating-badge"

export default function Page() {
  return (
    <main className="relative min-h-screen text-white">
      <AmbientGlow />
      <SiteHeader />
      <Hero />
      <Portfolio />
      <Calculator />
      <ContactFooter />
      <FloatingBadge />
    </main>
  )
}
