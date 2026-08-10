"use client"

import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[v0] Unhandled page error:", error)
  }, [error])

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-black text-white px-4">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-bold mb-3">Что-то пошло не так</h1>
        <p className="text-white/60 mb-8 text-sm leading-relaxed">
          Страница не смогла загрузиться корректно. Попробуйте обновить —
          обычно это помогает.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-brand-red text-white font-semibold hover:bg-red-600 transition-all duration-300"
        >
          Обновить страницу
        </button>
      </div>
    </main>
  )
}
