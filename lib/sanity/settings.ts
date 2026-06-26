import "server-only"
import { getSanityClient } from "./client"
import { GLOBAL_SETTINGS_ID, globalSettingsQuery, globalSettingsFallbackQuery } from "./queries"
import { type GlobalSettings, type ResolvedSettings, resolveSettings } from "./types"

export { DEFAULT_SETTINGS, resolveSettings } from "./types"
export type { GlobalSettings, ResolvedSettings } from "./types"

/** Fetch the raw GlobalSettings document from Sanity (or null if unavailable). */
export async function getGlobalSettings(): Promise<GlobalSettings | null> {
  const sanityClient = getSanityClient()
  if (!sanityClient) return null
  try {
    let data = await sanityClient.fetch<GlobalSettings | null>(
      globalSettingsQuery,
      { id: GLOBAL_SETTINGS_ID },
      { next: { revalidate: 60, tags: ["global-settings"] } },
    )
    if (!data) {
      data = await sanityClient.fetch<GlobalSettings | null>(
        globalSettingsFallbackQuery,
        {},
        { next: { revalidate: 60, tags: ["global-settings"] } },
      )
    }
    return data ?? null
  } catch (error) {
    console.log("[v0] Failed to fetch GlobalSettings from Sanity:", (error as Error).message)
    return null
  }
}

/** Convenience: fetch + resolve in one call for Server Components. */
export async function getResolvedSettings(): Promise<ResolvedSettings> {
  const raw = await getGlobalSettings()
  return resolveSettings(raw)
}
