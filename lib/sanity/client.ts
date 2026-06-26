import { createClient, type SanityClient } from "next-sanity"

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

/**
 * Whether Sanity is configured for this deployment.
 * Evaluated lazily so the build never crashes when env vars are absent.
 */
export function isSanityConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)
}

let _client: SanityClient | null = null

/**
 * Returns the Sanity client, creating it on first call.
 * Returns null if the project ID is not set — the site falls back to hardcoded defaults.
 */
export function getSanityClient(): SanityClient | null {
  if (!isSanityConfigured()) return null
  if (_client) return _client

  _client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
    useCdn: true,
    perspective: "published",
  })

  return _client
}

/** @deprecated Use getSanityClient() instead */
export const sanityClient: SanityClient | null = null
