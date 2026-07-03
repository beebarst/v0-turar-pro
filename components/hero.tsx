"use client"

import { ArrowDown, Play } from "lucide-react"
import type { Settings } from "@/lib/kv/client"

interface HeroProps {
  settings: Settings
}

export function Hero({ settings }: HeroProps) {
  const scrollToCalc = () => {
    document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="top"
      className="relative min-h-[100svh] flex items-center pt-24 pb-16 px-4"
    >
      <div className="mx-auto max-w-5xl w-full text-center">
        <h1 className="text-balance text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
          {settings.heroHeading} <span className="text-brand-red">{settings.heroHeadingAccent}</span>
        </h1>

        <p className="mt-6 md:mt-8 text-pretty text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
          {settings.heroSubheading}
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 items-center justify-center">
          <button
            onClick={scrollToCalc}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-red text-white font-semibold text-base md:text-lg hover:bg-red-600 transition-all duration-300"
          >
            {settings.heroCtaPrimary}
            <ArrowDown className="h-5 w-5 group-hover:translate-y-0.5 transition-transform" />
          </button>
          <a
            href="#portfolio"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-full border border-white/15 hover:border-white/30 text-white/80 hover:text-white transition-colors"
          >
            <Play className="h-4 w-4" />
            {settings.heroCtaSecondary}
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-xl mx-auto">
          {settings.heroStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-xs md:text-sm text-white/50 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
