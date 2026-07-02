import "server-only"
import { Redis } from "@upstash/redis"
import { DEFAULT_SETTINGS } from "@/lib/sanity/types"
import type { ResolvedSettings } from "@/lib/sanity/types"
import { SERVICE_CATEGORIES } from "@/lib/services-data"
import type { ServiceCategory } from "@/lib/services-data"

// ---------------------------------------------------------------------------
// Redis client (singleton)
// ---------------------------------------------------------------------------
let _redis: Redis | null = null

function getRedis(): Redis | null {
  if (_redis) return _redis
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  try {
    _redis = new Redis({ url, token })
    return _redis
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------
const KEYS = {
  settings: "site:settings",
  services: "site:services",
  portfolio: "site:portfolio",
} as const

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------
export type StoredSettings = {
  discountPercent: number
  phone: string
  whatsapp: string
  telegram: string
  instagram: string
}

export async function getStoredSettings(): Promise<StoredSettings | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    return await redis.get<StoredSettings>(KEYS.settings)
  } catch {
    return null
  }
}

export async function setStoredSettings(data: StoredSettings): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error("Redis not configured")
  await redis.set(KEYS.settings, data)
}

/** Returns fully resolved settings: Redis data merged with hardcoded defaults. */
export async function getResolvedSettings(): Promise<ResolvedSettings> {
  const stored = await getStoredSettings()
  if (!stored) return DEFAULT_SETTINGS

  const discountPercent =
    typeof stored.discountPercent === "number" && stored.discountPercent >= 0
      ? stored.discountPercent
      : DEFAULT_SETTINGS.discountPercent

  const phoneRaw = (stored.phone || DEFAULT_SETTINGS.social.phone)
    .replace(/[^\d]/g, "")
    .replace(/^/, "+")

  return {
    discount: discountPercent / 100,
    discountPercent,
    social: {
      phone: stored.phone || DEFAULT_SETTINGS.social.phone,
      phoneRaw,
      whatsapp: stored.whatsapp || DEFAULT_SETTINGS.social.whatsapp,
      telegram: stored.telegram || DEFAULT_SETTINGS.social.telegram,
      instagram: stored.instagram || DEFAULT_SETTINGS.social.instagram,
    },
  }
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
export async function getStoredServices(): Promise<ServiceCategory[] | null> {
  const redis = getRedis()
  if (!redis) return null
  try {
    return await redis.get<ServiceCategory[]>(KEYS.services)
  } catch {
    return null
  }
}

export async function setStoredServices(data: ServiceCategory[]): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error("Redis not configured")
  await redis.set(KEYS.services, data)
}

/** Returns services from Redis, falling back to hardcoded SERVICE_CATEGORIES. */
export async function getServiceCategories(): Promise<ServiceCategory[]> {
  const stored = await getStoredServices()
  return stored ?? SERVICE_CATEGORIES
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------
export type PortfolioItem = {
  id: number
  title: string
  category: "wedding" | "events" | "social" | "business"
  tag: string
  thumb: string
  videoUrl?: string
}

const DEFAULT_PORTFOLIO: PortfolioItem[] = [
  { id: 1, title: "Айдана & Ержан", category: "wedding", tag: "Свадебный фильм", thumb: "linear-gradient(135deg,#1a0a0a,#3a1a1a)" },
  { id: 2, title: "Aftermovie · Almaty Night", category: "events", tag: "Aftermovie", thumb: "linear-gradient(135deg,#0a0a1a,#1a1a3a)" },
  { id: 3, title: "Reels Pack · Beauty", category: "social", tag: "Reels серия", thumb: "linear-gradient(135deg,#1a0a1a,#3a1a3a)" },
  { id: 4, title: "Promo · Auto Salon", category: "business", tag: "Промо-ролик", thumb: "linear-gradient(135deg,#0a1a0a,#1a3a1a)" },
  { id: 5, title: "Love Story · Kapchagai", category: "wedding", tag: "Love Story", thumb: "linear-gradient(135deg,#1a1a0a,#3a3a1a)" },
  { id: 6, title: "Корпоратив · KazTech", category: "events", tag: "Репортаж", thumb: "linear-gradient(135deg,#0a1a1a,#1a3a3a)" },
  { id: 7, title: "TikTok · Food Brand", category: "social", tag: "Вертикаль", thumb: "linear-gradient(135deg,#1a0a0a,#2a1a2a)" },
  { id: 8, title: "Бренд · Fitness Club", category: "business", tag: "SMM-пакет", thumb: "linear-gradient(135deg,#0a0a0a,#2a2a2a)" },
]

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const redis = getRedis()
  if (!redis) return DEFAULT_PORTFOLIO
  try {
    const stored = await redis.get<PortfolioItem[]>(KEYS.portfolio)
    return stored ?? DEFAULT_PORTFOLIO
  } catch {
    return DEFAULT_PORTFOLIO
  }
}

export async function setPortfolioItems(data: PortfolioItem[]): Promise<void> {
  const redis = getRedis()
  if (!redis) throw new Error("Redis not configured")
  await redis.set(KEYS.portfolio, data)
}
