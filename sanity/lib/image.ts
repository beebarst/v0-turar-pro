import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"

import { dataset, isSanityConfigured, projectId } from "../env"

const builder = isSanityConfigured
  ? imageUrlBuilder({ projectId, dataset })
  : null

/** Build a URL for a Sanity image source, or null if Sanity isn't configured. */
export function urlForImage(source: SanityImageSource): string | null {
  if (!builder || !source) return null
  try {
    return builder.image(source).url()
  } catch {
    return null
  }
}
