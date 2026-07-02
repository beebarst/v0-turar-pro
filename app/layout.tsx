import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { LeadPopup } from "@/components/lead-popup"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Видеограф в Костанае | Съемка свадеб, Reels, SMM — Бибарыс Тұрар",
  description:
    "Профессиональное видеопроизводство полного цикла в Костанае. Love story, промо-ролики для бизнеса, монтаж и SMM. Интерактивный калькулятор.",
  generator: "v0.app",
}

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} bg-background dark`}>
      <head>
        {/* META PIXEL: ТВОЙ_ID_ПИКСЕЛЯ_ЗДЕСЬ */}
      </head>
      <body className="font-sans antialiased bg-transparent text-white overflow-x-hidden">
        <LeadPopup />
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
