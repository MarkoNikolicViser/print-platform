import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PrintSerbia - Online Štamparija",
  description: "Naručite štampanje online - bez čekanja u redu",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sr" className="antialiased">
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  )
}
