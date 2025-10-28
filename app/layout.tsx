import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import keywords from "@/data/keywords.json"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "Lucien Marie Résidence – Studios haut de gamme à Yaoundé",
  description:
    "Lucien Marie Résidence (L.M. Résidence) est un cadre résidentiel élégant et sécurisé situé à Yaoundé, au cœur du Cameroun. Trois studios modernes et une chambre individuelle y sont à disposition, alliant confort, autonomie, services personnalisés, cuisinier sur place, véhicule avec chauffeur et sécurité DAK 24/7. Idéal pour professionnels, expatriés, étudiants ou visiteurs recherchant un environnement calme, fonctionnel et raffiné, pour un séjour court ou long.",
  keywords,
  icons: [{ rel: "icon", url: "/logo.png" }]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  )
}
