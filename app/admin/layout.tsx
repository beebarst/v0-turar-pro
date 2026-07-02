import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: "noindex, nofollow",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background dark">
      <body className="font-sans antialiased bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
