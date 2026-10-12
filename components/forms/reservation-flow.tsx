"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { useLenis } from "@/components/motion/motion-provider"
import { DateRange, fmtDay, nights, type Range } from "@/components/kit/date-range"
import { Choice, Field, Honeypot, TextArea } from "@/components/kit/field"
import { Button, Tag } from "@/components/kit/button"
import { Progress, pad } from "@/components/kit/controls"
import { Sent, SendError } from "@/components/kit/form-status"
import { fcfa, logements } from "@/lib/logements"
import { reservationSchema, fieldErrors } from "@/lib/schemas"
import { showPrices, site, wa } from "@/lib/site"
import { cn } from "@/lib/utils"

const STEPS = ["Dates", "Logement", "Coordonnées", "Récapitulatif"] as const
const iso = (d?: Date) => (d ? format(d, "yyyy-MM-dd") : "")

/** Réservation en quatre temps: dates → logement → coordonnées → récapitulatif. */
export function ReservationFlow() {
  const params = useSearchParams()
  const pre = params.get("logement") ?? ""
  const preSlug = logements.find((l) => l.slug === pre || String(l.id) === pre)?.slug ?? ""
  const lenis = useLenis()

  const [step, setStep] = useState(0)
  const [range, setRange] = useState<Range>({})
  const [guests, setGuests] = useState("2")
  const [slug, setSlug] = useState(preSlug)
  const [who, setWho] = useState({ nom: "", email: "", telephone: "", message: "", site: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")
  const panel = useRef<HTMLDivElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const dir = useRef(1)

  const room = logements.find((l) => l.slug === slug)
  const n = nights(range)
  const payload = {
    ...who,
    logement: slug,
    dateArrivee: iso(range.from),
    dateDepart: iso(range.to),
    nombrePersonnes: guests,
  }

  // Changement d'étape: le panneau sort, le suivant entre dans le sens de la marche.
  useEffect(() => {
    const el = panel.current
    if (!el) return
    const y = top.current ? top.current.getBoundingClientRect().top + window.scrollY - 120 : 0
    if (window.scrollY > y) lenis ? lenis.scrollTo(y, { duration: 0.8 }) : window.scrollTo({ top: y })
    if (reducedMotion()) return
    gsap.fromTo(el, { opacity: 0, x: 40 * dir.current, clipPath: dir.current > 0 ? "inset(0% 0% 0% 8%)" : "inset(0% 8% 0% 0%)" }, { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "lm", clearProps: "clipPath,transform" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const check = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 0) {
      if (!range.from || !range.to) e.dates = "Choisissez une date d’arrivée et une date de départ."
    }
    if (s === 1) {
      if (!room) e.logement = "Choisissez un logement."
      else if (Number(guests) > room.capacite) e.logement = `${room.court} accueille ${room.capacite} personnes au plus.`
    }
    if (s >= 2) {
      const r = reservationSchema.safeParse(payload)
      if (!r.success) Object.assign(e, fieldErrors(r.error))
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goto = (s: number) => {
    if (s > step) {
      for (let i = step; i < s; i++) if (!check(i)) return
    } else setErrors({})
    dir.current = s > step ? 1 : -1
    setStep(s)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (step < 3) return goto(step + 1)
    if (!check(3)) return setStep(2)
    setStatus("sending")
    try {
      const r = await fetch("/api/reservations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      if (r.status === 400) {
        const j = await r.json().catch(() => ({}))
        setErrors(j.fields ?? {})
        setStatus("idle")
        setStep(j.fields?.dateArrivee || j.fields?.dateDepart ? 0 : 2)
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  const setW = (k: keyof typeof who) => (e: { target: { value: string } }) => {
    setWho((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest)
  }

  if (status === "sent")
    return (
      <Sent title={<>Demande <em className="display-italic text-brass-deep">reçue.</em></>} className="py-10">
        <p>
          {room?.nom}, du {range.from && fmtDay(range.from)} au {range.to && fmtDay(range.to)}. Nous vérifions la disponibilité et revenons vers vous sous 24 heures pour confirmer, avec les modalités d’acompte.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={wa(site.whatsapp, `Bonjour, je viens d’envoyer une demande pour le ${room?.nom} du ${iso(range.from)} au ${iso(range.to)}.`)} variant="outline" icon="whatsapp">
            Confirmer sur WhatsApp
          </Button>
          <Button href="/" variant="link">
            Retour à l’accueil
          </Button>
        </div>
      </Sent>
    )

  return (
    <form onSubmit={submit} noValidate aria-label="Demande de réservation" className="relative">
      <Honeypot value={who.site} onChange={(x) => setWho((s) => ({ ...s, site: x }))} />

      {/* Étapes */}
      <div ref={top} className="flex items-end justify-between gap-6">
        <p className="label num text-ebony/55" aria-live="polite">
          Étape <span className="text-ebony">{pad(step + 1)}</span> / {pad(STEPS.length)} · {STEPS[step]}
        </p>
        {showPrices && room && n > 0 && (
          <p className="label num hidden text-ebony/55 sm:block">
            {n} nuit{n > 1 ? "s" : ""} · {room.court} · <span className="text-ebony">{fcfa(n * room.prix)}</span>
          </p>
        )}
      </div>
      <Progress value={(step + 1) / STEPS.length} className="mt-4" />
      <ol className="mt-4 grid grid-cols-4 gap-2">
        {STEPS.map((s, i) => (
          <li key={s}>
            <button
              type="button"
              onClick={() => goto(i)}
              aria-current={i === step ? "step" : undefined}
              className={cn("label w-full text-left transition-colors duration-500", i === step ? "text-ebony" : i < step ? "text-ebony/60 hover:text-ebony" : "text-ebony/30 hover:text-ebony/60")}
            >
              <span className="num mr-2 text-brass-deep">{pad(i + 1)}</span>
              <span className="hidden sm:inline">{s}</span>
            </button>
          </li>
        ))}
      </ol>

      <div ref={panel} className="mt-14 min-h-[28rem]">
        {step === 0 && (
          <div className="space-y-12">
            <DateRange value={range} onChange={(r) => (setRange(r), setErrors({}))} invalid={!!errors.dates} />
            {errors.dates && <SendError>{errors.dates}</SendError>}
            <Choice
              legend="Combien serez-vous ?"
              name="guests"
              value={guests}
              onChange={setGuests}
              options={["1", "2", "3", "4"].map((g) => ({ value: g, label: g === "4" ? "4 et +" : g }))}
            />
            {Number(guests) > 2 && <p className="max-w-[52ch] text-sm text-ebony/60">Nos logements accueillent deux personnes. À trois ou plus, réservez deux logements: indiquez-le dans votre message, nous organisons tout.</p>}
          </div>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="label text-ebony/55">Quel logement ?</legend>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {logements.map((l, i) => {
                const on = slug === l.slug
                const p = l.photos[0]!
                return (
                  <label key={l.slug} className={cn("group/opt relative flex cursor-pointer gap-5 border p-3 transition-colors duration-500", on ? "border-ebony bg-paper" : "border-ebony/15 hover:border-ebony/50")}>
                    <input type="radio" name="logement" value={l.slug} checked={on} onChange={() => (setSlug(l.slug), setErrors({}))} className="peer sr-only" />
                    <span className={cn("relative block aspect-[3/4] w-24 shrink-0 overflow-hidden bg-paper-3 sm:w-28", i % 2 && "shape-arch")}>
                      <Image src={p.src} alt="" fill sizes="120px" className="object-cover transition-transform duration-[1200ms] ease-expo group-hover/opt:scale-105" style={{ objectPosition: p.position }} />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col py-1">
                      <span className="label num text-brass-deep">{pad(i + 1)}</span>
                      <span className="display mt-2 text-[2rem] leading-none">{l.court}</span>
                      <span className="label num mt-auto pt-4 text-ebony/55">
                        {l.surface} · {l.capacite} pers.
                      </span>
                      {showPrices && (
                        <span className="serif-text num mt-1 text-lg">
                          {n > 0 ? fcfa(n * l.prix) : fcfa(l.prix)} <span className="label text-ebony/45">{n > 0 ? `${n} nuit${n > 1 ? "s" : ""}` : "la nuit"}</span>
                        </span>
                      )}
                    </span>
                    <span aria-hidden className={cn("absolute right-3 top-3 grid size-7 place-items-center rounded-full border transition-colors duration-500", on ? "border-ebony bg-ebony text-paper" : "border-ebony/20")}>
                      <svg viewBox="0 0 16 16" className={cn("size-3 transition-opacity", on ? "opacity-100" : "opacity-0")} fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 8.5l3 3 7-7" />
                      </svg>
                    </span>
                    <span aria-hidden className="pointer-events-none absolute inset-0 hidden outline-2 outline-offset-2 outline-brass-deep peer-focus-visible:block peer-focus-visible:outline" />
                  </label>
                )
              })}
            </div>
            {errors.logement && <div className="mt-6"><SendError>{errors.logement}</SendError></div>}
          </fieldset>
        )}

        {step === 2 && (
          <div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            <Field id="r-nom" label="Nom" name="nom" autoComplete="name" required value={who.nom} onChange={setW("nom")} error={errors.nom} />
            <Field id="r-telephone" label="Téléphone" hint="WhatsApp de préférence" name="telephone" type="tel" autoComplete="tel" required value={who.telephone} onChange={setW("telephone")} error={errors.telephone} />
            <Field id="r-email" label="E-mail" name="email" type="email" autoComplete="email" required value={who.email} onChange={setW("email")} error={errors.email} className="md:col-span-2" />
            <TextArea id="r-message" label="Message" hint="facultatif" name="message" value={who.message} onChange={setW("message")} error={errors.message} placeholder="Heure d’arrivée, chauffeur depuis l’aéroport, repas…" className="md:col-span-2" />
          </div>
        )}

        {step === 3 && (
          <div className="grid-12 gap-y-10">
            {room && (
              <div className="relative col-span-12 aspect-[4/3] overflow-hidden bg-paper-3 md:col-span-5">
                <Image src={room.photos[0]!.src} alt={room.photos[0]!.alt} fill sizes="(min-width:768px) 36vw, 90vw" className="object-cover" style={{ objectPosition: room.photos[0]!.position }} />
              </div>
            )}
            <dl className="col-span-12 border-t border-ebony/15 md:col-span-6 md:col-start-7">
              {[
                ["Logement", room?.nom ?? "—", 1],
                ["Arrivée", range.from ? fmtDay(range.from) : "—", 0],
                ["Départ", range.to ? fmtDay(range.to) : "—", 0],
                ["Personnes", guests === "4" ? "4 et +" : guests, 0],
                ["Nom", who.nom, 2],
                ["Contact", [who.telephone, who.email].filter(Boolean).join(" · "), 2],
              ].map(([k, v, s]) => (
                <div key={k as string} className="flex items-baseline justify-between gap-6 border-b border-ebony/15 py-4">
                  <dt className="label text-ebony/50">{k}</dt>
                  <dd className="flex items-baseline gap-4 text-right">
                    <span className="serif-text text-lg">{v}</span>
                    <button type="button" onClick={() => goto(s as number)} className="label link-line text-ebony/45 hover:text-ebony">
                      Modifier
                    </button>
                  </dd>
                </div>
              ))}
              {showPrices && room && n > 0 && (
                <div className="flex items-baseline justify-between gap-6 py-5">
                  <dt className="label text-ebony/50">
                    Estimation · {n} nuit{n > 1 ? "s" : ""}
                  </dt>
                  <dd className="display num text-mid">{fcfa(n * room.prix)}</dd>
                </div>
              )}
            </dl>
            <div className="col-span-12 flex flex-wrap gap-2 md:col-span-6 md:col-start-7">
              <Tag tone="sage" dot>Sans engagement</Tag>
              <Tag>Acompte 30 % à la confirmation</Tag>
              <Tag>Annulation gratuite à J-7</Tag>
            </div>
          </div>
        )}
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ebony/15 pt-8">
        {step > 0 ? (
          <Button variant="link" icon="none" onClick={() => goto(step - 1)}>
            ← Retour
          </Button>
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-4">
          {status === "error" && <SendError>L’envoi n’a pas abouti. Réessayez, ou passez par WhatsApp.</SendError>}
          <Button type="submit" disabled={status === "sending"}>
            {step < 3 ? "Continuer" : status === "sending" ? "Envoi…" : "Envoyer la demande"}
          </Button>
        </div>
      </div>
    </form>
  )
}
