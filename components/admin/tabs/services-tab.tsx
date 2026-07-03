"use client"

import { useEffect, useState } from "react"
import { DEFAULT_SERVICES } from "@/lib/kv/defaults"
import type { Service } from "@/lib/kv/client"

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm outline-none focus:border-neutral-500 transition-colors disabled:opacity-50"

const labelCls = "block text-sm font-medium text-neutral-300 mb-1"

const CATEGORIES = ["wedding", "events", "social", "business"] as const

const CATEGORY_LABELS: Record<string, string> = {
  wedding: "Свадьбы",
  events: "Мероприятия",
  social: "Соцсети",
  business: "Бизнес",
}

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/services")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) setServices(data)
        }
      } catch (err) {
        console.log("[v0] Failed to load services:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleAdd = () => {
    setServices((prev) => [
      ...prev,
      {
        id: `service-${Date.now()}`,
        title: "Новая услуга",
        description: "",
        price: 0,
        category: "wedding",
        order: prev.length + 1,
      },
    ])
  }

  const handleRemove = (id: string) => setServices((prev) => prev.filter((s) => s.id !== id))

  const handleUpdate = (id: string, field: keyof Service, value: unknown) =>
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)))

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      })
      setMessage(res.ok ? "Услуги сохранены ✓" : "Ошибка при сохранении")
    } catch {
      setMessage("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-white py-8">Загрузка...</div>

  return (
    <div className="space-y-4">
      {services.map((service) => (
        <div key={service.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Название</label>
              <input
                type="text"
                value={service.title}
                onChange={(e) => handleUpdate(service.id, "title", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Цена (₸)</label>
              <input
                type="number"
                value={service.price}
                onChange={(e) => handleUpdate(service.id, "price", parseInt(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Категория</label>
              <select
                value={service.category}
                onChange={(e) => handleUpdate(service.id, "category", e.target.value)}
                className={inputCls}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Порядок</label>
              <input
                type="number"
                value={service.order ?? 0}
                onChange={(e) => handleUpdate(service.id, "order", parseInt(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Описание</label>
            <textarea
              value={service.description}
              onChange={(e) => handleUpdate(service.id, "description", e.target.value)}
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <input
              type="checkbox"
              id={`hourly-${service.id}`}
              checked={service.hourly || false}
              onChange={(e) => handleUpdate(service.id, "hourly", e.target.checked)}
              className="w-4 h-4 accent-red-600"
            />
            <label htmlFor={`hourly-${service.id}`} className="text-sm text-neutral-300">
              Почасовая ставка
            </label>
          </div>
          <button
            onClick={() => handleRemove(service.id)}
            className="mt-4 w-full py-2 px-4 rounded-lg bg-red-900/40 hover:bg-red-900/70 text-red-400 hover:text-red-300 text-sm font-medium transition-colors border border-red-900/50"
          >
            Удалить
          </button>
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="w-full py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-sm font-medium transition-colors border border-neutral-700"
      >
        + Добавить услугу
      </button>

      {message && (
        <div
          className={`p-4 rounded-lg text-sm font-medium ${
            message.includes("✓")
              ? "bg-green-900/50 text-green-300 border border-green-800"
              : "bg-red-900/50 text-red-300 border border-red-800"
          }`}
        >
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
      >
        {isSaving ? "Сохранение..." : "Сохранить все"}
      </button>
    </div>
  )
}
