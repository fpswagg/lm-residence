"use client"

import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { fr } from "date-fns/locale"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { ArrowButton } from "./controls"
import { cn } from "@/lib/utils"

export interface Range {
  from?: Date
  to?: Date
}

const WEEK = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."]
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
export const nights = (r: Range) => (r.from && r.to ? differenceInCalendarDays(r.to, r.from) : 0)
export const fmtDay = (d: Date) => format(d, "EEE d MMM", { locale: fr })

function useMonths() {
  const [n, setN] = useState(2)
  useEffect(() => {
    const m = window.matchMedia("(min-width: 768px)")
    const f = () => setN(m.matches ? 2 : 1)
    f()
    m.addEventListener("change", f)
    return () => m.removeEventListener("change", f)
  }, [])
  return n
}

/**
 * Calendrier d'arrivée / départ: deux mois sur bureau, un sur mobile. Premier clic = arrivée,
 * second = départ, la plage se dessine au survol. Clavier: flèches (jour/semaine), Pages (mois),
 * Entrée pour choisir. Les mois glissent quand on change de page.
 */
export function DateRange({ value, onChange, minDate, invalid }: { value: Range; onChange: (r: Range) => void; minDate?: Date; invalid?: boolean }) {
  const today = startOfDay(new Date())
  const min = minDate ? startOfDay(minDate) : today
  const months = useMonths()
  const [view, setView] = useState(() => startOfMonth(value.from ?? min))
  const [focus, setFocus] = useState<Date>(() => value.from ?? min)
  const [hover, setHover] = useState<Date | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const prevView = useRef(view)
  const wantFocus = useRef(false)

  // Les mois glissent dans le sens de la navigation.
  useEffect(() => {
    const from = prevView.current
    prevView.current = view
    if (isSameMonth(from, view) || !grid.current || reducedMotion()) return
    const dir = isAfter(view, from) ? 1 : -1
    gsap.fromTo(grid.current.children, { xPercent: 12 * dir, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "lm" })
  }, [view])

  useEffect(() => {
    if (!wantFocus.current) return
    wantFocus.current = false
    grid.current?.querySelector<HTMLButtonElement>(`[data-day="${format(focus, "yyyy-MM-dd")}"]`)?.focus()
  }, [focus, view])

  const pick = (d: Date) => {
    if (isBefore(d, min)) return
    const { from, to } = value
    if (!from || to || !isAfter(d, from)) onChange({ from: d, to: undefined })
    else onChange({ from, to: d })
  }

  const moveFocus = (d: Date) => {
    const next = isBefore(d, min) ? min : d
    wantFocus.current = true
    setFocus(next)
    const last = endOfMonth(addMonths(view, months - 1))
    if (isBefore(next, view)) setView(startOfMonth(next))
    else if (isAfter(next, last)) setView(startOfMonth(addMonths(next, -(months - 1))))
  }

  const page = (d: number) => {
    const v = addMonths(view, d)
    setView(v)
    setFocus(isBefore(v, min) ? min : v)
  }

  const onKey = (e: KeyboardEvent) => {
    const k = e.key
    const map: Record<string, () => Date> = {
      ArrowLeft: () => addDays(focus, -1),
      ArrowRight: () => addDays(focus, 1),
      ArrowUp: () => addDays(focus, -7),
      ArrowDown: () => addDays(focus, 7),
      PageUp: () => addMonths(focus, -1),
      PageDown: () => addMonths(focus, 1),
      Home: () => startOfWeek(focus, { weekStartsOn: 1 }),
      End: () => endOfWeek(focus, { weekStartsOn: 1 }),
    }
    if (map[k]) {
      e.preventDefault()
      moveFocus(map[k]!())
    }
  }

  const end = value.to ?? (value.from && hover && isAfter(hover, value.from) ? hover : undefined)
  const canPrev = isAfter(view, startOfMonth(min))

  return (
    <div className={cn("relative", invalid && "[&_[data-cal-frame]]:border-terracotta")}>
      <div className="flex items-center justify-between gap-4">
        <p className="label text-ebony/55" aria-live="polite">
          {!value.from && "Choisissez la date d’arrivée"}
          {value.from && !value.to && "Puis la date de départ"}
          {value.from && value.to && `${nights(value)} nuit${nights(value) > 1 ? "s" : ""} · ${fmtDay(value.from)} → ${fmtDay(value.to)}`}
        </p>
        <div className="flex gap-2">
          <ArrowButton dir="prev" label="Mois précédent" disabled={!canPrev} onClick={() => page(-1)} />
          <ArrowButton dir="next" label="Mois suivant" onClick={() => page(1)} />
        </div>
      </div>

      <div ref={grid} data-cal-frame className="mt-8 grid gap-x-12 gap-y-10 overflow-hidden md:grid-cols-2" onKeyDown={onKey} onPointerLeave={() => setHover(null)}>
        {Array.from({ length: months }, (_, m) => {
          const month = addMonths(view, m)
          const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 })
          const stop = endOfWeek(endOfMonth(month), { weekStartsOn: 1 })
          const days: Date[] = []
          for (let d = start; !isAfter(d, stop); d = addDays(d, 1)) days.push(d)
          return (
            <div key={format(month, "yyyy-MM")}>
              <p className="display text-[clamp(1.75rem,2.6vw,2.5rem)] leading-none">
                {cap(format(month, "LLLL", { locale: fr }))} <span className="display-italic text-brass-deep">{format(month, "yyyy")}</span>
              </p>
              <div role="grid" aria-label={cap(format(month, "LLLL yyyy", { locale: fr }))} className="mt-6">
                <div role="row" className="grid grid-cols-7">
                  {WEEK.map((w) => (
                    <span key={w} role="columnheader" className="label pb-3 text-center text-ebony/40">
                      {w.slice(0, 1).toUpperCase()}
                      <span className="sr-only">{w}</span>
                    </span>
                  ))}
                </div>
                <div role="rowgroup" className="grid grid-cols-7 gap-y-1">
                  {days.map((d) => {
                    const out = !isSameMonth(d, month)
                    const off = isBefore(d, min)
                    const isFrom = value.from && isSameDay(d, value.from)
                    const isTo = end && isSameDay(d, end)
                    const inRange = value.from && end && isAfter(d, value.from) && isBefore(d, end)
                    const key = format(d, "yyyy-MM-dd")
                    if (out) return <span key={key} aria-hidden className="h-11 md:h-12" />
                    return (
                      <div
                        key={key}
                        role="gridcell"
                        className={cn(
                          "relative h-11 md:h-12",
                          (inRange || (isFrom && end) || isTo) && "before:absolute before:inset-y-1 before:bg-paper-3",
                          inRange && "before:inset-x-0",
                          isFrom && end && "before:left-1/2 before:right-0",
                          isTo && "before:left-0 before:right-1/2",
                          !value.to && (inRange || isTo) && "before:bg-paper-2",
                        )}
                      >
                        <button
                          type="button"
                          data-day={key}
                          tabIndex={isSameDay(d, focus) ? 0 : -1}
                          disabled={off}
                          aria-pressed={!!(isFrom || (value.to && isTo))}
                          aria-label={`${format(d, "EEEE d MMMM yyyy", { locale: fr })}${isFrom ? ", arrivée" : ""}${value.to && isTo ? ", départ" : ""}`}
                          onClick={() => {
                            setFocus(d)
                            pick(d)
                          }}
                          onPointerEnter={() => setHover(d)}
                          onFocus={() => setHover(d)}
                          className={cn(
                            "num relative z-[1] mx-auto grid size-11 place-items-center rounded-full text-[0.95rem] transition-colors duration-300 md:size-12",
                            off ? "cursor-default text-ebony/20" : "hover:bg-ebony/8 cursor-pointer",
                            (isFrom || isTo) && "bg-ebony text-paper hover:bg-ebony",
                            isSameDay(d, today) && !isFrom && !isTo && "after:absolute after:bottom-1.5 after:size-1 after:rounded-full after:bg-brass",
                          )}
                        >
                          {format(d, "d")}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
