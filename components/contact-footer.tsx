"use client"

import { useState } from "react"
import { Instagram, Send, MessageCircle, Loader2, CheckCircle2 } from "lucide-react"
import { SOCIAL_LINKS, sendToTelegram } from "@/lib/services-data"

export function ContactFooter() {
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) return
    setStatus("loading")
    try {
      await sendToTelegram(
        `📞 <b>Запрос консультации с TURAR.PRO</b>\n\n<b>Телефон:</b> ${phone}`,
      )
      setStatus("success")
      setPhone("")
      setTimeout(() => setStatus("idle"), 4000)
    } catch {
      setStatus("error")
    }
  }

  return (
    <footer id="contact" className="relative pt-24 md:pt-32 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Top: consultation form */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="text-brand-red font-semibold tracking-wider text-sm uppercase mb-3">
            Контакты
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-balance">
            Остались вопросы? <br className="sm:hidden" />
            <span className="text-brand-red">Получите бесплатную консультацию</span>
          </h2>
          <p className="mt-4 text-white/60 text-pretty">
            Оставьте номер — перезвоню в течение 15 минут и помогу подобрать оптимальный пакет.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 flex flex-col sm:flex-row gap-3 max-w-xl mx-auto"
          >
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 ___ ___ __ __"
              className="flex-1 px-5 py-4 rounded-full bg-white/[0.04] border border-white/10 focus:border-brand-red outline-none text-base"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-brand-red hover:bg-red-600 font-semibold transition-all disabled:opacity-60"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Отправляем
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  Отправлено!
                </>
              ) : (
                "Получить консультацию"
              )}
            </button>
          </form>
          {status === "error" && (
            <p className="mt-3 text-sm text-brand-red">Не удалось отправить. Попробуйте ещё раз.</p>
          )}
          {status === "success" && (
            <p className="mt-3 text-sm text-[#39ff14]">Заявка отправлена, скоро свяжемся!</p>
          )}
        </div>

        {/* Center: large social icons */}
        <div className="mt-20 md:mt-24 flex items-center justify-center gap-8 md:gap-16">
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="glow-hover text-white/80 hover:text-[#25D366]"
          >
            <MessageCircle className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.5} />
          </a>
          <a
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="glow-hover text-white/80 hover:text-[#229ED9]"
          >
            <Send className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.5} />
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="glow-hover text-white/80 hover:text-brand-red"
          >
            <Instagram className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.5} />
          </a>
        </div>

        {/* Phone */}
        <div className="mt-16 text-center">
          <div className="text-white/40 text-sm uppercase tracking-wider mb-2">
            Прямой звонок
          </div>
          <a
            href={`tel:${SOCIAL_LINKS.phoneRaw}`}
            className="inline-block text-3xl sm:text-4xl md:text-5xl font-black tracking-tight hover:text-brand-red transition-colors"
          >
            {SOCIAL_LINKS.phone}
          </a>
        </div>

        {/* Bottom */}
        <div className="mt-20 md:mt-24 pt-8 border-t border-white/5 text-center text-sm text-white/40">
          © 2026 Бибарыс Тұрар. Все права защищены.
        </div>
      </div>

      {/* extra padding so floating badge doesn't overlap last text */}
      <div className="h-32" aria-hidden />
    </footer>
  )
}
