"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Site, Texte } from "@/lib/site-types"

const SiteContext = createContext<Site | null>(null)

export function SiteProvider({ site, children }: { site: Site; children: ReactNode }) {
  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>
}

export function useSite(): Site {
  const site = useContext(SiteContext)
  if (!site) throw new Error("useSite outside SiteProvider")
  return site
}

const VIDE: Texte = { titre: "", sousTitre: "", texte: "" }

/** A part of the "Textes du site" section. */
export function useTextes() {
  const { textes } = useSite()
  return (partie: string): Texte => textes[partie] ?? VIDE
}
