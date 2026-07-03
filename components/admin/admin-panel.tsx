"use client"

import { useState } from "react"
import { SettingsTab } from "./tabs/settings-tab"
import { ServicesTab } from "./tabs/services-tab"
import { PortfolioTab } from "./tabs/portfolio-tab"

type Tab = "settings" | "services" | "portfolio"

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>("settings")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      onLogout()
    } catch (err) {
      console.log("[v0] Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "settings", label: "Настройки" },
    { id: "services", label: "Услуги" },
    { id: "portfolio", label: "Портфолио" },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Администратор</h1>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg border border-neutral-700 text-white hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
          >
            {isLoading ? "Выход..." : "Выйти"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-neutral-900 border border-neutral-800 rounded-lg w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-red-600 text-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "settings" && <SettingsTab />}
        {activeTab === "services" && <ServicesTab />}
        {activeTab === "portfolio" && <PortfolioTab />}
      </div>
    </div>
  )
}
