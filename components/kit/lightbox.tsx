"use client"

import Image from "next/image"
import { createPortal } from "react-dom"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { useLenis } from "@/components/motion/motion-provider"
import { useSlides } from "./use-slides"
import { ArrowButton, CloseIcon, Counter, Progress, Thumbs } from "./controls"
import { roomLabel, type Photo } from "@/lib/photos"

interface Props {
  photos: Photo[]
  start: number
  title?: string
  /** Élément d'origine d'une photo: la lightbox s'ouvre depuis lui et s'y referme. */
  originOf?: (i: number) => HTMLElement | null | undefined
  onClose: (index: number) => void
}

const insetOf = (el: HTMLElement | null | undefined) => {
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (r.width === 0 || r.bottom < 0 || r.top > window.innerHeight) return null
  const w = window.innerWidth
  const h = window.innerHeight
  return `inset(${r.top}px ${w - r.right}px ${h - r.bottom}px ${r.left}px round 0px)`
}

/**
 * Plein écran: s'ouvre depuis la vignette cliquée (clip-path), fondu enchaîné entre les photos,
 * glisser à gauche/droite, glisser vers le bas pour fermer, clavier (← → Début Fin Échap), vignettes.
 */
export function Lightbox({ photos, start, title, originOf, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const shell = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const lenis = useLenis()
  const closing = useRef(false)
  const [seen, setSeen] = useState(() => new Set([start]))

  const onDragY = useCallback((dy: number) => {
    const d = Math.max(0, dy)
    gsap.set(stage.current, { y: d, scale: 1 - Math.min(d / 2400, 0.12) })
    gsap.set("[data-lb-backdrop]", { opacity: 1 - Math.min(d / 500, 0.7) })
  }, [])

  const indexRef = useRef(start)
  const close = useCallback(() => {
    if (closing.current) return
    closing.current = true
    const i = indexRef.current
    const done = () => onClose(i)
    if (reducedMotion()) return done()
    const to = insetOf(originOf?.(i))
    const tl = gsap.timeline({ onComplete: done })
    tl.to("[data-lb-ui]", { opacity: 0, duration: 0.3, ease: "power2.out" }, 0)
    if (to) {
      tl.fromTo(shell.current, { clipPath: "inset(0px 0px 0px 0px round 0px)" }, { clipPath: to, duration: 0.8, ease: "door" }, 0).to(stage.current, { y: 0, scale: 1, duration: 0.8, ease: "door" }, 0)
    } else {
      tl.to(shell.current, { opacity: 0, duration: 0.45, ease: "power2.out" }, 0)
    }
  }, [onClose, originOf])

  const onReleaseY = useCallback(
    (dy: number, v: number) => {
      if (dy > 140 || v > 0.6) return close()
      gsap.to(stage.current, { y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.7)" })
      gsap.to("[data-lb-backdrop]", { opacity: 1, duration: 0.4 })
    },
    [close],
  )

  const { index, go, next, prev, bind } = useSlides(stage, { count: photos.length, initial: start, effect: "fade", onDragY, onReleaseY })
  indexRef.current = index

  useEffect(() => {
    setSeen((s) => {
      const n = new Set(s)
      for (const d of [-1, 0, 1]) n.add((index + d + photos.length) % photos.length)
      return n.size === s.size ? s : n
    })
  }, [index, photos.length])

  // Ouverture: depuis la vignette, puis l'interface apparaît.
  useLayoutEffect(() => {
    if (reducedMotion()) return
    const from = insetOf(originOf?.(start))
    const tl = gsap.timeline()
    if (from) tl.fromTo(shell.current, { clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1, ease: "door", clearProps: "clipPath" })
    else tl.fromTo(shell.current, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" })
    tl.from("[data-lb-ui]", { opacity: 0, y: 12, duration: 0.7, stagger: 0.05 }, from ? 0.55 : 0.2)
    return () => void tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Page figée, focus piégé, clavier.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    lenis?.stop()
    const html = document.documentElement
    const overflow = html.style.overflow
    html.style.overflow = "hidden"
    closeBtn.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close()
      if (e.key === "ArrowRight") return next()
      if (e.key === "ArrowLeft") return prev()
      if (e.key === "Home") return go(0, -1)
      if (e.key === "End") return go(photos.length - 1, 1)
      if (e.key === "Tab" && root.current) {
        const f = Array.from(root.current.querySelectorAll<HTMLElement>("button:not([disabled]),[tabindex='0']"))
        if (!f.length) return
        const first = f[0]!
        const last = f[f.length - 1]!
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.removeEventListener("keydown", onKey)
      html.style.overflow = overflow
      lenis?.start()
      previous?.focus?.({ preventScroll: true })
    }
  }, [close, go, lenis, next, prev, photos.length])

  const p = photos[index]!
  return createPortal(
    <div ref={root} role="dialog" aria-modal="true" aria-label={title ?? "Photos en plein écran"} data-theme="dark" data-lenis-prevent className="fixed inset-0 z-[95] text-paper">
      <div ref={shell} className="absolute inset-0 overflow-hidden">
        <div data-lb-backdrop className="absolute inset-0 bg-ebony" />

        <div
          ref={stage}
          {...bind}
          data-cursor="Glisser"
          className="absolute inset-x-0 bottom-[10.5rem] top-[4.75rem] touch-none select-none data-[dragging]:cursor-grabbing md:inset-x-[7.5rem] md:bottom-[10.5rem] md:top-[5.5rem]"
        >
          {photos.map((ph, i) => (
            <div key={ph.id} data-slide aria-hidden={i !== start} className="absolute inset-0" style={i !== start ? { visibility: "hidden" } : undefined}>
              <div data-slide-media className="absolute inset-0 will-change-transform">
                {seen.has(i) && (
                  <Image src={ph.src} alt={ph.alt} fill sizes="100vw" placeholder="blur" blurDataURL={ph.blur} className="object-contain" priority={i === start} />
                )}
              </div>
            </div>
          ))}
        </div>

        <div data-lb-ui className="absolute inset-x-0 top-0 flex h-[4.75rem] items-center justify-between gap-6 px-[var(--gutter)] md:h-[5.5rem]">
          <div className="flex items-baseline gap-6">
            <Counter index={index} count={photos.length} className="text-paper" />
            {title && <p className="label hidden text-paper/55 sm:block">{title}</p>}
          </div>
          <button
            ref={closeBtn}
            type="button"
            onClick={close}
            className="label group/close inline-flex h-12 items-center gap-3 rounded-full border border-paper/25 pl-5 pr-4 transition-colors duration-500 hover:border-paper hover:bg-paper hover:text-ebony"
          >
            Fermer
            <CloseIcon className="size-4 transition-transform duration-700 ease-expo group-hover/close:rotate-90" />
          </button>
        </div>

        <div data-lb-ui className="pointer-events-none absolute inset-x-[var(--gutter)] top-1/2 hidden -translate-y-1/2 justify-between md:flex">
          <ArrowButton dir="prev" tone="light" onClick={prev} label="Photo précédente" className="pointer-events-auto" />
          <ArrowButton dir="next" tone="light" onClick={next} label="Photo suivante" className="pointer-events-auto" />
        </div>

        <div data-lb-ui className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-5">
          <div className="flex items-end justify-between gap-6">
            <p className="max-w-[56ch] text-sm leading-snug text-paper/75">
              <span className="label mr-3 text-brass-light">{roomLabel(p.room)}</span>
              {p.alt}
            </p>
            <p className="label hidden shrink-0 text-paper/40 lg:block">← → pour naviguer · Échap pour fermer</p>
          </div>
          <Progress value={(index + 1) / photos.length} tone="light" className="mt-4" />
          <Thumbs photos={photos} index={index} onSelect={(i) => go(i)} tone="light" className="mt-3 justify-start md:justify-center" />
        </div>
        <p className="sr-only" aria-live="polite">
          Photo {index + 1} sur {photos.length}: {p.alt}
        </p>
      </div>
    </div>,
    document.body,
  )
}
