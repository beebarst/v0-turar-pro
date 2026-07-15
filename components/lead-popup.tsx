"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import type { Settings } from "@/lib/kv/client"

interface LeadPopupProps {
  enabled?: boolean
  settings?: Settings
}

export function LeadPopup({ enabled = true, settings }: LeadPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isError, setIsError] = useState(false)

  const heading = settings?.popupHeading ?? "Свободные даты разбирают быстро"
  const subheading = settings?.popupSubheading ?? "Оставь контакт — я напишу с актуальным расписанием"
  const buttonText = settings?.popupButtonText ?? "Узнать свободные даты"

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.location.pathname.startsWith("/admin")) return
      if (!enabled) return
      setIsOpen(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [enabled])

  const handleClose = () => setIsOpen(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !contact) return
    setIsLoading(true)
    setIsError(false)
    try {
      const text = `🔔 <b>Новый лид из попапа</b>\n\n👤 <b>Имя:</b> ${name}\n📞 <b>Контакт:</b> ${contact}`
      const res = await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) throw new Error("send failed")
      setIsSent(true)
      setTimeout(() => setIsOpen(false), 2500)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full md:max-w-md bg-neutral-900 border border-neutral-800 rounded-t-2xl md:rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 rounded hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            {isSent ? "Отправлено!" : heading}
          </h2>
          {!isSent && (
            <p className="text-sm text-neutral-400">{subheading}</p>
          )}
        </div>

        {isSent ? (
          <div className="text-center py-4">
            <p className="text-green-400 font-semibold text-lg">Отправлено! Напишу скоро 👍</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Твое имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm outline-none focus:border-neutral-500 transition-colors disabled:opacity-50"
            />
            <input
              type="text"
              placeholder="Телефон или Telegram"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm outline-none focus:border-neutral-500 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !name || !contact}
              className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
            >
              {isLoading ? "Отправляю..." : buttonText}
            </button>
            {isError && (
              <p className="text-sm text-red-400 text-center">
                Ошибка отправки. Попробуйте ещё раз.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
