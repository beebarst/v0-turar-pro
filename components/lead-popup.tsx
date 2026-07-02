"use client"

import { useEffect, useState } from "react"
import { X, Loader2, CheckCircle2 } from "lucide-react"

async function sendToTelegram(text: string) {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error("TG send failed")
}

export function LeadPopup() {
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const already = sessionStorage.getItem("lead_popup_shown")
      if (already) return
    } catch {
      // sessionStorage unavailable (private mode restrictions in some browsers)
      return
    }
    const timer = setTimeout(() => setVisible(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const close = () => {
    try { sessionStorage.setItem("lead_popup_shown", "1") } catch { /* ignore */ }
    setVisible(false)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim()) return
    setStatus("loading")
    try {
      await sendToTelegram(
        `📅 <b>Запрос расписания — TURAR.PRO</b>\n\n` +
          `👤 <b>Имя:</b> ${name}\n` +
          `📞 <b>Телефон / Telegram:</b> ${contact}`,
      )
      setStatus("success")
      try { sessionStorage.setItem("lead_popup_shown", "1") } catch { /* ignore */ }
    } catch {
      setStatus("error")
    }
  }

  if (!visible) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm"
        onClick={close}
        aria-hidden
      />

      {/* Panel — bottom sheet on mobile, centered card on desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-popup-title"
        className={[
          "fixed z-[80] w-full bg-zinc-950 border border-white/10 shadow-2xl",
          // mobile: slide up from bottom
          "bottom-0 left-0 right-0 rounded-t-2xl px-6 pt-6 pb-8",
          // desktop: centered card
          "md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
          "md:max-w-md md:rounded-2xl md:p-8",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="md:hidden mx-auto mb-5 h-1 w-10 rounded-full bg-white/20" aria-hidden />

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#39ff14]/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-[#39ff14]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-white/60 mb-6">Напишу тебе с актуальным расписанием.</p>
            <button
              onClick={close}
              className="px-6 py-3 rounded-full bg-brand-red hover:bg-red-600 font-semibold transition-colors"
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            <h2
              id="lead-popup-title"
              className="text-2xl md:text-3xl font-bold tracking-tight text-balance leading-tight mb-2"
            >
              Свободные даты разбирают быстро
            </h2>
            <p className="text-white/60 text-sm text-pretty mb-6">
              Оставь контакт — я напишу тебе с актуальным расписанием и ценой
            </p>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Твоё имя"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-brand-red outline-none transition-colors"
              />
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Телефон или @telegram"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-brand-red outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-red hover:bg-red-600 font-semibold text-base shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-60 transition-colors"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  "Узнать свободные даты"
                )}
              </button>

              {status === "error" && (
                <p className="text-sm text-brand-red text-center">
                  Ошибка отправки. Попробуйте ещё раз.
                </p>
              )}

              <p className="text-xs text-white/40 text-center pt-1">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          </>
        )}
      </div>
    </>
  )
}
