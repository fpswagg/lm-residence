import type { MetadataRoute } from "next"
import { site } from "@/lib/site"
import { logements } from "@/lib/logements"

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"]

const pages: [string, Freq, number][] = [
  ["", "weekly", 1],
  ["/logements", "weekly", 0.9],
  ["/reservation", "monthly", 0.9],
  ["/galerie", "weekly", 0.8],
  ["/services", "monthly", 0.8],
  ["/contact", "monthly", 0.7],
  ["/a-propos", "monthly", 0.6],
  ["/politiques", "yearly", 0.3],
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    ...pages.map(([p, changeFrequency, priority]) => ({ url: `${site.url}${p}`, lastModified: now, changeFrequency, priority })),
    ...logements.map((l) => ({ url: `${site.url}/logements/${l.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
  ]
}
