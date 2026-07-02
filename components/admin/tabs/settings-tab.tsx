"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_SETTINGS } from "@/lib/kv/defaults"
import type { Settings } from "@/lib/kv/client"

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setSettings(data)
          }
        }
      } catch (err) {
        console.log("[v0] Failed to load settings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleInputChange = (field: keyof Settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStatChange = (index: number, field: "value" | "label", value: string) => {
    setSettings((prev) => ({
      ...prev,
      heroStats: prev.heroStats.map((stat, i) =>
        i === index ? { ...stat, [field]: value } : stat
      ),
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setMessage("Настройки сохранены ✓")
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
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Основные настройки</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Процент скидки (0-1)</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={settings.discountPercent}
                onChange={(e) => handleInputChange("discountPercent", parseFloat(e.target.value))}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Телефон</Label>
              <Input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Telegram ссылка</Label>
              <Input
                type="text"
                value={settings.telegramLink}
                onChange={(e) => handleInputChange("telegramLink", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">WhatsApp ссылка</Label>
              <Input
                type="text"
                value={settings.whatsappLink}
                onChange={(e) => handleInputChange("whatsappLink", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Instagram ссылка</Label>
              <Input
                type="text"
                value={settings.instagramLink}
                onChange={(e) => handleInputChange("instagramLink", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Теглайн в хедере</Label>
              <Input
                type="text"
                value={settings.headerTagline}
                onChange={(e) => handleInputChange("headerTagline", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Hero секция</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-neutral-300">Заголовок</Label>
            <Input
              type="text"
              value={settings.heroHeading}
              onChange={(e) => handleInputChange("heroHeading", e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-neutral-300">Подзаголовок</Label>
            <Input
              type="text"
              value={settings.heroSubheading}
              onChange={(e) => handleInputChange("heroSubheading", e.target.value)}
              className="bg-neutral-800 border-neutral-700 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-neutral-300">Кнопка 1 (основная)</Label>
              <Input
                type="text"
                value={settings.heroCtaPrimary}
                onChange={(e) => handleInputChange("heroCtaPrimary", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-neutral-300">Кнопка 2 (вторичная)</Label>
              <Input
                type="text"
                value={settings.heroCtaSecondary}
                onChange={(e) => handleInputChange("heroCtaSecondary", e.target.value)}
                className="bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-neutral-300">Статистика</Label>
            {settings.heroStats.map((stat, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Значение"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
                <Input
                  type="text"
                  placeholder="Подпись"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                  className="bg-neutral-800 border-neutral-700 text-white"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
        {isSaving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  )
}
