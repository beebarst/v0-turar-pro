"use client"

import { useEffect, useState } from "react"

export function AmbientGlow() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // shift glow position based on scroll
  const max = typeof window !== "undefined" ? Math.max(document.body.scrollHeight - window.innerHeight, 1) : 1
  const progress = Math.min(scrollY / max, 1)

  // glow 1 moves down/right; glow 2 moves up/left
  const x1 = 20 + progress * 60 // 20% -> 80%
  const y1 = 10 + progress * 70 // 10% -> 80%
  const x2 = 80 - progress * 60
  const y2 = 90 - progress * 70

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ contain: "strict" }}
    >
      <div className="absolute inset-0 bg-black" />
      <div
        className="absolute h-[60vw] w-[60vw] rounded-full blur-[120px] opacity-40 transition-all duration-700 ease-out"
        style={{
          left: `${x1}%`,
          top: `${y1}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(239,68,68,0.55) 0%, rgba(239,68,68,0) 70%)",
        }}
      />
      <div
        className="absolute h-[50vw] w-[50vw] rounded-full blur-[140px] opacity-30 transition-all duration-700 ease-out"
        style={{
          left: `${x2}%`,
          top: `${y2}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(57,255,20,0.35) 0%, rgba(57,255,20,0) 70%)",
        }}
      />
      <div
        className="absolute h-[40vw] w-[40vw] rounded-full blur-[100px] opacity-25 transition-all duration-700 ease-out"
        style={{
          left: `${50 + Math.sin(progress * Math.PI) * 30}%`,
          top: `${50 + Math.cos(progress * Math.PI) * 30}%`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(250,204,21,0.25) 0%, rgba(250,204,21,0) 70%)",
        }}
      />
      {/* subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  )
}
