"use client"

import { useRef, type ElementType, type ReactNode } from "react"
import { gsap, SplitText, useGSAP, reducedMotion } from "./gsap"
import { whenOpen } from "@/lib/gate"

interface Props {
  as?: ElementType
  children: ReactNode
  className?: string
  /** "gate": à l'ouverture de la page (hero); "scroll": quand le texte entre à l'écran. */
  on?: "gate" | "scroll"
  /** lines: lignes qui montent derrière un masque; words: mots qui apparaissent un à un. */
  by?: "lines" | "words"
  delay?: number
  stagger?: number
  id?: string
}

/** Titre ou paragraphe révélé ligne par ligne. Sans JS ou avec moins d'animations: texte visible. */
export function SplitReveal({ as: Tag = "div", children, className, on = "scroll", by = "lines", delay = 0, stagger, id }: Props) {
  const ref = useRef<HTMLElement>(null)
  useGSAP(
    () => {
      if (reducedMotion()) return
      const el = ref.current!
      let played = false
      let cancel = () => {}
      const split = SplitText.create(el, {
        type: by === "lines" ? "lines" : "words,lines",
        mask: by === "lines" ? "lines" : undefined,
        linesClass: "line-mask-line",
        autoSplit: true,
        onSplit(self) {
          const targets = by === "lines" ? self.lines : self.words
          const vars: gsap.TweenVars =
            by === "lines"
              ? { yPercent: 110, duration: 1.3, stagger: stagger ?? 0.09, delay }
              : { opacity: 0.12, duration: 0.6, stagger: stagger ?? 0.035, ease: "none", delay }
          if (played) return
          if (on === "gate") {
            const tw = gsap.from(targets, { ...vars, paused: true, onComplete: () => void (played = true) })
            cancel = whenOpen(() => tw.play())
            return tw
          }
          return gsap.from(targets, {
            ...vars,
            ...(by === "words"
              ? { scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true } }
              : { scrollTrigger: { trigger: el, start: "top 88%", once: true }, onComplete: () => void (played = true) }),
          })
        },
      })
      return () => {
        cancel()
        split.revert()
      }
    },
    { scope: ref },
  )
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  )
}
