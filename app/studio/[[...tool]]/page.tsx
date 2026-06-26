"use client"

import { NextStudio } from "next-sanity/studio"
import config from "@/sanity.config"

/**
 * Embedded Sanity Studio, served at /studio.
 *
 * This is what exposes the "Глобальные настройки" singleton (and the Услуги /
 * Портфолио lists) inside the deployed app. Without this route the Studio
 * config exists but is never mounted anywhere, so there is no CMS to open.
 */

export default function StudioPage() {
  return <NextStudio config={config} />
}
