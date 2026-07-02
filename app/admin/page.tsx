"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminLogin } from "@/components/admin/admin-login"
import { AdminPanel } from "@/components/admin/admin-panel"

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated by trying to fetch admin data
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        if (res.ok) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.log("[v0] Auth check failed:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {isAuthenticated ? (
        <AdminPanel onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  )
}
