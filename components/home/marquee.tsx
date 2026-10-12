"use client"

import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "@/components/motion/gsap"

/** Bandeau de mots qui défile; il accélère et change de sens avec le scroll. */
export function Marquee({ words }: { words: string[] }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (reducedMotion()) return
      const track = root.current!.querySelector("[data-track]")!
      const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 })
      let dir = 1
      const st = ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity()
          if (Math.abs(v) > 30) dir = v > 0 ? 1 : -1
          const boost = Math.min(Math.abs(v) / 300, 6)
          gsap.to(loop, { timeScale: dir * (1 + boost), duration: 0.25, overwrite: true })
          gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25 })
        },
      })
      return () => st.kill()
    },
    { scope: root },
  )
  const row = (
    <span className="flex shrink-0 items-center">
      {words.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display-italic px-[0.5em] text-[clamp(2.4rem,6vw,6rem)] leading-[1.25]">{w}</span>
          <span aria-hidden className="block size-[0.6rem] rotate-45 bg-brass" />
        </span>
      ))}
    </span>
  )
  return (
    <div ref={root} data-theme="dark" className="overflow-hidden bg-ebony py-6 text-paper" aria-label={words.join(", ")}>
      <div data-track aria-hidden className="flex w-max">
        {row}
        {row}
      </div>
    </div>
  )
}
