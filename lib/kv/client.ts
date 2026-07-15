import "server-only"
import { kv } from "@vercel/kv"

export type Settings = {
  discountPercent: number
  contactPhone: string
  telegramLink: string
  whatsappLink: string
  instagramLink: string
  heroHeading: string
  heroHeadingAccent: string
  heroSubheading: string
  heroCtaPrimary: string
  heroCtaSecondary: string
  heroStats: Array<{ value: string; label: string }>
  headerTagline: string
  popupEnabled: boolean
  portfolioLabel: string
  portfolioHeading: string
  portfolioHeadingAccent: string
  portfolioHeadingSize: "sm" | "md" | "lg" | "xl"
  calculatorLabel: string
  calculatorHeading: string
  calculatorHeadingAccent: string
  calculatorHeadingSize: "sm" | "md" | "lg" | "xl"
  contactLabel: string
  contactHeading: string
  contactHeadingAccent: string
  contactHeadingSize: "sm" | "md" | "lg" | "xl"
  contactSubtext: string
  popupHeading: string
  popupSubheading: string
  popupButtonText: string
}

export type Service = {
  id: string
  title: string
  description: string
  price: number
  category: string
  hourly?: boolean
  order?: number
}

export type PortfolioItem = {
  id: string
  title: string
  category: string
  tag: string
  imageUrl: string
  videoUrl: string
  order?: number
  globalOrder?: number
}
const SETTINGS_KEY = "turar_settings"
const SERVICES_KEY = "turar_services"
const PORTFOLIO_KEY = "turar_portfolio"

export async function getSettings(): Promise<Settings | null> {
  try {
    if (!kv) {
      console.log("[v0] KV not available, using fallback")
      return null
    }
    const data = await kv.get<Settings>(SETTINGS_KEY)
    return data ?? null
  } catch (error) {
    console.log("[v0] Failed to fetch settings from KV:", (error as Error).message)
    return null
  }
}

export async function getServices(): Promise<Service[]> {
  try {
    if (!kv) {
      console.log("[v0] KV not available, using fallback")
      return []
    }
    const data = await kv.get<Service[]>(SERVICES_KEY)
    return data ?? []
  } catch (error) {
    console.log("[v0] Failed to fetch services from KV:", (error as Error).message)
    return []
  }
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  try {
    if (!kv) {
      console.log("[v0] KV not available, using fallback")
      return []
    }
    const data = await kv.get<PortfolioItem[]>(PORTFOLIO_KEY)
    return (data ?? []).sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  } catch (error) {
    console.log("[v0] Failed to fetch portfolio from KV:", (error as Error).message)
    return []
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  try {
    if (!kv) {
      throw new Error("KV not available")
    }
    await kv.set(SETTINGS_KEY, settings)
  } catch (error) {
    console.log("[v0] Failed to save settings to KV:", (error as Error).message)
    throw error
  }
}

export async function saveServices(services: Service[]): Promise<void> {
  try {
    if (!kv) {
      throw new Error("KV not available")
    }
    await kv.set(SERVICES_KEY, services)
  } catch (error) {
    console.log("[v0] Failed to save services to KV:", (error as Error).message)
    throw error
  }
}

export async function savePortfolioItems(items: PortfolioItem[]): Promise<void> {
  try {
    if (!kv) {
      throw new Error("KV not available")
    }
    await kv.set(PORTFOLIO_KEY, items)
  } catch (error) {
    console.log("[v0] Failed to save portfolio to KV:", (error as Error).message)
    throw error
  }
}
