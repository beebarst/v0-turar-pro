// Sanity environment configuration.
// These values are read from env vars so the project keeps building before
// the real credentials are added. Fill them in your .env file:
//
//   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxxxxx
//   NEXT_PUBLIC_SANITY_DATASET=production
//
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01"

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production"

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""

/** True only when a Sanity project id has actually been configured. */
export const isSanityConfigured = projectId.length > 0
