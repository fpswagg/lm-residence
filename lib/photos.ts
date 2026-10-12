import list from "@/data/photos.json"
import meta from "@/data/photos.meta.json"

export interface Photo {
  id: string
  src: string
  width: number
  height: number
  blur: string
  alt: string
  studio: string | null
  room: string
  note: number
  /** Point d'intérêt, en % pour object-position. */
  position: string
}

const byId = new Map<string, Photo>()
for (const p of list.photos) {
  const m = (meta as Record<string, { src: string; width: number; height: number; blur: string }>)[p.id]
  if (!m) continue
  byId.set(p.id, {
    id: p.id,
    ...m,
    alt: p.alt,
    studio: p.studio,
    room: p.room,
    note: p.note,
    position: `${Math.round(p.focal[0] * 100)}% ${Math.round(p.focal[1] * 100)}%`,
  })
}

export function photo(id: string): Photo {
  const p = byId.get(id)
  if (!p) throw new Error(`photo inconnue: ${id}`)
  return p
}

export const photos = [...byId.values()]
export const photosOf = (studio: string) => photos.filter((p) => p.studio === studio).sort((a, b) => b.note - a.note)
