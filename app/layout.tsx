import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { getSite } from "@/lib/sss"
import { SiteProvider } from "@/components/site-provider"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getSite()
  return {
    title: seo.titre,
    description: seo.description,
    keywords: seo.motsCles,
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="bg-background text-foreground">
        <SiteProvider site={await getSite()}>{children}</SiteProvider>
      </body>
    </html>
  )
}
