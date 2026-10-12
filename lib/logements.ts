import data from "@/data/logements.json"
import { photo, type Photo } from "./photos"

export interface Logement {
  id: number
  slug: string
  nom: string
  /** Le nom sans « Studio » / « Chambre ». */
  court: string
  type: string
  description: string
  accroche: string
  capacite: number
  surface: string
  prix: number
  devise: string
  equipements: string[]
  highlights: string[]
  photos: Photo[]
}

export const logements: Logement[] = data.map((l) => ({
  id: l.id,
  slug: l.slug,
  nom: l.nom,
  court: l.nom.replace(/^(Studio|Chambre)\s+/i, ""),
  type: l.type,
  description: l.description,
  accroche: l.accroche,
  capacite: l.capacite,
  surface: l.surface.replace("m²", " m²"),
  prix: l.prix,
  devise: l.devise,
  equipements: l.equipements.map((e) => e.replace(/^Trés/, "Très")),
  highlights: l.highlights,
  photos: l.photos.map(photo),
}))

export const logement = (slug: string) => logements.find((l) => l.slug === slug)

export const fcfa = (n: number) => `${n.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA`
export const minPrice = Math.min(...logements.map((l) => l.prix))
