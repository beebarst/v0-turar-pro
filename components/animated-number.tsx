"use client"

import { useEffect, useRef, useState } from "react"

export function AnimatedNumber({
  value,
  className,
  suffix = " ₸",
}: {
  value: number
  className?: string
  suffix?: string
}) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  const raf = useRef<number | null>(null)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    if (value === prev.current) return
    const start = prev.current
    const end = value
    const duration = 600
    const startTime = performance.now()

    setPulse(false)
    requestAnimationFrame(() => setPulse(true))

    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(start + (end - start) * eased)
      setDisplay(current)
      if (t < 1) {
        raf.current = requestAnimationFrame(tick)
      } else {
        prev.current = end
      }
    }
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(tick)

    const timeout = setTimeout(() => setPulse(false), 400)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
      clearTimeout(timeout)
    }
  }, [value])

  return (
    <span className={`${className ?? ""} inline-block ${pulse ? "pulse-scale" : ""}`}>
      {new Intl.NumberFormat("ru-RU").format(display)}
      {suffix}
    </span>
  )
}
