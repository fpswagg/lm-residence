import type React from "react"
import type { Metadata, Viewport } from "next"
import { Fraunces, Geist } from "next/font/google"
import "./globals.css"
import keywords from "@/data/keywords.json"
import { MotionProvider } from "@/components/motion/motion-provider"
import { TransitionProvider } from "@/components/site/transition"
import { Preloader } from "@/components/site/preloader"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import { Cursor } from "@/components/site/cursor"
import { WhatsAppFloat } from "@/components/site/whatsapp-float"
import { site } from "@/lib/site"

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
  variable: "--font-fraunces",
  display: "swap",
})
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" })

const description =
  "Résidence Lucien Marie (L.M. Résidence): trois studios et une chambre dans une maison calme et sécurisée à Yaoundé, quartier Hippodrome. Cuisinier sur place, véhicule avec chauffeur, sécurité DAK 24/7. Séjours courts ou longs."

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "L.M. Résidence — Studios et chambre à Yaoundé",
    template: "%s — L.M. Résidence",
  },
  description,
  keywords,
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "L.M. Résidence",
    title: "L.M. Résidence — Une maison, quatre portes, à Yaoundé",
    description,
    images: [{ url: "/img/salle-a-manger-ac.jpg", width: 1611, height: 2400, alt: "Studio Alain-Christophe, L.M. Résidence" }],
  },
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
}

export const viewport: Viewport = {
  themeColor: "#f3ede3",
  width: "device-width",
  initialScale: 1,
}

/** Avant le premier rendu: « js » (le préloader peut s'afficher) et « seen » (déjà vu, ou moins
 *  d'animations demandées: on le saute). */
const boot = `(function(d){var h=d.documentElement;h.classList.add('js');try{if(sessionStorage.getItem('lm-seen')||matchMedia('(prefers-reduced-motion: reduce)').matches)h.classList.add('seen')}catch(e){h.classList.add('seen')}})(document)`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${geist.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <MotionProvider>
          <TransitionProvider>
            <a
              href="#contenu"
              className="label fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-ebony px-5 py-3 text-paper focus:translate-y-0"
            >
              Aller au contenu
            </a>
            <Preloader />
            <Header />
            <main id="contenu">{children}</main>
            <Footer />
            <WhatsAppFloat />
            <Cursor />
            <div className="grain" aria-hidden />
          </TransitionProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
