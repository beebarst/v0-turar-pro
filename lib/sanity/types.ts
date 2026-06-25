import { DISCOUNT, SOCIAL_LINKS } from "@/lib/services-data"

/** Raw shape of the GlobalSettings document as stored in Sanity. */
export type GlobalSettings = {
  discount: number | null
  contactPhone: string | null
  telegramLink: string | null
  whatsappLink: string | null
  instagramLink: string | null
}

/** Normalized settings the UI consumes, always fully populated via fallbacks. */
export type ResolvedSettings = {
  /** Discount as a fraction, e.g. 0.4 for 40%. */
  discount: number
  /** Discount as a whole percentage, e.g. 40. */
  discountPercent: number
  social: {
    phone: string
    phoneRaw: string
    whatsapp: string
    telegram: string
    instagram: string
  }
}

/**
 * Default settings derived from the existing hard-coded values. Used as a
 * fallback whenever Sanity is not configured or a field is empty, so the site
 * (calculator, header, footer) keeps working exactly as before.
 */
export const DEFAULT_SETTINGS: ResolvedSettings = {
  discount: DISCOUNT,
  discountPercent: Math.round(DISCOUNT * 100),
  social: {
    phone: SOCIAL_LINKS.phone,
    phoneRaw: SOCIAL_LINKS.phoneRaw,
    whatsapp: SOCIAL_LINKS.whatsapp,
    telegram: SOCIAL_LINKS.telegram,
    instagram: SOCIAL_LINKS.instagram,
  },
}

/** Build a tel:-friendly raw number ("+7..." with digits only) from a display phone. */
function toPhoneRaw(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "")
  return digits ? `+${digits}` : SOCIAL_LINKS.phoneRaw
}

/** Merge raw Sanity data with defaults to produce fully-populated settings. */
export function resolveSettings(raw: GlobalSettings | null): ResolvedSettings {
  if (!raw) return DEFAULT_SETTINGS

  const discountPercent =
    typeof raw.discount === "number" && !Number.isNaN(raw.discount)
      ? raw.discount
      : DEFAULT_SETTINGS.discountPercent

  const phone = raw.contactPhone?.trim() || DEFAULT_SETTINGS.social.phone

  return {
    discount: discountPercent / 100,
    discountPercent,
    social: {
      phone,
      phoneRaw: raw.contactPhone?.trim() ? toPhoneRaw(phone) : DEFAULT_SETTINGS.social.phoneRaw,
      whatsapp: raw.whatsappLink?.trim() || DEFAULT_SETTINGS.social.whatsapp,
      telegram: raw.telegramLink?.trim() || DEFAULT_SETTINGS.social.telegram,
      instagram: raw.instagramLink?.trim() || DEFAULT_SETTINGS.social.instagram,
    },
  }
}
