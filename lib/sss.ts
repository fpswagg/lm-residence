import "server-only"
import { cartes, DEFAULT_SITE, paragraphes } from "./site-defaults"
import type { GalleryImage, Logement, Service, Site, Texte } from "./site-types"

/**
 * The site's content comes from SSS (business "Lucien Marie Résidence"), through
 * its public page data: no key needed. A change in SSS shows here within a minute.
 * Anything SSS can't give falls back on the site's own copy, so the site never breaks.
 */
const API = (process.env.SSS_API_URL || "https://sss-api.fpswagg.site").replace(/\/$/, "")
const SLUG = process.env.SSS_STORE_SLUG || "lucien-marie-residence"
const BASE = `${API}/api/v1/stores/${SLUG}/showcase`

const BLOCS = {
  galerie: { id: "c_8iy6s8r6", name: "Galerie du site" },
  textes: { id: "c_hrnxse3r", name: "Textes du site" },
  regles: { id: "c_cb616crn", name: "Règles du séjour" },
}

type Json = Record<string, any>
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")
const lignes = (t: string) => t.split("\n").map((l) => l.trim()).filter(Boolean)
const nonVide = <T,>(list: T[], secours: T[]) => (list.length ? list : secours)

function logementDe(p: Json, index: number): Logement {
  const m: Json = p.metadata ?? {}
  const images = (p.images ?? []).map((i: Json) => str(i.url)).filter((u: string) => u && !u.includes("placeholder"))
  const equipements = Array.isArray(m.equipements) ? m.equipements.map(String) : str(m.equipements).split(/[,;\n]/)
  return {
    id: String(m.ordre ?? p.sku ?? index),
    nom: str(p.name),
    type: str(p.category).toLowerCase(),
    description: str(p.description),
    capacite: Number(m.capacite) || null,
    surface: str(m.surface),
    prix: Number(p.price) || 0,
    devise: str(p.currency) || "FCFA",
    disponibilite: p.active !== false && p.inStock !== false,
    equipements: equipements.map((e: string) => e.trim()).filter(Boolean),
    images: images.length ? images : ["/placeholder.jpg"],
  }
}

const position = (x: Json) => {
  const n = Number(x.metadata?.ordre)
  return Number.isFinite(n) && x.metadata?.ordre != null ? n : Number.MAX_SAFE_INTEGER
}

function serviceDe(r: Json, index: number): Service {
  // In SSS the details are the second paragraph of the description.
  const [description = "", ...details] = paragraphes(str(r.data?.description))
  return {
    id: String(r.metadata?.ordre ?? r.id ?? index),
    nom: str(r.name),
    description,
    details: details.join(" "),
    devise: str(r.data?.currency) || "FCFA",
    periode: str(r.metadata?.periode),
  }
}

const JOURS: [string, string][] = [
  ["mon", "Lundi"], ["tue", "Mardi"], ["wed", "Mercredi"], ["thu", "Jeudi"], ["fri", "Vendredi"], ["sat", "Samedi"], ["sun", "Dimanche"],
]

/** Opening hours, days with the same hours grouped: "Lundi - Vendredi  08:00 - 18:00". */
function horairesDe(days: Json | undefined): Site["horaires"] {
  if (!days) return []
  const rows = JOURS.map(([k, nom]) => ({
    nom,
    heures: (days[k] ?? []).map((s: Json) => `${s.from} - ${s.to}`).join(", ") || "Fermé",
  }))
  const out: { de: string; a: string; heures: string }[] = []
  for (const r of rows) {
    const last = out[out.length - 1]
    if (last && last.heures === r.heures) last.a = r.nom
    else out.push({ de: r.nom, a: r.nom, heures: r.heures })
  }
  return out.map((g) => ({ jours: g.de === g.a ? g.de : `${g.de} - ${g.a}`, heures: g.heures }))
}

function versSite(d: Json): Site {
  const D = DEFAULT_SITE
  const blocs: Json[] = d.business?.sections?.custom ?? []
  const bloc = (b: { id: string; name: string }): Json[] =>
    (blocs.find((x) => x.id === b.id) ?? blocs.find((x) => x.name === b.name))?.entries ?? []

  const textesSss: Record<string, Texte> = {}
  for (const e of bloc(BLOCS.textes)) {
    const partie = str(e["Partie"])
    if (partie) textesSss[partie] = { titre: str(e["Titre"]), sousTitre: str(e["Sous-titre"]), texte: str(e["Texte"]) }
  }
  // A part missing in SSS keeps the site's text; a card ("Valeur 2") removed in SSS goes away.
  const textes = { ...D.textes, ...textesSss }
  const memeCartes = (prefixe: string) => {
    const a = cartes(textesSss, prefixe)
    return a.length ? a : cartes(D.textes, prefixe)
  }

  const idCategorie = new Map(D.categories.map((c) => [c.name, c.id]))
  const galerie: GalleryImage[] = bloc(BLOCS.galerie)
    .filter((e) => str(e["Photo"]))
    .map((e, id) => ({
      id,
      title: str(e["Titre"]),
      description: str(e["Description"]),
      category: idCategorie.get(str(e["Catégorie"])) ?? "",
      url: str(e["Photo"]),
    }))

  const s: Json = d.store ?? {}
  const socials: Json = d.showcase?.design?.socials ?? {}
  const motsCles = textesSss["Mots-clés"]?.texte.split(",").map((k) => k.trim()).filter(Boolean) ?? []

  return {
    contact: {
      phone: str(s.phone) || D.contact.phone,
      email: str(s.email) || D.contact.email,
      address: str(s.address) || D.contact.address,
      facebook: str(socials.facebook) || D.contact.facebook,
      instagram: str(socials.instagram) || D.contact.instagram,
      twitter: str(socials.x) || D.contact.twitter,
    },
    logements: nonVide(
      [...(d.products ?? [])].sort((a, b) => position(a) - position(b)).map(logementDe),
      D.logements,
    ),
    services: nonVide(
      [...(d.services ?? [])]
        .filter((r) => r.data?.active !== false)
        .sort((a, b) => position(a) - position(b))
        .map(serviceDe),
      D.services,
    ),
    galerie: nonVide(galerie, D.galerie),
    categories: D.categories,
    textes,
    atouts: memeCartes("Atout"),
    valeurs: memeCartes("Valeur"),
    histoire: nonVide(paragraphes(str(d.showcase?.aboutMarkdown)), D.histoire),
    regles: nonVide(
      bloc(BLOCS.regles)
        .map((e) => ({ titre: str(e["Titre"]), lignes: lignes(str(e["Texte"])) }))
        .filter((r) => r.titre && r.lignes.length),
      D.regles,
    ),
    annulation: nonVide(lignes(str(d.business?.policies?.cancellation)), D.annulation),
    inclus: nonVide((d.business?.amenities ?? []).map(str).filter(Boolean), D.inclus),
    horaires: nonVide(horairesDe(d.business?.hours?.days), D.horaires),
    seo: {
      titre: textes["Référencement"]?.titre || D.seo.titre,
      description: textes["Référencement"]?.texte || D.seo.description,
      motsCles: nonVide(motsCles, D.seo.motsCles),
    },
  }
}

/** Everything the pages show. Same-request calls share one fetch. */
export async function getSite(): Promise<Site> {
  try {
    const res = await fetch(BASE, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60, tags: ["sss"] },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error(`SSS ${res.status}`)
    const body = await res.json()
    return versSite(body.data ?? body)
  } catch (error) {
    console.warn("SSS unavailable, using the site's own copy:", error)
    return DEFAULT_SITE
  }
}

/** A customer's message or booking request: lands in SSS (Retours + Clients), the team is told. */
export async function sendToSss(
  input: { name: string; email?: string; phone?: string; message: string },
  visitorIp?: string | null,
): Promise<void> {
  const clip = (v: string | undefined, max: number) => v?.trim().slice(0, max) || undefined
  const res = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(visitorIp ? { "x-sss-visitor-ip": visitorIp } : {}) },
    body: JSON.stringify({
      name: clip(input.name, 160),
      email: clip(input.email, 160),
      phone: clip(input.phone, 40),
      message: clip(input.message, 4000),
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`SSS ${res.status}`)
}

/** Stops waiting for a slow channel, so a customer never hangs on the form. */
export function within<T>(work: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ])
}

export const visitorIpOf = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null
