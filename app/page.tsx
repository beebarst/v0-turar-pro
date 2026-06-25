import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { Calculator } from "@/components/calculator"
import { ContactFooter } from "@/components/contact-footer"
import { FloatingBadge } from "@/components/floating-badge"
import { getServiceCategories, getPortfolioItems } from "@/sanity/lib/fetch"

export default async function Page() {
  const [categories, portfolioItems] = await Promise.all([
    getServiceCategories(),
    getPortfolioItems(),
  ])

  return (
    <main className="relative min-h-screen text-white bg-transparent">
      {/* Fixed background with studio glow effect */}
      <div className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[150px]"></div>
      </div>
      <SiteHeader />
      <Hero />
      <Portfolio items={portfolioItems} />
      <Calculator categories={categories} />
      <ContactFooter />
      <FloatingBadge />
    </main>
  )
}
