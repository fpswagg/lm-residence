"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BedDouble, Building2, ConciergeBell, FileText, Images, Inbox, LayoutDashboard, ScrollText } from "lucide-react"

const LIENS = [
  ["/dashboard", "Aperçu", LayoutDashboard],
  ["/dashboard/demandes", "Demandes", Inbox],
  ["/dashboard/logements", "Logements", BedDouble],
  ["/dashboard/services", "Services", ConciergeBell],
  ["/dashboard/galerie", "Galerie", Images],
  ["/dashboard/textes", "Textes", FileText],
  ["/dashboard/sejour", "Séjour", ScrollText],
  ["/dashboard/residence", "Résidence", Building2],
] as const

export function DashNav() {
  const ici = usePathname()
  const nav = useRef<HTMLElement>(null)
  // On a phone the menu scrolls sideways: keep the open page in view.
  useEffect(() => {
    nav.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest", inline: "center" })
  }, [ici])
  return (
    <nav ref={nav} aria-label="Tableau de bord" className="flex gap-1 overflow-x-auto lg:flex-col">
      {LIENS.map(([href, label, Icone]) => {
        const actif = href === "/dashboard" ? ici === href : ici.startsWith(href)
        return (
          <Link
            key={href}
            href={href}
            aria-current={actif ? "page" : undefined}
            className={`flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-sm transition ${actif ? "bg-primary font-semibold text-primary-foreground" : "text-foreground/85 hover:bg-muted"}`}
          >
            <Icone className="size-4" /> {label}
          </Link>
        )
      })}
    </nav>
  )
}
