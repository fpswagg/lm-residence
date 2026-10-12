"use client"

import { useRef, type ReactNode } from "react"
import { gsap, useGSAP, finePointer, reducedMotion } from "./gsap"
import { cn } from "@/lib/utils"

/** Un élément attiré par la souris quand elle approche; il revient avec un léger rebond. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (!finePointer() || reducedMotion()) return
      const el = ref.current!
      const inner = el.firstElementChild as HTMLElement | null
      const x = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" })
      const y = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" })
      const ix = inner ? gsap.quickTo(inner, "x", { duration: 0.8, ease: "elastic.out(1, 0.4)" }) : null
      const iy = inner ? gsap.quickTo(inner, "y", { duration: 0.8, ease: "elastic.out(1, 0.4)" }) : null
      const move = (e: PointerEvent) => {
        const b = el.getBoundingClientRect()
        const mx = e.clientX - (b.left + b.width / 2)
        const my = e.clientY - (b.top + b.height / 2)
        x(mx * strength)
        y(my * strength)
        ix?.(mx * strength * 0.4)
        iy?.(my * strength * 0.4)
      }
      const reset = () => {
        x(0)
        y(0)
        ix?.(0)
        iy?.(0)
      }
      el.addEventListener("pointermove", move)
      el.addEventListener("pointerleave", reset)
      return () => {
        el.removeEventListener("pointermove", move)
        el.removeEventListener("pointerleave", reset)
      }
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={cn("inline-block will-change-transform", className)}>
      {children}
    </div>
  )
}
