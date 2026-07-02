"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DEFAULT_SERVICES } from "@/lib/kv/defaults"
import type { Service } from "@/lib/kv/client"

const CATEGORIES = ["wedding", "events", "social", "business"] as const

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadServices = async () => {
      try {
        const res = await fetch("/api/admin/services")
        if (res.ok) {
          const data = await res.json()
          if (data && data.length > 0) {
            setServices(data)
          }
        }
      } catch (err) {
        console.log("[v0] Failed to load services:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleAddService = () => {
    const newService: Service = {
      id: `service-${Date.now()}`,
      title: "Новая услуга",
      description: "",
      price: 0,
      category: "wedding",
      order: services.length + 1,
    }
    setServices([...services, newService])
  }

  const handleRemoveService = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleUpdateService = (id: string, field: keyof Service, value: any) => {
    setServices(services.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(services),
      })

      if (res.ok) {
        setMessage("Услуги сохранены ✓")
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
      {services.map((service) => (
        <Card key={service.id} className="bg-neutral-900 border-neutral-800">
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-neutral-300">Название</Label>
                <Input
                  type="text"
                  value={service.title}
                  onChange={(e) => handleUpdateService(service.id, "title", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Цена (₸)</Label>
                <Input
                  type="number"
                  value={service.price}
                  onChange={(e) => handleUpdateService(service.id, "price", parseInt(e.target.value))}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-neutral-300">Категория</Label>
                <select
                  value={service.category}
                  onChange={(e) => handleUpdateService(service.id, "category", e.target.value)}
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
                <Label className="text-neutral-300">Порядок</Label>
                <Input
                  type="number"
                  value={service.order || 0}
                  onChange={(e) => handleUpdateService(service.id, "order", parseInt(e.target.value))}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Описание</Label>
              <textarea
                value={service.description}
                onChange={(e) => handleUpdateService(service.id, "description", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white min-h-20 resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id={`hourly-${service.id}`}
                checked={service.hourly || false}
                onCheckedChange={(checked) => handleUpdateService(service.id, "hourly", checked)}
              />
              <Label htmlFor={`hourly-${service.id}`} className="text-neutral-300">
                Почасовая ставка
              </Label>
            </div>

            <Button
              onClick={() => handleRemoveService(service.id)}
              className="w-full bg-red-900 hover:bg-red-800 text-white"
            >
              Удалить
            </Button>
          </CardContent>
        </Card>
      ))}

      <Button
        onClick={handleAddService}
        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700"
      >
        + Добавить услугу
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
