import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
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
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-V2R4YLB3ZE" />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-V2R4YLB3ZE');
      `,
    }}
  />
</head>
      <body className="font-sans antialiased bg-transparent text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
