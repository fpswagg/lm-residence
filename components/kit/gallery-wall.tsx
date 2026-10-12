"use client"

import Image from "next/image"
import { useLayoutEffect, useMemo, useRef, useState } from "react"
import { gsap, Flip, ScrollTrigger, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { Lightbox } from "./lightbox"
import { roomLabel, type Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

export interface GalleryFilter {
  id: string
  label: string
  /** Un logement, ou une liste de pièces hors logements; ni l'un ni l'autre = tout. */
  studio?: string
  rooms?: string[]
}

const matcher = (f: GalleryFilter) => (p: Photo) =>
  f.studio ? p.studio === f.studio : f.rooms ? !p.studio && f.rooms.includes(p.room) : true

/**
 * Mur de photos: colonnes décalées, chaque cadre s'ouvre en entrant à l'écran. Les filtres
 * réarrangent le mur (Flip: les photos glissent à leur nouvelle place), un clic ouvre le plein écran.
 */
export function GalleryWall({ photos, filters, studios }: { photos: Photo[]; filters: GalleryFilter[]; studios: Record<string, string> }) {
  const root = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState(filters[0]!.id)
  const [open, setOpen] = useState<number | null>(null)
  const flipState = useRef<Flip.FlipState | null>(null)
  const items = useRef(new Map<string, HTMLElement>())

  const tests = useMemo(() => new Map(filters.map((f) => [f.id, matcher(f)])), [filters])
  const test = tests.get(filter)!
  const shown = useMemo(() => photos.filter(test), [photos, test])

  const choose = (id: string) => {
    if (id === filter) return
    if (!reducedMotion() && root.current) flipState.current = Flip.getState(root.current.querySelectorAll("[data-tile]"))
    setFilter(id)
  }

  useLayoutEffect(() => {
    const state = flipState.current
    if (!state) return
    flipState.current = null
    // Les cadres jamais ouverts au scroll resteraient fermés: après un filtre, tout est ouvert.
    const frames = gsap.utils.toArray<HTMLElement>("[data-tile]:not(.hidden) [data-tile-frame]", root.current)
    gsap.set(frames, { clipPath: "inset(0% 0% 0% 0%)" })
    gsap.set(frames.map((f) => f.querySelector("img")), { scale: 1 })
    frames.forEach((f) => (f.dataset.open = ""))
    Flip.from(state, {
      duration: 1,
      ease: "lm",
      absolute: true,
      stagger: 0.015,
      onEnter: (els) => {
        gsap.set(els.map((e) => e.querySelector("[data-tile-frame]")), { clipPath: "inset(0% 0% 0% 0%)" })
        return gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.8, ease: "lm" })
      },
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.5, ease: "power2.out" }),
      onComplete: () => ScrollTrigger.refresh(),
    })
  }, [filter])

  // Ouverture des cadres au scroll (une fois).
  useGSAP(
    () => {
      if (reducedMotion()) return
      const tiles = gsap.utils.toArray<HTMLElement>("[data-tile-frame]", root.current)
      gsap.set(tiles, { clipPath: "inset(100% 0% 0% 0%)" })
      ScrollTrigger.batch(tiles, {
        start: "top 92%",
        once: true,
        onEnter: (all) => {
          const batch = all.filter((b) => (b as HTMLElement).dataset.open === undefined)
          if (!batch.length) return
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "door", stagger: 0.08 })
          gsap.fromTo(
            batch.map((b) => b.querySelector("img")),
            { scale: 1.3 },
            { scale: 1, duration: 1.8, ease: "lm", stagger: 0.08 },
          )
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root}>
      <div className="shell sticky top-0 z-20 -mt-px bg-paper/90 py-4 backdrop-blur-md" data-theme="light">
        <div role="group" aria-label="Filtrer les photos" data-lenis-prevent className="flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => {
            const n = photos.filter(tests.get(f.id)!).length
            const on = f.id === filter
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f.id)}
                className={cn(
                  "label inline-flex h-11 shrink-0 items-center gap-2 rounded-full border px-5 transition-colors duration-500",
                  on ? "border-ebony bg-ebony text-paper" : "border-ebony/20 hover:border-ebony",
                )}
              >
                {f.label}
                <sup className={cn("num text-[0.6rem]", on ? "text-paper/60" : "text-ebony/45")}>{String(n).padStart(2, "0")}</sup>
              </button>
            )
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {shown.length} photos
      </p>

      <ul className="shell mt-10 columns-2 gap-[clamp(0.75rem,1.6vw,1.5rem)] md:columns-3 xl:columns-4">
        {photos.map((p, i) => {
          const visible = test(p)
          const idx = shown.indexOf(p)
          const arch = i % 7 === 2
          return (
            <li
              key={p.id}
              data-tile
              data-flip-id={p.id}
              ref={(el) => void (el ? items.current.set(p.id, el) : items.current.delete(p.id))}
              className={cn("mb-[clamp(0.75rem,1.6vw,1.5rem)] break-inside-avoid", !visible && "hidden")}
            >
              <button type="button" data-cursor="Voir" onClick={() => setOpen(idx)} className="group/tile block w-full text-left" aria-label={`Agrandir: ${p.alt}`} tabIndex={visible ? 0 : -1}>
                <span
                  data-tile-frame
                  className={cn("relative block overflow-hidden bg-paper-3", arch && "shape-arch")}
                  style={{ aspectRatio: arch ? "3 / 4" : `${p.width} / ${p.height}` }}
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(min-width:1280px) 23vw, (min-width:768px) 31vw, 46vw"
                    placeholder="blur"
                    blurDataURL={p.blur}
                    className="object-cover transition-transform duration-[1400ms] ease-expo group-hover/tile:scale-[1.05]"
                    style={{ objectPosition: p.position }}
                  />
                </span>
                <span className="mt-3 flex items-baseline justify-between gap-3">
                  <span className="label text-ebony/60">{roomLabel(p.room)}</span>
                  {p.studio && <span className="label text-ebony/40">{studios[p.studio]}</span>}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {open !== null && (
        <Lightbox
          photos={shown}
          start={open}
          title="Galerie"
          originOf={(i) => items.current.get(shown[i]!.id)?.querySelector<HTMLElement>("[data-tile-frame]")}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  )
}
