"use client"

import { useState, useEffect, useCallback } from "react"
import { Save, Lock, Settings, List, Film, Eye, EyeOff, Plus, Trash2, LogOut } from "lucide-react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StoredSettings = {
  discountPercent: number
  phone: string
  whatsapp: string
  telegram: string
  instagram: string
}

type Service = {
  id: string
  title: string
  description: string
  basePrice: number
  hourly?: boolean
}

type ServiceCategory = {
  id: string
  title: string
  icon: string
  services: Service[]
}

type PortfolioItem = {
  id: number
  title: string
  category: "wedding" | "events" | "social" | "business"
  tag: string
  thumb: string
  videoUrl?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function apiFetch(path: string, password: string, method = "GET", body?: unknown) {
  return fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-admin-password": password,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

// ---------------------------------------------------------------------------
// Login screen
// ---------------------------------------------------------------------------
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await apiFetch("/api/admin/settings", pw)
    setLoading(false)
    if (res.ok) {
      onLogin(pw)
    } else {
      setError("Неверный пароль")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 rounded-2xl border border-white/10 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-brand-red/10 border border-brand-red/20 flex items-center justify-center">
            <Lock className="h-5 w-5 text-brand-red" />
          </div>
          <div>
            <div className="font-bold text-white">TURAR.PRO</div>
            <div className="text-xs text-white/40">Панель управления</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Пароль администратора"
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 pr-11 text-white placeholder-white/30 focus:outline-none focus:border-brand-red/50 transition-colors"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !pw}
            className="w-full py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Проверяем..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Settings tab
// ---------------------------------------------------------------------------
function SettingsTab({ password }: { password: string }) {
  const [form, setForm] = useState<StoredSettings>({
    discountPercent: 40,
    phone: "",
    whatsapp: "",
    telegram: "",
    instagram: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiFetch("/api/admin/settings", password)
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !data.error) {
          setForm((f) => ({ ...f, ...data }))
        }
      })
      .finally(() => setLoading(false))
  }, [password])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await apiFetch("/api/admin/settings", password, "POST", form)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Загрузка...</div>

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <label className="block text-sm text-white/60 mb-2">Скидка (%)</label>
        <input
          type="number"
          min={0}
          max={100}
          value={form.discountPercent}
          onChange={(e) => setForm((f) => ({ ...f, discountPercent: Number(e.target.value) }))}
          className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-red/50 transition-colors"
        />
      </div>
      {(["phone", "whatsapp", "telegram", "instagram"] as const).map((key) => (
        <div key={key}>
          <label className="block text-sm text-white/60 mb-2 capitalize">{key}</label>
          <input
            type="text"
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-red/50 transition-colors"
            placeholder={
              key === "phone" ? "+7 776 100 10 66" :
              key === "whatsapp" ? "https://wa.me/77761001066" :
              key === "telegram" ? "https://t.me/+77761001066" :
              "https://instagram.com/beebars_t"
            }
          />
        </div>
      ))}
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Сохраняем..." : saved ? "Сохранено" : "Сохранить"}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Services tab
// ---------------------------------------------------------------------------
function ServicesTab({ password }: { password: string }) {
  const [categories, setCategories] = useState<ServiceCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiFetch("/api/admin/services", password)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCategories(data) })
      .finally(() => setLoading(false))
  }, [password])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await apiFetch("/api/admin/services", password, "POST", categories)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateService(catIdx: number, svcIdx: number, field: keyof Service, value: string | number | boolean) {
    setCategories((cats) => cats.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      services: cat.services.map((svc, si) => si !== svcIdx ? svc : { ...svc, [field]: value }),
    }))
  }

  function deleteService(catIdx: number, svcIdx: number) {
    setCategories((cats) => cats.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      services: cat.services.filter((_, si) => si !== svcIdx),
    }))
  }

  function addService(catIdx: number) {
    setCategories((cats) => cats.map((cat, ci) => ci !== catIdx ? cat : {
      ...cat,
      services: [...cat.services, { id: `new-${Date.now()}`, title: "", description: "", basePrice: 0 }],
    }))
  }

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Загрузка...</div>

  return (
    <div className="space-y-8">
      {categories.map((cat, catIdx) => (
        <div key={cat.id} className="bg-zinc-900 rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
            <h3 className="font-semibold text-white">{cat.title}</h3>
          </div>
          <div className="divide-y divide-white/5">
            {cat.services.map((svc, svcIdx) => (
              <div key={svc.id} className="p-5 space-y-3">
                <div className="flex gap-3">
                  <input
                    value={svc.title}
                    onChange={(e) => updateService(catIdx, svcIdx, "title", e.target.value)}
                    placeholder="Название"
                    className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
                  />
                  <button
                    onClick={() => deleteService(catIdx, svcIdx)}
                    className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <textarea
                  value={svc.description}
                  onChange={(e) => updateService(catIdx, svcIdx, "description", e.target.value)}
                  placeholder="Описание"
                  rows={2}
                  className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-brand-red/50"
                />
                <div className="flex gap-3 items-center">
                  <div className="flex-1">
                    <label className="text-xs text-white/40 mb-1 block">Базовая цена (₸)</label>
                    <input
                      type="number"
                      value={svc.basePrice}
                      onChange={(e) => updateService(catIdx, svcIdx, "basePrice", Number(e.target.value))}
                      className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-white/60 mt-4 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={!!svc.hourly}
                      onChange={(e) => updateService(catIdx, svcIdx, "hourly", e.target.checked)}
                      className="accent-brand-red"
                    />
                    За час
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-white/5">
            <button
              onClick={() => addService(catIdx)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Добавить услугу
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Сохраняем..." : saved ? "Сохранено" : "Сохранить услуги"}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Portfolio tab
// ---------------------------------------------------------------------------
const CATEGORY_OPTIONS = [
  { value: "wedding", label: "Свадьбы" },
  { value: "events", label: "Мероприятия" },
  { value: "social", label: "Соцсети" },
  { value: "business", label: "Бизнес" },
]

function PortfolioTab({ password }: { password: string }) {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    apiFetch("/api/admin/portfolio", password)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setItems(data) })
      .finally(() => setLoading(false))
  }, [password])

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await apiFetch("/api/admin/portfolio", password, "POST", items)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(idx: number, field: keyof PortfolioItem, value: string | number) {
    setItems((arr) => arr.map((item, i) => i !== idx ? item : { ...item, [field]: value }))
  }

  function addItem() {
    setItems((arr) => [...arr, {
      id: Date.now(),
      title: "",
      category: "wedding",
      tag: "",
      thumb: "linear-gradient(135deg,#1a0a0a,#3a1a1a)",
    }])
  }

  function deleteItem(idx: number) {
    setItems((arr) => arr.filter((_, i) => i !== idx))
  }

  if (loading) return <div className="text-white/40 text-sm py-8 text-center">Загрузка...</div>

  return (
    <div className="space-y-4">
      {items.map((item, idx) => (
        <div key={item.id} className="bg-zinc-900 rounded-2xl border border-white/10 p-5 space-y-3">
          <div className="flex gap-3">
            <input
              value={item.title}
              onChange={(e) => update(idx, "title", e.target.value)}
              placeholder="Название работы"
              className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
            />
            <button
              onClick={() => deleteItem(idx)}
              className="p-2 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Категория</label>
              <select
                value={item.category}
                onChange={(e) => update(idx, "category", e.target.value)}
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
              >
                {CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Тег</label>
              <input
                value={item.tag}
                onChange={(e) => update(idx, "tag", e.target.value)}
                placeholder="Свадебный фильм"
                className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Ссылка на видео (YouTube/Vimeo)</label>
            <input
              value={item.videoUrl ?? ""}
              onChange={(e) => update(idx, "videoUrl", e.target.value)}
              placeholder="https://youtu.be/..."
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Превью (URL картинки или CSS gradient)</label>
            <input
              value={item.thumb}
              onChange={(e) => update(idx, "thumb", e.target.value)}
              placeholder="https://... или linear-gradient(...)"
              className="w-full bg-zinc-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-red/50"
            />
          </div>
        </div>
      ))}

      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors w-full justify-center text-sm"
      >
        <Plus className="h-4 w-4" />
        Добавить работу
      </button>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-red hover:bg-red-600 text-white font-semibold transition-colors disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Сохраняем..." : saved ? "Сохранено" : "Сохранить портфолио"}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main admin page
// ---------------------------------------------------------------------------
type Tab = "settings" | "services" | "portfolio"

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>("settings")

  if (!password) {
    return <LoginScreen onLogin={setPassword} />
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "settings", label: "Настройки", icon: <Settings className="h-4 w-4" /> },
    { id: "services", label: "Услуги", icon: <List className="h-4 w-4" /> },
    { id: "portfolio", label: "Портфолио", icon: <Film className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-900/60 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">TURAR<span className="text-brand-red">.</span>PRO</span>
            <span className="text-white/20 hidden sm:inline">/</span>
            <span className="text-white/40 text-sm hidden sm:inline">Админ</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Сайт</span>
            </a>
            <button
              onClick={() => setPassword(null)}
              className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Выйти</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 rounded-xl p-1 mb-8 w-fit">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id
                  ? "bg-brand-red text-white"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === "settings" && <SettingsTab password={password} />}
        {tab === "services" && <ServicesTab password={password} />}
        {tab === "portfolio" && <PortfolioTab password={password} />}
      </div>
    </div>
  )
}
