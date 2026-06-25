import {
  SERVICE_CATEGORIES,
  PORTFOLIO_ITEMS,
  type ServiceCategory,
  type Service,
  type PortfolioItem,
  type PortfolioCategory,
} from "@/lib/services-data"
import { client } from "./client"
import { urlForImage } from "./image"
import { servicesQuery, portfolioQuery } from "./queries"

// Category id -> { title, icon }, derived from the static fallback so dynamic
// services stay grouped under the same headings/icons in the calculator.
const CATEGORY_META = SERVICE_CATEGORIES.map((c) => ({
  id: c.id,
  title: c.title,
  icon: c.icon,
}))

type SanityService = {
  id: string
  title: string
  description?: string
  basePrice: number
  category: string
  hourly?: boolean
}

type SanityPortfolio = {
  id: string
  title: string
  category: PortfolioCategory
  tag?: string
  videoUrl?: string | null
  image?: unknown
}

/**
 * Returns service categories for the calculator. Pulls from Sanity when
 * configured and populated, otherwise returns the static fallback so the
 * calculator always works.
 */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  if (!client) return SERVICE_CATEGORIES

  try {
    const services = await client.fetch<SanityService[]>(servicesQuery)
    if (!services || services.length === 0) return SERVICE_CATEGORIES

    const grouped: ServiceCategory[] = CATEGORY_META.map((meta) => ({
      ...meta,
      services: services
        .filter((s) => s.category === meta.id)
        .map<Service>((s) => ({
          id: s.id,
          title: s.title,
          description: s.description ?? "",
          basePrice: s.basePrice,
          hourly: s.hourly,
        })),
    })).filter((c) => c.services.length > 0)

    return grouped.length > 0 ? grouped : SERVICE_CATEGORIES
  } catch {
    return SERVICE_CATEGORIES
  }
}

/**
 * Returns portfolio items. Pulls from Sanity when configured and populated,
 * otherwise returns the static fallback.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!client) return PORTFOLIO_ITEMS

  try {
    const items = await client.fetch<SanityPortfolio[]>(portfolioQuery)
    if (!items || items.length === 0) return PORTFOLIO_ITEMS

    return items.map<PortfolioItem>((i) => ({
      id: i.id,
      title: i.title,
      category: i.category,
      tag: i.tag ?? "",
      videoUrl: i.videoUrl ?? null,
      image: i.image ? urlForImage(i.image) : null,
    }))
  } catch {
    return PORTFOLIO_ITEMS
  }
}
