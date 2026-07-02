"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function LeadPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const popupShown = sessionStorage.getItem("popup_shown")
      if (!popupShown) {
        setIsOpen(true)
        sessionStorage.setItem("popup_shown", "true")
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !contact) return

    setIsLoading(true)

    try {
      const text = `Новый лид из попапа:\nИмя: ${name}\nКонтакт: ${contact}`
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      setIsSent(true)
      setTimeout(() => {
        setIsOpen(false)
      }, 2000)
    } catch (err) {
      console.log("[v0] Failed to send:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto"
        onClick={handleClose}
      />

      {/* Popup */}
      <div className="relative w-full md:w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-t-2xl md:rounded-2xl p-6 animate-in slide-in-from-bottom-5 md:zoom-in-95 pointer-events-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1 hover:bg-neutral-800 rounded transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white mb-2">
            {isSent ? "Отправлено!" : "Свободные даты разбирают быстро"}
          </h2>
          {!isSent && (
            <p className="text-sm text-neutral-400">
              Оставь контакт — я напишу с актуальным расписанием
            </p>
          )}
        </div>

        {isSent ? (
          <div className="text-center">
            <p className="text-green-400 font-semibold mb-1">Отправлено! Напишу тебе скоро 👍</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Твое имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              disabled={isLoading}
            />

            <Input
              type="text"
              placeholder="Телефон или Telegram"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
              disabled={isLoading}
            />

            <Button
              type="submit"
              className="w-full bg-brand-red hover:bg-red-600 text-white font-semibold"
              disabled={isLoading || !name || !contact}
            >
              {isLoading ? "Отправляю..." : "Узнать свободные даты"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
