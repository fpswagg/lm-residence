"use client"

import { useRef, type MouseEvent, type ReactNode } from "react"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { cn } from "@/lib/utils"

export interface AccordionItem {
  title: ReactNode
  content: ReactNode
  meta?: ReactNode
}

/**
 * Accordéon éditorial sur <details> (marche sans JS). Avec JS: la hauteur s'ouvre en douceur, le
 * texte monte, le « + » devient « − ». Un seul ouvert à la fois si `single`.
 */
export function Accordion({ items, numbered = true, single = false, tone = "dark", className, defaultOpen }: { items: AccordionItem[]; numbered?: boolean; single?: boolean; tone?: "dark" | "light"; className?: string; defaultOpen?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const light = tone === "light"

  const animate = (el: HTMLDetailsElement, open: boolean) => {
    const body = el.querySelector<HTMLElement>("[data-acc-body]")!
    const inner = body.firstElementChild as HTMLElement
    el.dataset.state = open ? "open" : "closed"
    gsap.killTweensOf([body, inner])
    if (reducedMotion()) {
      el.open = open
      return
    }
    if (open) {
      el.open = true
      gsap.fromTo(body, { height: 0 }, { height: "auto", duration: 0.9, ease: "lm", clearProps: "height" })
      gsap.fromTo(inner, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, delay: 0.05, ease: "lm" })
    } else {
      gsap.to(inner, { opacity: 0, duration: 0.3, ease: "power2.out" })
      gsap.fromTo(body, { height: body.offsetHeight }, { height: 0, duration: 0.6, ease: "power3.inOut", onComplete: () => {
        el.open = false
        gsap.set([body, inner], { clearProps: "all" })
      } })
    }
  }

  const onClick = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    const el = e.currentTarget.parentElement as HTMLDetailsElement
    const isOpen = (d: HTMLDetailsElement) => (d.dataset.state ? d.dataset.state === "open" : d.open)
    const opening = !isOpen(el)
    if (single && opening) {
      root.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => {
        if (d !== el && isOpen(d)) animate(d, false)
      })
    }
    animate(el, opening)
  }

  return (
    <div ref={root} className={cn(light ? "text-paper" : "text-ebony", className)}>
      {items.map((it, i) => (
        <details key={i} open={defaultOpen === i} data-state={defaultOpen === i ? "open" : undefined} className={cn("group/acc border-t last:border-b", light ? "border-paper/15" : "border-ebony/15")}>
          <summary
            onClick={onClick}
            className="flex cursor-pointer list-none items-baseline gap-5 py-6 md:gap-8 md:py-8 [&::-webkit-details-marker]:hidden"
          >
            {numbered && <span className={cn("label num w-8 shrink-0", light ? "text-brass-light" : "text-brass-deep")}>{String(i + 1).padStart(2, "0")}</span>}
            <span className="serif-text flex-1 text-2xl transition-transform duration-700 ease-expo group-hover/acc:translate-x-1 md:text-[2rem]">{it.title}</span>
            {it.meta && <span className={cn("label hidden sm:block", light ? "text-paper/50" : "text-ebony/50")}>{it.meta}</span>}
            <span aria-hidden className="relative size-4 shrink-0 self-center">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-4 rotate-90 bg-current transition-transform duration-700 ease-expo group-[[open]:not([data-state=closed])]/acc:rotate-0 group-data-[state=open]/acc:rotate-0" />
            </span>
          </summary>
          <div data-acc-body className="overflow-hidden">
            <div className={cn("pb-8 md:pb-10", numbered && "pl-[3.25rem] md:pl-16", light ? "text-paper/75" : "text-ebony/75")}>{it.content}</div>
          </div>
        </details>
      ))}
    </div>
  )
}
