"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { Magnetic } from "@/components/motion/magnetic"
import { ArrowIcon } from "@/components/site/icons"
import type { Photo } from "@/lib/photos"
import { cn } from "@/lib/utils"

export const pad = (n: number) => String(n).padStart(2, "0")

/** Compteur éditorial « 03 / 08 »: le chiffre courant roule dans le sens du mouvement. */
export function Counter({ index, count, className }: { index: number; count: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prev = useRef(index)
  useEffect(() => {
    const from = prev.current
    prev.current = index
    if (from === index || !ref.current || reducedMotion()) return
    const forward = (index > from && !(from === 0 && index === count - 1)) || (from === count - 1 && index === 0)
    gsap.fromTo(ref.current, { yPercent: forward ? 100 : -100 }, { yPercent: 0, duration: 0.7, ease: "lm" })
  }, [index, count])
  return (
    <p className={cn("label num flex items-baseline gap-2", className)} aria-hidden>
      <span className="inline-block overflow-hidden align-bottom">
        <span ref={ref} className="inline-block">{pad(index + 1)}</span>
      </span>
      <span className="opacity-40">/</span>
      <span className="opacity-40">{pad(count)}</span>
    </p>
  )
}

/** Barre de progression fine: la part déjà vue de la série. */
export function Progress({ value, className, tone = "dark", smooth = true }: { value: number; className?: string; tone?: "dark" | "light"; smooth?: boolean }) {
  return (
    <span aria-hidden className={cn("relative block h-px overflow-hidden", tone === "dark" ? "bg-ebony/15" : "bg-paper/20", className)}>
      <span
        className={cn("absolute inset-0 origin-left", smooth && "transition-transform duration-1000 ease-expo", tone === "dark" ? "bg-ebony" : "bg-paper")}
        style={{ transform: `scaleX(${Math.max(0, Math.min(1, value))})` }}
      />
    </span>
  )
}

/** Flèche ronde (précédent / suivant), aimantée à la souris. */
export function ArrowButton({
  dir,
  onClick,
  label,
  tone = "dark",
  className,
  disabled,
}: {
  dir: "prev" | "next"
  onClick: () => void
  label: string
  tone?: "dark" | "light"
  className?: string
  disabled?: boolean
}) {
  return (
    <Magnetic strength={0.3} className={className}>
      <button
        type="button"
        onClick={onClick}
        aria-label={label}
        disabled={disabled}
        className={cn(
          "group/arrow relative grid size-12 place-items-center overflow-hidden rounded-full border transition-colors duration-500 disabled:pointer-events-none disabled:opacity-30 md:size-14",
          tone === "dark" ? "border-ebony/20 hover:border-ebony hover:bg-ebony hover:text-paper" : "border-paper/25 text-paper hover:border-paper hover:bg-paper hover:text-ebony",
        )}
      >
        <span className="relative block size-4 overflow-hidden">
          <ArrowIcon
            className={cn(
              "absolute inset-0 size-4 transition-transform duration-700 ease-expo",
              dir === "prev" ? "rotate-180 group-hover/arrow:-translate-x-full" : "group-hover/arrow:translate-x-full",
            )}
          />
          <ArrowIcon
            className={cn(
              "absolute inset-0 size-4 transition-transform duration-700 ease-expo",
              dir === "prev" ? "translate-x-full rotate-180 group-hover/arrow:translate-x-0" : "-translate-x-full group-hover/arrow:translate-x-0",
            )}
          />
        </span>
      </button>
    </Magnetic>
  )
}

/** Vignettes: la courante est pleine et soulignée, la bande suit l'index. */
export function Thumbs({
  photos,
  index,
  onSelect,
  tone = "dark",
  className,
  label = "Choisir une photo",
}: {
  photos: Photo[]
  index: number
  onSelect: (i: number) => void
  tone?: "dark" | "light"
  className?: string
  label?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const box = ref.current
    const el = box?.children[index] as HTMLElement | undefined
    if (!box || !el) return
    const left = el.offsetLeft - box.clientWidth / 2 + el.clientWidth / 2
    box.scrollTo({ left, behavior: reducedMotion() ? "auto" : "smooth" })
  }, [index])
  return (
    <div ref={ref} role="group" aria-label={label} data-lenis-prevent className={cn("flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}>
      {photos.map((p, i) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Photo ${i + 1}: ${p.alt}`}
          aria-current={i === index ? "true" : undefined}
          className={cn(
            "group/thumb relative h-14 w-11 shrink-0 overflow-hidden md:h-16 md:w-12",
            tone === "dark" ? "bg-paper-3" : "bg-ebony-3",
          )}
        >
          <Image
            src={p.src}
            alt=""
            fill
            sizes="96px"
            className={cn(
              "object-cover transition-[opacity,transform,filter] duration-700 ease-expo",
              i === index ? "scale-100 opacity-100" : "scale-110 opacity-45 grayscale-[60%] group-hover/thumb:opacity-80 group-hover/thumb:grayscale-0",
            )}
            style={{ objectPosition: p.position }}
          />
          <span
            aria-hidden
            className={cn(
              "absolute inset-x-0 bottom-0 h-0.5 origin-left transition-transform duration-700 ease-expo",
              tone === "dark" ? "bg-ebony" : "bg-paper",
              i === index ? "scale-x-100" : "scale-x-0",
            )}
          />
        </button>
      ))}
    </div>
  )
}

export function ExpandIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden {...p}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </svg>
  )
}

export function CloseIcon(p: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden {...p}>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  )
}
