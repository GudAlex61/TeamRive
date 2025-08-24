import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "900"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Team Rive - Аренда спортивных баз в России",
  description:
    "Современные базы для спортивных сборов в Москве, Волгограде и Сочи. Полный комплекс услуг для команд и тренеров.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <style>{`
html {
  font-family: ${inter.style.fontFamily};
  --font-sans: ${inter.variable};
  --font-serif: ${playfair.variable};
}
        `}</style>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
