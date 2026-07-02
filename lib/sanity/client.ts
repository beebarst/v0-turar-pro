import { createClient, type SanityClient } from "next-sanity"

const rawProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const projectId = rawProjectId ? rawProjectId.trim().replace(/^['"]|['"]$/g, "") : ""
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim().replace(/^['"]|['"]$/g, "")
const apiVersion = (process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01").trim()

export const sanityClient: SanityClient | null = (() => {
  if (!projectId || !/^[a-z0-9-]+$/.test(projectId)) return null
  try {
    return createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
      perspective: "published",
    })
  } catch {
    return null
  }
})()

export function isSanityConfigured(): boolean {
  return sanityClient !== null
}

/** @deprecated kept for backward compat — use sanityClient directly */
export function getSanityClient(): SanityClient | null {
  return sanityClient
}
