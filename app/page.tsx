import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { Portfolio } from "@/components/portfolio"
import { Calculator } from "@/components/calculator"
import { ContactFooter } from "@/components/contact-footer"
import { FloatingBadge } from "@/components/floating-badge"
import { LeadPopup } from "@/components/lead-popup"
import { getSettings, getServices, getPortfolioItems } from "@/lib/kv/client"
import { DEFAULT_SETTINGS, DEFAULT_SERVICES, DEFAULT_PORTFOLIO } from "@/lib/kv/defaults"

export const dynamic = "force-dynamic"

export default async function Page() {
  const [settings, services, portfolio] = await Promise.all([
    getSettings(),
    getServices(),
    getPortfolioItems(),
  ])

  const finalSettings = settings || DEFAULT_SETTINGS
  const finalServices = services && services.length > 0 ? services : DEFAULT_SERVICES
  const finalPortfolio = portfolio && portfolio.length > 0 ? portfolio : DEFAULT_PORTFOLIO

  return (
    <main className="relative min-h-screen text-white bg-transparent">
      {/* Fixed background with studio glow effect */}
      <div className="fixed inset-0 z-[-1] bg-black overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/20 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/20 blur-[150px]"></div>
      </div>
      <SiteHeader settings={finalSettings} />
      <Hero settings={finalSettings} />
      <Portfolio items={finalPortfolio} />
      <Calculator settings={finalSettings} services={finalServices} />
      <ContactFooter settings={finalSettings} />
      <FloatingBadge discountPercent={finalSettings.discountPercent} />
      <LeadPopup enabled={finalSettings.popupEnabled} />
    </main>
  )
}
