import { createClient } from "next-sanity"

import { apiVersion, dataset, isSanityConfigured, projectId } from "../env"

// Only instantiate a real client when a project id is configured. Otherwise the
// app falls back to static data so the calculator and portfolio keep working.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null
