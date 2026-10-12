"use client"

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"
import Lenis from "lenis"
import { usePathname } from "next/navigation"
import { gsap, ScrollTrigger, reducedMotion } from "./gsap"

const LenisContext = createContext<Lenis | null>(null)
export const useLenis = () => useContext(LenisContext)

/** Défilement lissé (Lenis) branché sur le ticker GSAP et ScrollTrigger. Coupé si l'utilisateur
 *  préfère moins d'animations ou sur un appareil faible. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const pathname = usePathname()
  const first = useRef(true)

  useEffect(() => {
    const weak = (navigator.hardwareConcurrency ?? 8) <= 2
    if (reducedMotion() || weak) return
    const l = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 })
    l.on("scroll", ScrollTrigger.update)
    const tick = (time: number) => l.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    setLenis(l)
    ;(window as unknown as { lenis?: Lenis }).lenis = l
    return () => {
      gsap.ticker.remove(tick)
      l.destroy()
      setLenis(null)
    }
  }, [])

  // Nouvelle page: en haut, et ScrollTrigger recalcule quand les images ont pris leur place.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const hash = window.location.hash
    if (!hash) {
      lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : window.scrollTo(0, 0)
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 120)
    return () => clearTimeout(t)
  }, [pathname, lenis])

  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener("load", onLoad)
    document.fonts?.ready.then(onLoad)
    return () => window.removeEventListener("load", onLoad)
  }, [])

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}
