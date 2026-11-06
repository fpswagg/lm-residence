"use client"

import { useRef, useState } from "react"
import { ImagePlus, Loader2, Star, X } from "lucide-react"

type Photo = { url: string; key: string; alt: string }

const MAX_COTE = 2000

/** Phone photos are heavy: send a lighter copy, same framing. */
async function allege(file: File): Promise<Blob> {
  if (file.size < 1.5 * 1024 * 1024) return file
  try {
    const bmp = await createImageBitmap(file)
    const k = Math.min(1, MAX_COTE / Math.max(bmp.width, bmp.height))
    const canvas = document.createElement("canvas")
    canvas.width = Math.round(bmp.width * k)
    canvas.height = Math.round(bmp.height * k)
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height)
    bmp.close()
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", 0.88))
    return blob ?? file
  } catch {
    return file
  }
}

export function PhotosField({ initial = [], max = 12 }: { initial?: Photo[]; max?: number }) {
  const [photos, setPhotos] = useState<Photo[]>(initial)
  const [envoi, setEnvoi] = useState(0)
  const [erreur, setErreur] = useState("")
  const input = useRef<HTMLInputElement>(null)

  async function ajoute(files: FileList | null) {
    if (!files?.length) return
    setErreur("")
    const liste = [...files].slice(0, Math.max(0, max - photos.length) || (max === 1 ? 1 : 0))
    if (!liste.length) return setErreur(`${max} photos maximum.`)
    setEnvoi(liste.length)
    for (const file of liste) {
      try {
        const fd = new FormData()
        const blob = await allege(file)
        fd.set("photo", new File([blob], file.name, { type: blob.type || file.type }))
        const res = await fetch("/dashboard/photo", { method: "POST", body: fd })
        const body = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(body.error || "Envoi impossible.")
        setPhotos((p) => (max === 1 ? [body] : [...p, body]))
      } catch (err) {
        setErreur(err instanceof Error ? err.message : "Envoi impossible.")
      }
      setEnvoi((n) => n - 1)
    }
    if (input.current) input.current.value = ""
  }

  return (
    <div>
      <input type="hidden" name="photos" value={JSON.stringify(photos)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {photos.map((p, i) => (
          <div key={p.url} className="group relative aspect-[4/3] overflow-hidden rounded-md border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.alt} className="size-full object-cover" loading="lazy" />
            {max > 1 && i === 0 && <span className="absolute left-1.5 top-1.5 rounded bg-primary px-1.5 py-0.5 text-[11px] font-semibold text-primary-foreground">Principale</span>}
            <div className="absolute right-1.5 top-1.5 flex gap-1">
              {max > 1 && i > 0 && (
                <button type="button" title="Mettre en photo principale" aria-label="Mettre en photo principale" onClick={() => setPhotos((l) => [p, ...l.filter((x) => x !== p)])} className="grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black">
                  <Star className="size-4" />
                </button>
              )}
              <button type="button" title="Retirer" aria-label="Retirer la photo" onClick={() => setPhotos((l) => l.filter((x) => x !== p))} className="grid size-8 place-items-center rounded-full bg-black/70 text-white hover:bg-black">
                <X className="size-4" />
              </button>
            </div>
          </div>
        ))}
        {(photos.length < max || max === 1) && (
          <button type="button" onClick={() => input.current?.click()} disabled={envoi > 0} className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-md border border-dashed border-border text-sm text-muted-foreground transition hover:border-primary hover:text-primary disabled:opacity-60">
            {envoi > 0 ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
            {envoi > 0 ? "Envoi…" : max === 1 && photos.length ? "Changer" : "Ajouter"}
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={max > 1} className="hidden" onChange={(e) => ajoute(e.target.files)} />
      {erreur && <p role="alert" className="mt-2 text-sm text-red-200">{erreur}</p>}
    </div>
  )
}
