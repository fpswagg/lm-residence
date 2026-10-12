"use client"

import { Children, useCallback, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { gsap, Draggable, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { ArrowButton, Counter, Progress } from "./controls"
import { cn } from "@/lib/utils"

interface Props {
  children: ReactNode
  label: string
  className?: string
  /** Largeur de chaque élément (classes Tailwind). */
  itemClassName?: string
  tone?: "dark" | "light"
  /** En-tête placé à gauche des contrôles. */
  head?: ReactNode
}

/**
 * Bande horizontale à glisser (Draggable + inertie): on lance, elle file et se cale sur l'élément
 * le plus proche. Flèches, clavier, compteur et progression suivent la position réelle.
 */
export function Rail({ children, label, className, itemClassName = "w-[78vw] sm:w-[46vw] lg:w-[30vw]", tone = "dark", head }: Props) {
  const view = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const drag = useRef<Draggable | null>(null)
  const dragged = useRef(false)
  const items = Children.toArray(children)
  const [state, setState] = useState({ index: 0, progress: 0, scrollable: true })

  const metrics = useCallback(() => {
    const v = view.current!
    const t = track.current!
    const max = Math.max(0, t.scrollWidth - v.clientWidth)
    const kids = Array.from(t.children) as HTMLElement[]
    const base = kids[0]?.offsetLeft ?? 0
    const points = kids.map((c) => Math.min(c.offsetLeft - base, max))
    return { max, points }
  }, [])

  const sync = useCallback(() => {
    const t = track.current
    if (!t) return
    const { max, points } = metrics()
    const x = -(gsap.getProperty(t, "x") as number)
    let index = 0
    for (let i = 0; i < points.length; i++) if (Math.abs(points[i]! - x) < Math.abs(points[index]! - x)) index = i
    setState({ index, progress: max ? x / max : 1, scrollable: max > 4 })
  }, [metrics])

  useGSAP(
    () => {
      const t = track.current!
      const reduce = reducedMotion()
      const [d] = Draggable.create(t, {
        type: "x",
        inertia: !reduce,
        edgeResistance: 0.85,
        minimumMovement: 6,
        dragClickables: true,
        bounds: { minX: -metrics().max, maxX: 0 },
        snap: (x: number) => {
          const { points } = metrics()
          return -points.reduce((a, b) => (Math.abs(b + x) < Math.abs(a + x) ? b : a), points[0] ?? 0)
        },
        onPress: () => void (dragged.current = false),
        onDragStart: () => void (dragged.current = true),
        onDrag: sync,
        onThrowUpdate: sync,
        onThrowComplete: sync,
        onRelease: sync,
        cursor: "grab",
        activeCursor: "grabbing",
      })
      drag.current = d ?? null
      const ro = new ResizeObserver(() => {
        const { max } = metrics()
        d?.applyBounds({ minX: -max, maxX: 0 })
        sync()
      })
      ro.observe(view.current!)
      sync()
      return () => {
        ro.disconnect()
        d?.kill()
      }
    },
    { scope: view },
  )

  const goTo = (i: number) => {
    const t = track.current
    if (!t) return
    const { points } = metrics()
    const n = Math.max(0, Math.min(points.length - 1, i))
    gsap.to(t, {
      x: -points[n]!,
      duration: reducedMotion() ? 0 : 1.1,
      ease: "lm",
      onUpdate: sync,
      onComplete: () => {
        drag.current?.update()
        sync()
      },
    })
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") (e.preventDefault(), goTo(state.index + 1))
    else if (e.key === "ArrowLeft") (e.preventDefault(), goTo(state.index - 1))
  }

  return (
    <div role="region" aria-roledescription="carrousel" aria-label={label} className={cn(className)}>
      <div className="shell flex flex-wrap items-end justify-between gap-6">
        {head}
        {state.scrollable && (
          <div className="flex items-center gap-5">
            <Counter index={state.index} count={items.length} />
            <ArrowButton dir="prev" onClick={() => goTo(state.index - 1)} label="Précédent" tone={tone} disabled={state.progress <= 0.001} />
            <ArrowButton dir="next" onClick={() => goTo(state.index + 1)} label="Suivant" tone={tone} disabled={state.progress >= 0.999} />
          </div>
        )}
      </div>
      <div
        ref={view}
        tabIndex={0}
        onKeyDown={onKey}
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault()
            e.stopPropagation()
            dragged.current = false
          }
        }}
        data-cursor={state.scrollable ? "Glisser" : undefined}
        className="mt-10 overflow-hidden outline-offset-4 md:mt-14"
      >
        <div ref={track} className="flex w-max gap-[clamp(1rem,2vw,2rem)] px-[var(--gutter)] will-change-transform">
          {items.map((c, i) => (
            <div key={i} className={cn("shrink-0", itemClassName)} role="group" aria-roledescription="élément" aria-label={`${i + 1} sur ${items.length}`}>
              {c}
            </div>
          ))}
        </div>
      </div>
      {state.scrollable && (
        <div className="shell mt-8">
          <Progress value={Math.max(0.08, state.progress)} tone={tone} smooth={false} />
        </div>
      )}
    </div>
  )
}
