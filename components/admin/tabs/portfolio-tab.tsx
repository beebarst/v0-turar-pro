"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { DEFAULT_PORTFOLIO } from "@/lib/kv/defaults"
import type { PortfolioItem } from "@/lib/kv/client"

const CATEGORIES = ["wedding", "events", "social", "business"] as const

export function PortfolioTab() {
  const [items, setItems] = useState<PortfolioItem[]>(DEFAULT_PORTFOLIO)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const res = await fetch("/api/admin/portfolio")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setItems(data)
          }
        }
      } catch (err) {
        console.log("[v0] Failed to load portfolio:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPortfolio()
  }, [])

  const handleAddItem = () => {
    const newItem: PortfolioItem = {
      id: `portfolio-${Date.now()}`,
      title: "Новая работа",
      category: "wedding",
      tag: "Тег",
      imageUrl: "",
      videoUrl: "",
      order: items.length + 1,
    }
    setItems([...items, newItem])
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleUpdateItem = (id: string, field: keyof PortfolioItem, value: any) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      })

      if (res.ok) {
        setMessage("Портфолио сохранено ✓")
      } else {
        setMessage("Ошибка при сохранении")
      }
    } catch (err) {
      console.log("[v0] Save error:", err)
      setMessage("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-white">Загрузка...</div>

  return (
    <div className="space-y-6">
      {items.map((item) => (
        <Card key={item.id} className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-300">Название</Label>
                <Input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleUpdateItem(item.id, "title", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Категория</Label>
                <select
                  value={item.category}
                  onChange={(e) => handleUpdateItem(item.id, "category", e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Тег</Label>
                <Input
                  type="text"
                  value={item.tag}
                  onChange={(e) => handleUpdateItem(item.id, "tag", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Порядок</Label>
                <Input
                  type="number"
                  value={item.order || 0}
                  onChange={(e) => handleUpdateItem(item.id, "order", parseInt(e.target.value))}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Ссылка на изображение</Label>
              <Input
                type="text"
                placeholder="https://..."
                value={item.imageUrl}
                onChange={(e) => handleUpdateItem(item.id, "imageUrl", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Ссылка на видео</Label>
              <Input
                type="text"
                placeholder="https://..."
                value={item.videoUrl}
                onChange={(e) => handleUpdateItem(item.id, "videoUrl", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <Button
              onClick={() => handleRemoveItem(item.id)}
              className="w-full bg-red-900 hover:bg-red-800 text-white"
            >
              Удалить
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleAddItem}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
      >
        + Добавить работу
      </Button>

      {message && (
        <div className={`p-4 rounded ${message.includes("✓") ? "bg-green-900 text-green-200" : "bg-red-900 text-red-200"}`}>
          {message}
        </div>
      )}

      <Button
        onClick={handleSave}
        className="bg-brand-red hover:bg-red-600 text-white w-full"
        disabled={isSaving}
      >
        {isSaving ? "Сохранение..." : "Сохранить все"}
      </Button>
    </div>
  )
}
