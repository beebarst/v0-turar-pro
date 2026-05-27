"use client"

import { useEffect, useState } from "react"
import { Flame } from "lucide-react"

export function FloatingBadge() {
  const [seconds, setSeconds] = useState(60 * 60)

  useEffect(() => {
    const stored = sessionStorage.getItem("turar_discount_end")
    let end: number
    if (stored) {
      end = parseInt(stored, 10)
    } else {
      end = Date.now() + 60 * 60 * 1000
      sessionStorage.setItem("turar_discount_end", String(end))
    }

    const update = () => {
      const remaining = Math.max(0, Math.floor((end - Date.now()) / 1000))
      setSeconds(remaining)
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0")
  const ss = String(seconds % 60).padStart(2, "0")

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 w-full max-w-fit pointer-events-none">
      <div className="badge-pulse pointer-events-auto rounded-2xl bg-black/75 backdrop-blur-xl border border-yellow-400/30 px-5 py-3 md:px-8 md:py-5 shadow-2xl">
        <div className="flex items-center gap-3 md:gap-5">
          <div className="h-10 w-10 md:h-14 md:w-14 rounded-xl bg-yellow-400/15 border border-yellow-400/40 flex items-center justify-center shrink-0">
            <Flame className="h-5 w-5 md:h-7 md:w-7 text-yellow-400" />
          </div>
          <div className="leading-tight">
            <div className="text-yellow-400 font-bold text-base md:text-2xl tracking-tight">
              Скидка 15% сгорит через
            </div>
            <div className="text-yellow-400 font-mono font-black text-2xl md:text-4xl tabular-nums tracking-wider mt-0.5">
              {mm}:{ss}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
