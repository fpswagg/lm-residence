import logements from "@/data/logements.json"
import services from "@/data/services.json"
import gallery from "@/data/gallery.json"
import keywords from "@/data/keywords.json"
import content from "@/data/site-content.json"
import type { Carte, Site, Texte } from "./site-types"

const lignes = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean)
export const paragraphes = (t: string) => t.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

const textes: Record<string, Texte> = Object.fromEntries(
  content.textes.map((t) => [t.partie, { titre: t.titre ?? "", sousTitre: t.sousTitre ?? "", texte: t.texte ?? "" }]),
)

/** "Atout 1", "Atout 2"… or "Valeur 1"…, in order. */
export function cartes(all: Record<string, Texte>, prefixe: string): Carte[] {
  return Object.entries(all)
    .filter(([k]) => k.startsWith(`${prefixe} `))
    .sort(([a], [b]) => Number(a.slice(prefixe.length)) - Number(b.slice(prefixe.length)))
    .map(([, t]) => ({ titre: t.titre, description: t.texte }))
}

/** The site's own copy of its content: used when SSS can't be reached, or lacks a piece. */
export const DEFAULT_SITE: Site = {
  contact: {
    phone: process.env.NEXT_PUBLIC_PHONE || "+237 657 030 918",
    email: process.env.NEXT_PUBLIC_EMAIL || "lucienmarieresidence@gmail.com",
    address: process.env.NEXT_PUBLIC_ADDRESS || "Hippodrome, Yaoundé, Cameroun",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "",
  },
  logements: logements.map((l) => ({ ...l, id: String(l.id) })),
  services: services.map((s) => ({ ...s, id: String(s.id) })),
  galerie: gallery.images.map((image, id) => ({ ...image, id })),
  categories: gallery.categories,
  textes,
  atouts: cartes(textes, "Atout"),
  valeurs: cartes(textes, "Valeur"),
  histoire: paragraphes(content.histoire),
  regles: content.regles.map((r) => ({ titre: r.titre, lignes: lignes(r.texte) })),
  annulation: lignes(content.annulation),
  inclus: content.inclus,
  horaires: content.horaires,
  seo: {
    titre: textes["Référencement"]?.titre ?? "",
    description: textes["Référencement"]?.texte ?? "",
    motsCles: keywords,
  },
}
