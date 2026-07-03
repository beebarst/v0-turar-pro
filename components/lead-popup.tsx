"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

export function LeadPopup({ enabled = true }: { enabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (window.location.pathname.startsWith("/admin")) return
      setIsOpen(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

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
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-end md:items-center
