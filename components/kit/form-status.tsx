"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { cn } from "@/lib/utils"

/** Confirmation d'envoi: le cercle et la coche se tracent, le titre monte. */
export function Sent({ title, children, className }: { title: ReactNode; children?: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      ref.current?.focus()
      if (reducedMotion()) return
      const paths = ref.current!.querySelectorAll<SVGPathElement | SVGCircleElement>("[data-draw]")
      paths.forEach((p) => {
        const l = p.getTotalLength()
        gsap.set(p, { strokeDasharray: l, strokeDashoffset: l })
      })
      gsap
        .timeline()
        .to(paths, { strokeDashoffset: 0, duration: 1.1, ease: "door", stagger: 0.35 })
        .from("[data-sent-line]", { yPercent: 110, duration: 1.1, stagger: 0.08 }, 0.2)
        .from("[data-sent-body]", { opacity: 0, y: 16, duration: 0.9 }, 0.6)
    },
    { scope: ref },
  )
  return (
    <div ref={ref} tabIndex={-1} role="status" className={cn("outline-none", className)}>
      <svg viewBox="0 0 64 64" className="size-16 text-sage-deep" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden>
        <circle data-draw cx="32" cy="32" r="30" />
        <path data-draw d="M20 33l8 8 16-17" />
      </svg>
      <p className="display text-big mt-8">
        <span className="block overflow-hidden">
          <span data-sent-line className="block">
            {title}
          </span>
        </span>
      </p>
      <div data-sent-body className="mt-6 max-w-[44ch] text-ebony/70">
        {children}
      </div>
    </div>
  )
}

/** Erreur d'envoi, sobre: un filet terre cuite et un message. */
export function SendError({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="border-l-2 border-terracotta pl-4 text-sm text-terracotta">
      {children}
    </p>
  )
}
