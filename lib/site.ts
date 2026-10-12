/**
 * Coordonnées du site. Les variables NEXT_PUBLIC_* (Vercel) priment; sinon les valeurs publiées
 * sur la page Facebook de la résidence. À FAIRE: faire confirmer par le owner (téléphone, adresse).
 */
const env = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim() : fallback)

export const site = {
  name: "L.M. Résidence",
  longName: "Résidence Lucien Marie",
  city: "Yaoundé",
  url: env(process.env.NEXT_PUBLIC_BASE_URL, "https://lm-residence.com").replace(/\/$/, ""),
  phone: env(process.env.NEXT_PUBLIC_PHONE, "+237 698 860 695"),
  whatsapp: env(process.env.NEXT_PUBLIC_WHATSAPP ?? process.env.NEXT_PUBLIC_PHONE, "+237 698 860 695"),
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() || "",
  address: env(process.env.NEXT_PUBLIC_ADDRESS, "196, rue 1073, Hippodrome"),
  addressHint: "face à la Chambre de Commerce",
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL?.trim() || "",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
}

export const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`
export const wa = (n: string, text?: string) =>
  `https://wa.me/${n.replace(/\D/g, "")}${text ? `?text=${encodeURIComponent(text)}` : ""}`

export const nav = [
  { href: "/logements", label: "Logements" },
  { href: "/services", label: "Services" },
  { href: "/galerie", label: "Galerie" },
  { href: "/a-propos", label: "La maison" },
  { href: "/contact", label: "Contact" },
] as const

/** Vidéo d'ambiance du premier écran (mp4/webm léger, ~20 s, sans son). null: la photo. */
export const heroVideo: { src: string } | null = null

/** Affichage des prix: en attente de la réponse du propriétaire (§8). Par défaut, affichés. */
export const showPrices = true
