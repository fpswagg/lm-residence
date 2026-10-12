"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { gsap, finePointer, reducedMotion } from "@/components/motion/gsap"

/**
 * Curseur (souris seulement): un point qui suit, une pastille qui grossit avec un mot sur les
 * éléments [data-cursor="Voir"]. Le curseur natif reste là: celui-ci ne fait que l'accompagner.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const text = useRef<HTMLSpanElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!finePointer() || reducedMotion()) return
    const d = dot.current!
    const r = ring.current!
    gsap.set([d, r], { xPercent: -50, yPercent: -50, x: -100, y: -100 })
    const dx = gsap.quickTo(d, "x", { duration: 0.18, ease: "power3" })
    const dy = gsap.quickTo(d, "y", { duration: 0.18, ease: "power3" })
    const rx = gsap.quickTo(r, "x", { duration: 0.6, ease: "power3" })
    const ry = gsap.quickTo(r, "y", { duration: 0.6, ease: "power3" })
    let current: string | null = null

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const target = e.target as Element | null
      const t = target?.closest?.("[data-cursor]")
      const isLink = !t && !!target?.closest?.("a,button,[role=button],label,select")
      const key = t ? `l:${t.getAttribute("data-cursor")}` : isLink ? "link" : null
      if (key === current) return
      current = key
      if (t) {
        text.current!.textContent = t.getAttribute("data-cursor")
        gsap.to(r, { scale: 1, opacity: 1, duration: 0.5 })
        gsap.to(d, { scale: 0, duration: 0.3 })
      } else if (key === "link") {
        gsap.to(r, { scale: 0.32, opacity: 1, duration: 0.4 })
        gsap.to(d, { scale: 0, duration: 0.3 })
      } else {
        gsap.to(r, { scale: 0, opacity: 0, duration: 0.4 })
        gsap.to(d, { scale: 1, duration: 0.3 })
      }
      if (!t) text.current!.textContent = ""
    }
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to(d, { opacity: 1, duration: 0.3 })
    window.addEventListener("pointermove", move, { passive: true })
    document.documentElement.addEventListener("pointerleave", leave)
    document.documentElement.addEventListener("pointerenter", enter)
    return () => {
      window.removeEventListener("pointermove", move)
      document.documentElement.removeEventListener("pointerleave", leave)
      document.documentElement.removeEventListener("pointerenter", enter)
    }
  }, [])

  // Après un changement de page, l'élément survolé a disparu.
  useEffect(() => {
    if (ring.current) gsap.to(ring.current, { scale: 0, opacity: 0, duration: 0.3 })
  }, [pathname])

  return (
    <div className="cursor" aria-hidden>
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[95] size-2 rounded-full bg-brass mix-blend-difference"
      />
      <div
        ref={ring}
        className="pointer-events-none fixed left-0 top-0 z-[95] flex size-24 items-center justify-center rounded-full bg-brass text-ebony opacity-0"
        style={{ transform: "scale(0)" }}
      >
        <span ref={text} className="label" />
      </div>
    </div>
  )
}
