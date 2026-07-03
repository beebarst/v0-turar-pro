"use client"

import { useEffect, useState } from "react"
import { DEFAULT_SETTINGS } from "@/lib/kv/defaults"
import type { Settings } from "@/lib/kv/client"

const inputCls =
  "w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 text-sm outline-none focus:border-neutral-500 transition-colors disabled:opacity-50"

const labelCls = "block text-sm font-medium text-neutral-300 mb-1"

export function SettingsTab() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          const data = await res.json()
          if (data) setSettings(data)
        }
      } catch (err) {
        console.log("[v0] Failed to load settings:", err)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  const set = (field: keyof Settings, value: unknown) =>
    setSettings((prev) => ({ ...prev, [field]: value }))

  const setStat = (idx: number, field: "value" | "label", value: string) =>
    setSettings((prev) => ({
      ...prev,
      heroStats: prev.heroStats.map((s, i) => (i === idx ? { ...s, [field]: value } : s)),
    }))

  const handleSave = async () => {
    setIsSaving(true)
    setMessage("")
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      })
      setMessage(res.ok ? "Настройки сохранены ✓" : "Ошибка при сохранении")
    } catch {
      setMessage("Ошибка при сохранении")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="text-white py-8">Загрузка...</div>

  return (
    <div className="space-y-6">
      {/* Main settings */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Основные настройки</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Скидка (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={settings.discountPercent}
              onChange={(e) => set("discountPercent", parseFloat(e.target.value))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Телефон</label>
            <input
              type="text"
              value={settings.contactPhone}
              onChange={(e) => set("contactPhone", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Telegram ссылка</label>
            <input
              type="text"
              value={settings.telegramLink}
              onChange={(e) => set("telegramLink", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>WhatsApp ссылка</label>
            <input
              type="text"
              value={settings.whatsappLink}
              onChange={(e) => set("whatsappLink", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Instagram ссылка</label>
            <input
              type="text"
              value={settings.instagramLink}
              onChange={(e) => set("instagramLink", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Теглайн в хедере</label>
            <input
              type="text"
              value={settings.headerTagline}
              onChange={(e) => set("headerTagline", e.target.value)}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Hero section */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Hero секция</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Заголовок (белый текст)</label>
            <input
              type="text"
              value={settings.heroHeading}
              onChange={(e) => set("heroHeading", e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Заголовок (красный акцент)</label>
            <input
              type="text"
              value={settings.heroHeadingAccent}
              onChange={(e) => set("heroHeadingAccent", e.target.value)}
              className={inputCls}
            />
          <div className="flex items-center gap-3 col-span-full">
            <input
              type="checkbox"
              id="popupEnabled"
              checked={settings.popupEnabled ?? true}
              onChange={(e) => set("popupEnabled", e.target.checked)}
              className="w-4 h-4 accent-red-500 cursor-pointer"
            />
            <label htmlFor="popupEnabled" className="text-sm text-neutral-300 cursor-pointer">
              Показывать попап при заходе на сайт
            </label>
          </div>
          </div>
          <div>
            <label className={labelCls}>Подзаголовок</label>
            <input
              type="text"
              value={settings.heroSubheading}
              onChange={(e) => set("heroSubheading", e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Кнопка 1 (основная)</label>
              <input
                type="text"
                value={settings.heroCtaPrimary}
                onChange={(e) => set("heroCtaPrimary", e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Кнопка 2 (вторичная)</label>
              <input
                type="text"
                value={settings.heroCtaSecondary}
                onChange={(e) => set("heroCtaSecondary", e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className={labelCls}>Статистика</label>
            <div className="space-y-2">
              {settings.heroStats.map((stat, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Значение"
                    value={stat.value}
                    onChange={(e) => setStat(idx, "value", e.target.value)}
                    className={inputCls}
                  />
                  <input
                    type="text"
                    placeholder="Подпись"
                    value={stat.label}
                    onChange={(e) => setStat(idx, "label", e.target.value)}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

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
        {isSaving ? "Сохранение..." : "Сохранить"}
      </button>
    </div>
  )
}
