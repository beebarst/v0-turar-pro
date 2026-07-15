"use client"

import { useEffect, useState } from "react"
import { DEFAULT_PORTFOLIO } from "@/lib/kv/defaults"
import type { PortfolioItem } from "@/lib/kv/client"

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

export function PortfolioTab() {
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/portfolio")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) setItems(data)
        }
      } catch (err) {
        console.log("[v0] Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const handleAdd = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `portfolio-${Date.now()}`,
        title: "Новая работа",
        category: "wedding",
        tag: "Тег",
        imageUrl: "",
        videoUrl: "",
        order: prev.length + 1,
      },
    ])
  }

  const handleRemove = (id: string) => setItems((prev) => prev.filter((item) => item.id !== id))

  const handleUpdate = (id: string, field: keyof PortfolioItem, value: unknown) =>
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })
      setMessage(res.ok ? "Портфолио сохранено ✓" : "Ошибка при сохранении")
    } catch {
      setMessage("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-white py-8">Загрузка...</div>

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Название</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdate(item.id, "title", e.target.value)}
                className={inputCls}
              />
            </div>
<div>
              <label className={labelCls}>Категория</label>
              <select
                value={item.category}
                onChange={(e) => handleUpdate(item.id, "category", e.target.value)}
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
              <label className={labelCls}>Ориентация</label>
              <select
                value={item.orientation ?? "horizontal"}
                onChange={(e) => handleUpdate(item.id, "orientation", e.target.value)}
                className={inputCls}
              >
                <option value="horizontal">Горизонтальное</option>
                <option value="vertical">Вертикальное (Reels/TikTok)</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Тег</label>
              <input
                type="text"
                value={item.tag}
                onChange={(e) => handleUpdate(item.id, "tag", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Порядок (в категории)</label>
              <input
                type="number"
                value={item.order ?? 0}
                onChange={(e) => handleUpdate(item.id, "order", parseInt(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Порядок (в разделе Все)</label>
              <input
                type="number"
                value={item.globalOrder ?? 0}
                onChange={(e) => handleUpdate(item.id, "globalOrder", parseInt(e.target.value) || 0)}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className={labelCls}>Ссылка на изображение</label>
            <input
              type="text"
              placeholder="https://..."
              value={item.imageUrl}
              onChange={(e) => handleUpdate(item.id, "imageUrl", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Ссылка на видео</label>
            <input
              type="text"
              placeholder="https://..."
              value={item.videoUrl ?? ""}
              onChange={(e) => handleUpdate(item.id, "videoUrl", e.target.value)}
              className={inputCls}
            />
          </div>
         <div className="mt-4">
            <label className={labelCls}>Описание работы</label>
            <textarea
              rows={3}
              placeholder="Работал над этим проектом..."
              value={item.description ?? ""}
              onChange={(e) => handleUpdate(item.id, "description", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="mt-4">
            <label className={labelCls}>Теги (через пробел)</label>
            <input
              type="text"
              placeholder="#монтаж #сценарий #reels"
              value={item.tags ?? ""}
              onChange={(e) => handleUpdate(item.id, "tags", e.target.value)}
              className={inputCls}
            />
          </div>
          <button
            onClick={() => handleRemove(item.id)}
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
        + Добавить работу
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
