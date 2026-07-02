"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SettingsTab } from "./tabs/settings-tab"
import { ServicesTab } from "./tabs/services-tab"
import { PortfolioTab } from "./tabs/portfolio-tab"

interface AdminPanelProps {
  onLogout: () => void
}

export function AdminPanel({ onLogout }: AdminPanelProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      onLogout()
      router.push("/admin")
    } catch (err) {
      console.log("[v0] Logout error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Администратор</h1>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-neutral-700 text-white hover:bg-neutral-900"
            disabled={isLoading}
          >
            {isLoading ? "Выход..." : "Выход"}
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="settings" className="space-y-6">
          <TabsList className="bg-neutral-900 border border-neutral-800">
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-brand-red data-[state=active]:text-white"
            >
              Настройки
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-brand-red data-[state=active]:text-white"
            >
              Услуги
            </TabsTrigger>
            <TabsTrigger
              value="portfolio"
              className="data-[state=active]:bg-brand-red data-[state=active]:text-white"
            >
              Портфолио
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>

          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
