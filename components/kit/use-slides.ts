"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type MouseEvent, type RefObject } from "react"
import { gsap, reducedMotion } from "@/components/motion/gsap"

export type SlideEffect = "wipe" | "fade"

interface Options {
  count: number
  initial?: number
  loop?: boolean
  /** wipe: la nouvelle photo s'ouvre en clip-path dans le sens du geste; fade: fondu enchaîné glissé. */
  effect?: SlideEffect
  /** Geste vertical (lightbox: glisser vers le bas pour fermer). Sinon la page défile normalement. */
  onDragY?: (dy: number) => void
  onReleaseY?: (dy: number, velocity: number) => void
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

/**
 * Moteur commun des carrousels: les diapositives ([data-slide] > [data-slide-media]) sont empilées
 * dans `stage`. La transition est une timeline en pause que l'on pilote: au clic elle se joue, au
 * doigt elle suit le geste (progress = distance / largeur), au lâcher elle termine avec l'élan
 * du geste ou revient en place.
 */
export function useSlides(stage: RefObject<HTMLElement | null>, { count, initial = 0, loop = true, effect = "wipe", onDragY, onReleaseY }: Options) {
  const [index, setIndex] = useState(initial)
  const cur = useRef(initial)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const target = useRef<{ to: number; dir: 1 | -1 } | null>(null)
  const dragged = useRef(false)

  const slides = () => (stage.current ? Array.from(stage.current.querySelectorAll<HTMLElement>(":scope > [data-slide]")) : [])
  const media = (el: HTMLElement) => el.querySelector<HTMLElement>("[data-slide-media]") ?? el

  const wrap = useCallback((i: number) => (loop ? (i + count) % count : clamp(i, 0, count - 1)), [count, loop])

  const commit = useCallback(() => {
    const t = target.current
    const s = slides()
    if (!t) return
    const a = s[cur.current]
    const b = s[t.to]
    if (a && a !== b) {
      gsap.set(a, { visibility: "hidden", clearProps: "clipPath,zIndex,opacity" })
      gsap.set(media(a), { clearProps: "transform" })
    }
    if (b) {
      gsap.set(b, { visibility: "visible", clearProps: "clipPath,zIndex,opacity" })
      gsap.set(media(b), { clearProps: "transform" })
      b.removeAttribute("aria-hidden")
    }
    a?.setAttribute("aria-hidden", "true")
    cur.current = t.to
    target.current = null
    tl.current?.kill()
    tl.current = null
    setIndex(t.to)
  }, [])

  const cancel = useCallback(() => {
    const t = target.current
    const s = slides()
    if (t) {
      const b = s[t.to]
      if (b && t.to !== cur.current) gsap.set(b, { visibility: "hidden", clearProps: "clipPath,zIndex,opacity" })
      if (b) gsap.set(media(b), { clearProps: "transform" })
    }
    const a = s[cur.current]
    if (a) {
      gsap.set(a, { clearProps: "zIndex,opacity" })
      gsap.set(media(a), { clearProps: "transform" })
    }
    target.current = null
    tl.current?.kill()
    tl.current = null
  }, [])

  /** Timeline en pause (linéaire, 1 s) de la diapositive courante vers `to`. */
  const build = useCallback(
    (to: number, dir: 1 | -1) => {
      const s = slides()
      const a = s[cur.current]
      const b = s[to]
      if (!a || !b) return null
      target.current = { to, dir }
      const t = gsap.timeline({ paused: true, defaults: { ease: "none", duration: 1 } })
      t.set(a, { zIndex: 1 }, 0)
      if (effect === "wipe") {
        t.set(b, { visibility: "visible", zIndex: 2 }, 0)
          .fromTo(b, { clipPath: dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }, 0)
          .fromTo(media(b), { xPercent: 22 * dir, scale: 1.18 }, { xPercent: 0, scale: 1 }, 0)
          .to(media(a), { xPercent: -14 * dir, scale: 1.04 }, 0)
      } else {
        t.set(b, { visibility: "visible", zIndex: 2 }, 0)
          .fromTo(b, { opacity: 0 }, { opacity: 1 }, 0)
          .fromTo(media(b), { xPercent: 9 * dir, scale: 1.03 }, { xPercent: 0, scale: 1 }, 0)
          .to(media(a), { xPercent: -9 * dir, scale: 0.97 }, 0)
      }
      tl.current = t
      return t
    },
    [effect],
  )

  /** Termine net une transition en cours (clic rapide pendant l'animation). */
  const flush = useCallback(() => {
    if (!tl.current) return
    gsap.killTweensOf(tl.current)
    tl.current.progress(1)
    commit()
  }, [commit])

  const go = useCallback(
    (i: number, dir?: 1 | -1) => {
      flush()
      const to = wrap(i)
      if (to === cur.current) return
      const d: 1 | -1 = dir ?? (to > cur.current ? 1 : -1)
      if (reducedMotion()) {
        target.current = { to, dir: d }
        commit()
        return
      }
      const t = build(to, d)
      if (!t) return
      gsap.to(t, { progress: 1, duration: effect === "wipe" ? 1.15 : 0.8, ease: effect === "wipe" ? "door" : "lm", onComplete: commit })
    },
    [build, commit, effect, flush, wrap],
  )

  /** Saut sans animation (retour de la lightbox). */
  const jump = useCallback(
    (i: number) => {
      flush()
      const to = wrap(i)
      if (to === cur.current) return
      target.current = { to, dir: 1 }
      commit()
    },
    [commit, flush, wrap],
  )

  const next = useCallback(() => go(cur.current + 1, 1), [go])
  const prev = useCallback(() => go(cur.current - 1, -1), [go])

  // Geste: souris ou doigt. Le sens se décide après quelques pixels (horizontal = carrousel).
  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.button !== 0 || count < 2) return
      if ((e.target as HTMLElement).closest("button,a,input")) return
      const el = stage.current
      if (!el) return
      flush()
      dragged.current = false
      const x0 = e.clientX
      const y0 = e.clientY
      const w = el.clientWidth || 1
      let axis: "x" | "y" | null = null
      let dir: 1 | -1 | 0 = 0
      let last = { x: x0, y: y0, t: performance.now() }
      let vel = { x: 0, y: 0 }
      const reduce = reducedMotion()
      const rubber = (dx: number) => {
        const m = media(slides()[cur.current]!)
        gsap.set(m, { x: dx * 0.18 })
      }

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - x0
        const dy = ev.clientY - y0
        if (!axis) {
          if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) axis = "x"
          else if (Math.abs(dy) > 8 && onDragY) axis = "y"
          else if (Math.abs(dy) > 8) return up()
          else return
          dragged.current = true
          el.setPointerCapture?.(ev.pointerId)
          el.dataset.dragging = "true"
        }
        const now = performance.now()
        const dt = Math.max(1, now - last.t)
        vel = { x: (ev.clientX - last.x) / dt, y: (ev.clientY - last.y) / dt }
        last = { x: ev.clientX, y: ev.clientY, t: now }
        if (axis === "y") return onDragY?.(dy)
        if (reduce) return
        const d: 1 | -1 = dx < 0 ? 1 : -1
        const to = loop ? wrap(cur.current + d) : cur.current + d
        if (!loop && (to < 0 || to >= count)) {
          if (dir !== 0) cancel()
          dir = 0
          return rubber(dx)
        }
        if (d !== dir) {
          cancel()
          dir = d
          build(to, d)
        }
        tl.current?.progress(clamp(Math.abs(dx) / w, 0, 1))
      }

      const up = (ev?: PointerEvent) => {
        window.removeEventListener("pointermove", move)
        window.removeEventListener("pointerup", up)
        window.removeEventListener("pointercancel", up)
        delete el.dataset.dragging
        if (!ev || !axis) return
        const dx = ev.clientX - x0
        const dy = ev.clientY - y0
        if (axis === "y") return onReleaseY?.(dy, vel.y)
        const flick = Math.abs(vel.x) > 0.45
        const d: 1 | -1 = dx < 0 ? 1 : -1
        const far = Math.abs(dx) / w > 0.22
        const forward = (flick && Math.sign(-vel.x) === d) || (far && !flick)
        if (reduce) {
          if (forward || far) go(cur.current + d, d)
          return
        }
        if (dir === 0) {
          // Bord sans boucle: retour élastique.
          const m = media(slides()[cur.current]!)
          gsap.to(m, { x: 0, duration: 0.9, ease: "elastic.out(1, 0.6)", onComplete: () => void gsap.set(m, { clearProps: "transform" }) })
          return
        }
        const t = tl.current
        if (!t) return
        const p = t.progress()
        // L'élan du geste fixe la durée de la fin du mouvement: plus on lance vite, plus ça file.
        const speed = Math.max(Math.abs(vel.x) * 1000, 900)
        if (forward && dir === d) {
          gsap.to(t, { progress: 1, duration: clamp(((1 - p) * w) / speed, 0.35, 0.95), ease: "power3.out", onComplete: commit })
        } else {
          gsap.to(t, { progress: 0, duration: clamp((p * w) / speed, 0.3, 0.7), ease: "power3.out", onComplete: cancel })
        }
      }

      window.addEventListener("pointermove", move)
      window.addEventListener("pointerup", up)
      window.addEventListener("pointercancel", up)
    },
    [build, cancel, commit, count, flush, go, loop, onDragY, onReleaseY, stage, wrap],
  )

  /** Un glisser ne doit pas valoir un clic (ouvrir la lightbox, suivre un lien). */
  const onClickCapture = useCallback((e: MouseEvent) => {
    if (dragged.current) {
      e.preventDefault()
      e.stopPropagation()
      dragged.current = false
    }
  }, [])

  useEffect(() => () => void tl.current?.kill(), [])

  return { index, go, jump, next, prev, bind: { onPointerDown, onClickCapture } }
}
