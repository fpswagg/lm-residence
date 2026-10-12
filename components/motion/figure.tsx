"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from "./gsap"
import { whenOpen } from "@/lib/gate"
import type { Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

interface Props {
  photo: Photo
  className?: string
  imgClassName?: string
  sizes: string
  priority?: boolean
  /** Révélation: le cadre s'ouvre de bas en haut (scroll ou ouverture de page). */
  reveal?: "scroll" | "gate" | false
  /** Parallaxe de l'image dans son cadre, en % (0 = aucune). */
  parallax?: number
  cursor?: string
}

/** Photo cadrée (arche, portrait…): le cadre s'ouvre, l'image se pose et glisse doucement au scroll. */
export function Figure({ photo, className, imgClassName, sizes, priority, reveal = "scroll", parallax = 10, cursor }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      if (reducedMotion()) return
      const box = ref.current!
      const img = box.querySelector("img")!
      let cancel = () => {}
      if (parallax) {
        gsap.fromTo(
          img,
          { yPercent: -parallax / 2 },
          {
            yPercent: parallax / 2,
            ease: "none",
            scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
          },
        )
      }
      if (reveal) {
        const tl = gsap
          .timeline({ paused: true })
          .fromTo(box, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "door" })
          .fromTo(img, { scale: 1.35 }, { scale: 1, duration: 2, ease: "lm" }, 0)
        if (reveal === "gate") cancel = whenOpen(() => tl.play())
        else ScrollTrigger.create({ trigger: box, start: "top 90%", once: true, onEnter: () => tl.play() })
      }
      return () => cancel()
    },
    { scope: ref },
  )
  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-paper-3", className)} data-cursor={cursor}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={photo.blur}
        className={cn("object-cover will-change-transform", imgClassName)}
        style={{ objectPosition: photo.position, height: parallax ? `${100 + parallax}%` : undefined, top: parallax ? `${-parallax / 2}%` : undefined }}
      />
    </div>
  )
}
