"use client"

import { useEffect, useState } from "react"

export function AmbientGlow() {
  const [scrollY, setScrollY] = useState(0)
  const [maxScroll, setMaxScroll] = useState(1)

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY)
      setMaxScroll(Math.max(document.body.scrollHeight - window.innerHeight, 1))
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
    }
  }, [])

  const progress = Math.min(scrollY / maxScroll, 1)

  // glow 1 moves down/right; glow 2 moves up/left
  const x1 = 20 + progress * 60
  const y1 = 10 + progress * 70
  const x2 = 80 - progress * 60
  const y2 = 90 - progress * 70

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      {/* Base dark background with radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black" />
      
      {/* Primary red glow - larger and more visible */}
      <div
        className="absolute h-[80vw] w-[80vw] rounded-full blur-[150px] opacity-50 transition-all duration-700 ease-out"
        style={{
          left: `${x1}%`,
          top: `${y1}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(239,68,68,0.6) 0%, rgba(239,68,68,0) 70%)",
        }}
      />
      
      {/* Secondary subtle warm glow */}
      <div
        className="absolute h-[60vw] w-[60vw] rounded-full blur-[180px] opacity-35 transition-all duration-700 ease-out"
        style={{
          left: `${x2}%`,
          top: `${y2}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(251,146,60,0.4) 0%, rgba(251,146,60,0) 70%)",
        }}
      />
      
      {/* Tertiary moving accent */}
      <div
        className="absolute h-[50vw] w-[50vw] rounded-full blur-[120px] opacity-25 transition-all duration-700 ease-out"
        style={{
          left: `${50 + Math.sin(progress * Math.PI) * 30}%`,
          top: `${50 + Math.cos(progress * Math.PI) * 30}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      
      {/* Top studio light effect */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[50vh] w-[120vw] blur-[100px] opacity-20"
        style={{
          background: "radial-gradient(ellipse at top, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
      />
      
      {/* subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
