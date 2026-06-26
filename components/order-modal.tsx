"use client"

import { useEffect, useState } from "react"
import { X, Loader2, CheckCircle2 } from "lucide-react"
import { formatPrice } from "@/lib/services-data"

async function sendToTelegram(text: string) {
  const res = await fetch("/api/telegram", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error("TG send failed")
}

export type SelectedItem = {
  id: string
  title: string
  qty: number
  unitDiscounted: number
  totalDiscounted: number
}

export function OrderModal({
  open,
  onClose,
  items,
  total,
  discountPercent = 40,
}: {
  open: boolean
  onClose: () => void
  items: SelectedItem[]
  total: number
  discountPercent?: number
}) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    if (open) {
      setStatus("idle")
    }
  }, [open])

  if (!open) return null

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || items.length === 0) return
    setStatus("loading")
    const lines = items
      .map((i) => `• ${i.title}${i.qty > 1 ? ` × ${i.qty}` : ""} — ${formatPrice(i.totalDiscounted)}`)
      .join("\n")
    const text =
      `🎬 <b>Новая заявка с TURAR.PRO</b>\n\n` +
      `👤 <b>Имя:</b> ${name}\n` +
      `📞 <b>Телефон:</b> ${phone}\n\n` +
      `<b>Выбранные услуги:</b>\n${lines}\n\n` +
      `💰 <b>Итого со скидкой ${discountPercent}%:</b> ${formatPrice(total)}`
    try {
      await sendToTelegram(text)
      setStatus("success")
      setName("")
      setPhone("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-white/60 hover:text-white"
          aria-label="Закрыть"
        >
          <X className="h-5 w-5" />
        </button>

        {status === "success" ? (
          <div className="text-center py-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-[#39ff14]/15 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-[#39ff14]" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
            <p className="text-white/60 mb-6">Скоро свяжемся с вами.</p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-brand-red hover:bg-red-600 font-semibold"
            >
              Отлично
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
              Оформить заказ
            </h3>
            <p className="text-white/60 text-sm mb-6">
              Сумма со скидкой:{" "}
              <span className="text-[#39ff14] font-semibold">{formatPrice(total)}</span>
            </p>

            <form onSubmit={submit} className="space-y-3">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше имя"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-brand-red outline-none transition-colors"
              />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 ___ ___ __ __"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 focus:border-brand-red outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-brand-red hover:bg-red-600 font-semibold text-base shadow-[0_0_30px_rgba(239,68,68,0.4)] disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> Отправляем...
                  </>
                ) : (
                  "Отправить заявку"
                )}
              </button>
              {status === "error" && (
                <p className="text-sm text-brand-red text-center">
                  Ошибка отправки. Попробуйте ещё раз.
                </p>
              )}
              <p className="text-xs text-white/40 text-center pt-2">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
