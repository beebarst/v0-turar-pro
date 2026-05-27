"use client"

import { useEffect, useState } from "react"
import { Instagram, Send, MessageCircle, Phone } from "lucide-react"
import { SOCIAL_LINKS } from "@/lib/services-data"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="flex flex-col leading-tight">
          <span className="text-white font-bold text-lg md:text-xl tracking-tight">
            TURAR<span className="text-brand-red">.</span>PRO
          </span>
          <span className="text-[10px] md:text-xs text-white/50 tracking-wide">
            Видеограф Бибарыс Тұрар | Костанай
          </span>
        </a>

        <div className="flex items-center gap-2 md:gap-5">
          <a
            href={`tel:${SOCIAL_LINKS.phoneRaw}`}
            className="hidden sm:flex items-center gap-2 text-sm md:text-base text-white/90 hover:text-brand-red transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="font-medium">{SOCIAL_LINKS.phone}</span>
          </a>
          <div className="flex items-center gap-1 md:gap-2">
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="p-2 rounded-full hover:bg-white/5 hover:text-brand-red transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="p-2 rounded-full hover:bg-white/5 hover:text-[#25D366] transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <a
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className="p-2 rounded-full hover:bg-white/5 hover:text-[#229ED9] transition-colors"
            >
              <Send className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
