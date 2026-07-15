"use client"

import { useState } from "react"
import { Play, X } from "lucide-react"
import type { PortfolioItem } from "@/lib/kv/client"
import type { Settings } from "@/lib/kv/client"

const FILTERS = [
  { id: "all", label: "Все" },
  { id: "wedding", label: "Свадьбы" },
  { id: "events", label: "Мероприятия" },
  { id: "social", label: "Соцсети" },
  { id: "business", label: "Бизнес" },
] as const

function toEmbedUrl(url: string): string {
  const short = url.match(/youtu\.be\/([^?&]+)/)
  if (short) return `https://www.youtube.com/embed/${short[1]}?autoplay=1`
  const full = url.match(/[?&]v=([^?&]+)/)
  if (full) return `https://www.youtube.com/embed/${full[1]}?autoplay=1`
  return url
}

function headingSize(size?: string) {
  switch (size) {
    case "sm": return "text-2xl sm:text-3xl md:text-4xl"
    case "md": return "text-3xl sm:text-4xl md:text-4xl"
    case "lg": return "text-3xl sm:text-4xl md:text-5xl"
    case "xl": return "text-4xl sm:text-5xl md:text-6xl"
    default:   return "text-3xl sm:text-4xl md:text-5xl"
  }
}

interface PortfolioProps {
  items: PortfolioItem[]
  settings?: Settings
}

export function Portfolio({ items, settings }: PortfolioProps) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all")
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const filtered = filter === "all"
    ? [...items].sort((a, b) => (a.globalOrder ?? a.order ?? 999) - (b.globalOrder ?? b.order ?? 999))
    : [...items]
        .filter((i) => i.category === filter)
        .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

  const label = settings?.portfolioLabel ?? "Портфолио"
  const heading = settings?.portfolioHeading ?? "Работы, которые говорят"
  const accent = settings?.portfolioHeadingAccent ?? "сами за себя"
  const size = settings?.portfolioHeadingSize ?? "lg"

  return (
    <section id="portfolio" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
<div className="flex flex-col gap-6 mb-10 text-center">
          <div>
            <div className="text-brand-red font-semibold tracking-wider text-sm uppercase mb-3">
              {label}
            </div>
            <h2 className={`${headingSize(size)} font-bold tracking-tight text-balance`}>
              {heading} <span className="text-brand-red">{accent}</span>
            </h2>
          </div>
<div className="flex gap-2 overflow-x-auto pb-1 flex-nowrap justify-center [&::-webkit-scrollbar]:h-[2px] [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  filter === f.id
                    ? "bg-brand-red border-brand-red text-white"
                    : "border-white/10 text-white/70 hover:border-white/30 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => item.videoUrl && setActiveVideo(item.videoUrl)}
              className={`group relative aspect-video rounded-2xl overflow-hidden border border-white/5 cursor-pointer bg-gradient-to-br from-neutral-900 to-neutral-800 ${
                idx === 0 ? "lg:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[420px]" : ""
              }`}
              style={
                item.imageUrl
                  ? { backgroundImage: `url('${item.imageUrl}')`, backgroundSize: "cover", backgroundPosition: "center" }
                  : {}
              }
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-red transition-all duration-300">
                  <Play className="h-6 w-6 text-white ml-1" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="text-xs uppercase tracking-wider text-brand-red font-semibold mb-1">
                  {item.tag}
                </div>
                <div className="text-white font-semibold text-lg">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute -top-10 right-0 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" /> Закрыть
            </button>
            <div className="aspect-video w-full">
              <iframe
                src={toEmbedUrl(activeVideo)}
                className="w-full h-full rounded-xl"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
