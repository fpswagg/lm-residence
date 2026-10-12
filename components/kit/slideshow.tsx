"use client"

import Image from "next/image"
import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { useSlides } from "./use-slides"
import { ArrowButton, Counter, ExpandIcon, Progress, Thumbs } from "./controls"
import { Lightbox } from "./lightbox"
import { roomLabel, type Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

interface Props {
  photos: Photo[]
  /** Nom de la série (lecteurs d'écran, titre plein écran). */
  label: string
  className?: string
  /** Format et forme du cadre (classes Tailwind). */
  frameClassName?: string
  sizes: string
  priority?: boolean
  thumbs?: boolean
  tone?: "dark" | "light"
}

/**
 * Diaporama d'un logement: la photo suivante s'ouvre en clip-path dans le sens du geste (le doigt
 * pilote la transition), compteur 01/08, barre de progression, vignettes, clavier, plein écran.
 */
export function Slideshow({ photos, label, className, frameClassName = "aspect-[4/5] md:aspect-[4/3]", sizes, priority, thumbs = true, tone = "dark" }: Props) {
  const stage = useRef<HTMLDivElement>(null)
  const { index, go, jump, next, prev, bind } = useSlides(stage, { count: photos.length })
  const [open, setOpen] = useState(false)
  const [seen, setSeen] = useState(() => new Set([0, 1, photos.length - 1]))

  useEffect(() => {
    setSeen((s) => {
      const n = new Set(s)
      for (const d of [-1, 0, 1]) n.add((index + d + photos.length) % photos.length)
      return n.size === s.size ? s : n
    })
  }, [index, photos.length])

  const onKey = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === "ArrowRight") (e.preventDefault(), next())
    else if (e.key === "ArrowLeft") (e.preventDefault(), prev())
    else if (e.key === "Home") (e.preventDefault(), go(0, -1))
    else if (e.key === "End") (e.preventDefault(), go(photos.length - 1, 1))
    else if (e.key === "Enter") (e.preventDefault(), setOpen(true))
  }

  const p = photos[index]!
  const light = tone === "light"
  return (
    <div
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKey}
      className={cn("group/ss relative outline-offset-8", light && "text-paper", className)}
    >
      <div
        ref={stage}
        {...bind}
        onClick={() => setOpen(true)}
        data-cursor="Glisser"
        className={cn("relative cursor-grab touch-pan-y select-none overflow-hidden data-[dragging]:cursor-grabbing", light ? "bg-ebony-3" : "bg-paper-3", frameClassName)}
      >
        {photos.map((ph, i) => (
          <div
            key={ph.id}
            data-slide
            aria-hidden={i !== 0}
            role="group"
            aria-roledescription="diapositive"
            aria-label={`${i + 1} sur ${photos.length}`}
            className="absolute inset-0 overflow-hidden"
            style={i !== 0 ? { visibility: "hidden" } : undefined}
          >
            <div data-slide-media className="absolute inset-0 will-change-transform">
              {seen.has(i) && (
                <Image
                  src={ph.src}
                  alt={ph.alt}
                  fill
                  sizes={sizes}
                  priority={priority && i === 0}
                  placeholder="blur"
                  blurDataURL={ph.blur}
                  className="object-cover"
                  style={{ objectPosition: ph.position }}
                />
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={(e) => (e.stopPropagation(), setOpen(true))}
          aria-label={`Voir les photos de ${label} en plein écran`}
          className="label absolute right-4 top-4 z-10 inline-flex h-11 items-center gap-2.5 rounded-full bg-paper/90 px-4 text-ebony backdrop-blur-sm transition-colors duration-500 hover:bg-ebony hover:text-paper"
        >
          <ExpandIcon className="size-4" />
          <span className="hidden sm:inline">Plein écran</span>
        </button>
      </div>

      <div className="mt-5 flex items-center gap-5">
        <Counter index={index} count={photos.length} />
        <Progress value={(index + 1) / photos.length} tone={tone} className="flex-1" />
        <div className="flex gap-2">
          <ArrowButton dir="prev" onClick={prev} label="Photo précédente" tone={tone} />
          <ArrowButton dir="next" onClick={next} label="Photo suivante" tone={tone} />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className={cn("min-h-[2.5em] max-w-[44ch] text-sm leading-snug", light ? "text-paper/70" : "text-ebony/65")}>
          <span className={cn("label mr-3", light ? "text-brass-light" : "text-brass-deep")}>{roomLabel(p.room)}</span>
          {p.alt}
        </p>
        {thumbs && <Thumbs photos={photos} index={index} onSelect={(i) => go(i)} tone={tone} label={`Photos de ${label}`} className="md:max-w-[55%]" />}
      </div>

      <p className="sr-only" aria-live="polite">
        Photo {index + 1} sur {photos.length}: {p.alt}
      </p>

      {open && (
        <Lightbox
          photos={photos}
          start={index}
          title={label}
          originOf={() => stage.current}
          onClose={(i) => {
            jump(i)
            setOpen(false)
          }}
        />
      )}
    </div>
  )
}
