import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "TURAR.PRO — Видеопроизводство полного цикла | Бибарыс Тұрар",
  description:
    "Свадьбы, мероприятия, Reels и бизнес-видео. Рассчитайте стоимость проекта за 1 минуту. Скидка 15% действует ограниченное время.",
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
      <body className="font-sans antialiased bg-transparent text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
