"use client"

import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"

import { apiVersion, dataset, projectId } from "./sanity/env"
import { schema } from "./sanity/schemas"

export default defineConfig({
  basePath: "/studio",
  // Empty projectId is replaced by your real id via NEXT_PUBLIC_SANITY_PROJECT_ID.
  projectId: projectId || "placeholder",
  dataset,
  title: "TURAR.PRO CMS",
  schema,
  plugins: [structureTool(), visionTool({ defaultApiVersion: apiVersion })],
})
