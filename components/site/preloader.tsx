"use client"

import { useRef } from "react"
import { gsap, useGSAP } from "@/components/motion/gsap"
import { openGate } from "@/lib/gate"

const SEEN = "lm-seen"

/**
 * Préloader de la première visite (une fois par session): l'arche se dessine, le compteur monte
 * pendant que les polices et la première image arrivent, puis le panneau s'ouvre vers le haut.
 * Rendu côté serveur mais affiché seulement si JS tourne (classes posées en tête de page).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = root.current!
      const html = document.documentElement
      if (html.classList.contains("seen")) {
        el.remove()
        openGate()
        return
      }
      try {
        sessionStorage.setItem(SEEN, "1")
      } catch {}

      const arch = el.querySelector<SVGPathElement>("[data-arch]")!
      const len = arch.getTotalLength()
      const count = el.querySelector<HTMLElement>("[data-count]")!
      const progress = { v: 0 }

      // Prêt quand les polices sont là et que la première grande image est décodée (max 3,2 s).
      const firstImg = document.querySelector<HTMLImageElement>("main img")
      const loaded = Promise.race([
        Promise.all([
          document.fonts?.ready,
          firstImg && !firstImg.complete ? firstImg.decode().catch(() => {}) : null,
        ]),
        new Promise((r) => setTimeout(r, 3200)),
      ])

      gsap.set(arch, { strokeDasharray: len, strokeDashoffset: len })
      const intro = gsap
        .timeline()
        .to(arch, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut" })
        .from("[data-pl-word]", { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.25)
        .to(progress, {
          v: 86,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => (count.textContent = String(Math.round(progress.v)).padStart(2, "0")),
        }, 0)

      let cancelled = false
      Promise.all([loaded, intro.then()]).then(() => {
        if (cancelled) return
        gsap
          .timeline({ onComplete: () => el.remove() })
          .to(progress, {
            v: 100,
            duration: 0.45,
            ease: "power2.out",
            onUpdate: () => (count.textContent = String(Math.round(progress.v)).padStart(2, "0")),
          })
          .to("[data-pl-word], [data-count]", { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.04 }, "+=0.1")
          .to(arch, { strokeDashoffset: -len, duration: 0.8, ease: "power2.in" }, "<")
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "door" }, "-=0.25")
          .add(openGate, "-=0.75")
      })
      return () => {
        cancelled = true
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="preloader fixed inset-0 z-[100] flex-col items-center justify-center bg-ebony text-paper"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-hidden
    >
      <svg viewBox="0 0 64 88" className="h-[min(38vh,320px)] w-auto text-brass-light" fill="none">
        <path data-arch d="M4 86 V32 A28 28 0 0 1 60 32 V86" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-baseline gap-[0.12em] overflow-hidden display text-huge leading-none pt-[0.1em]">
          <span data-pl-word className="block">L.</span>
          <span data-pl-word className="block display-italic">M.</span>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 shell flex items-end justify-between pb-8">
        <span className="overflow-hidden">
          <span data-pl-word className="label block text-paper/60">Résidence Lucien Marie — Yaoundé</span>
        </span>
        <span className="overflow-hidden">
          <span data-count className="num block display text-mid text-brass-light">00</span>
        </span>
      </div>
    </div>
  )
}
