import { createClient, type SanityClient } from "next-sanity"

// Public, non-secret Sanity values. We default to the known project so the
// site keeps working even if the NEXT_PUBLIC_* env vars are not set.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "f0a0r6yn"
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production"
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

/**
 * Whether Sanity is configured for this deployment. When the project ID is
 * missing we deliberately skip creating a client so the site keeps working
 * with hard-coded fallback values instead of throwing at request time.
 */
export const isSanityConfigured = Boolean(projectId)

export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      // CDN gives faster, cached responses for published content.
      useCdn: true,
      perspective: "published",
    })
  : null
