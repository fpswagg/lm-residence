"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { gsap, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { useLenis } from "@/components/motion/motion-provider"
import { Magnetic } from "@/components/motion/magnetic"
import { TLink } from "./transition"
import { Monogram } from "./monogram"
import { nav, site, tel, wa } from "@/lib/site"
import { cn } from "@/lib/utils"

const MENU = [{ href: "/", label: "Accueil" }, ...nav, { href: "/reservation", label: "Réserver" }]
const MENU_PHOTOS: Record<string, string> = {
  "/": "/img/escalier.jpg",
  "/logements": "/img/chambre-jp.jpg",
  "/services": "/img/table-jp.jpg",
  "/galerie": "/img/applique.jpg",
  "/a-propos": "/img/enseigne.jpg",
  "/contact": "/img/facade-2.jpg",
  "/reservation": "/img/salle-a-manger-ac.jpg",
}

/**
 * En-tête fixe: se cache quand on descend, revient quand on remonte, et prend la couleur de la
 * section qu'il survole ([data-theme="dark"] = texte papier). Menu plein écran avec les pages en
 * très grand et une photo dans une arche.
 */
export function Header() {
  const pathname = usePathname()
  const lenis = useLenis()
  const bar = useRef<HTMLElement>(null)
  const menu = useRef<HTMLDivElement>(null)
  const tl = useRef<gsap.core.Timeline | null>(null)
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [preview, setPreview] = useState(MENU_PHOTOS[pathname] ?? MENU_PHOTOS["/"])

  // Couleur et visibilité selon le scroll.
  useEffect(() => {
    let last = window.scrollY
    let raf = 0
    const check = () => {
      raf = 0
      const y = window.scrollY
      const h = bar.current?.offsetHeight ?? 80
      setScrolled(y > 40)
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > h * 2)
        last = y
      }
      const under = document
        .elementsFromPoint(window.innerWidth / 2, h / 2)
        .find((e) => !bar.current?.contains(e))
        ?.closest("[data-theme]")
      setDark(under?.getAttribute("data-theme") === "dark")
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    const t = setTimeout(check, 400)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      cancelAnimationFrame(raf)
      clearTimeout(t)
    }
  }, [pathname])

  useGSAP(
    () => {
      const m = menu.current!
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "door" } })
        .set(m, { visibility: "visible" })
        .fromTo(m, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 })
        .from("[data-menu-link]", { yPercent: 115, duration: 1, stagger: 0.05, ease: "lm" }, 0.35)
        .from("[data-menu-num]", { opacity: 0, duration: 0.6, stagger: 0.05 }, 0.55)
        .from("[data-menu-photo]", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2 }, 0.4)
        .from("[data-menu-foot]", { opacity: 0, y: 16, duration: 0.8, stagger: 0.06, ease: "lm" }, 0.6)
    },
    { scope: menu },
  )

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const t = tl.current
    if (!t) return
    if (open) {
      lenis?.stop()
      reducedMotion() ? t.progress(1).pause() : t.timeScale(1).play()
      document.body.style.overflow = "hidden"
      requestAnimationFrame(() => menu.current?.querySelector<HTMLElement>("a")?.focus())
    } else {
      lenis?.start()
      document.body.style.overflow = ""
      if (t.progress() > 0) reducedMotion() ? t.progress(0).pause() : t.timeScale(1.6).reverse()
    }
  }, [open, lenis])

  // Fermer à chaque changement de page (le rideau couvre déjà).
  useEffect(() => {
    if (open) {
      setOpen(false)
      tl.current?.progress(0).pause()
      gsap.set(menu.current, { visibility: "hidden" })
    }
    setPreview(MENU_PHOTOS[pathname] ?? MENU_PHOTOS["/"])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") return close()
      if (e.key !== "Tab" || !menu.current) return
      const f = [...menu.current.querySelectorAll<HTMLElement>("a,button")].filter((x) => x.offsetParent)
      const btn = document.getElementById("menu-toggle")
      if (btn) f.unshift(btn)
      const i = f.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && i <= 0) {
        e.preventDefault()
        f[f.length - 1]?.focus()
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault()
        f[0]?.focus()
      }
    }
    window.addEventListener("keydown", key)
    return () => window.removeEventListener("keydown", key)
  }, [open, close])

  const light = dark || open
  const active = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href))

  return (
    <>
      <header
        ref={bar}
        className={cn(
          "fixed inset-x-0 top-0 z-[70] transition-[transform,color,background-color] duration-700 ease-expo",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          light ? "text-paper" : "text-ebony",
        )}
      >
        <div
          className={cn(
            "absolute inset-0 -z-10 transition-opacity duration-700",
            scrolled && !open ? "opacity-100" : "opacity-0",
            dark ? "bg-ebony/70" : "bg-paper/75",
          )}
          style={{ backdropFilter: "blur(14px) saturate(1.2)", WebkitBackdropFilter: "blur(14px) saturate(1.2)" }}
        />
        <div className="shell flex h-[var(--header-h)] items-center justify-between gap-6">
          <TLink href="/" className="group flex items-center gap-3" aria-label="L.M. Résidence, accueil">
            <Monogram className="h-10 w-auto transition-transform duration-700 ease-expo group-hover:-translate-y-0.5" title="" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="display text-[1.35rem] tracking-[-0.02em]">L.M. Résidence</span>
              <span className="label mt-1 opacity-60">Yaoundé · Hippodrome</span>
            </span>
          </TLink>

          <nav aria-label="Navigation principale" className="hidden items-center gap-8 lg:flex">
            {nav.slice(0, 4).map((l) => (
              <TLink
                key={l.href}
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className="label link-line pb-1"
              >
                {l.label}
              </TLink>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Magnetic className="hidden sm:inline-block">
              <TLink
                href="/reservation"
                className={cn(
                  "label inline-flex h-11 items-center rounded-full px-6 transition-colors duration-500",
                  light ? "bg-paper text-ebony hover:bg-brass-light" : "bg-ebony text-paper hover:bg-brass-deep",
                )}
              >
                Réserver
              </TLink>
            </Magnetic>
            <button
              id="menu-toggle"
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className={cn(
                "label group inline-flex h-11 items-center gap-3 rounded-full border px-5 transition-colors duration-500",
                light ? "border-paper/30 hover:border-paper" : "border-ebony/25 hover:border-ebony",
              )}
            >
              <span className="relative block h-[1.2em] overflow-hidden leading-[1.2em]">
                <span aria-hidden className="invisible block h-0">Fermer</span>
                <span className={cn("block transition-transform duration-700 ease-expo", open && "-translate-y-full")}>Menu</span>
                <span className={cn("absolute inset-0 block translate-y-full transition-transform duration-700 ease-expo", open && "translate-y-0")}>Fermer</span>
              </span>
              <span aria-hidden className="relative flex h-2.5 w-4 flex-col justify-between">
                <span className={cn("h-px w-full bg-current transition-transform duration-500", open && "translate-y-[4.5px] rotate-45")} />
                <span className={cn("h-px w-full bg-current transition-transform duration-500", open && "-translate-y-[4.5px] -rotate-45")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className="fixed inset-0 z-[65] overflow-y-auto bg-ebony text-paper"
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
        data-theme="dark"
        data-lenis-prevent
      >
        <div className="shell grid min-h-full grid-cols-12 gap-x-6 pb-10 pt-[calc(var(--header-h)+4vh)]">
          <nav aria-label="Menu" className="col-span-12 flex flex-col justify-center lg:col-span-7">
            <ul>
              {MENU.map((l, i) => (
                <li key={l.href} className="border-b border-paper/10 first:border-t">
                  <TLink
                    href={l.href}
                    onClick={close}
                    onPointerEnter={() => setPreview(MENU_PHOTOS[l.href])}
                    onFocus={() => setPreview(MENU_PHOTOS[l.href])}
                    aria-current={active(l.href) ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                    className="group flex items-baseline gap-4 py-[1.1vh] sm:gap-8"
                  >
                    <span data-menu-num className="label num w-8 text-brass-light/80">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="block overflow-hidden">
                      <span data-menu-link className="block">
                        <span
                          className={cn(
                            "display block text-[clamp(2.6rem,7.4vh,6.5rem)] transition-[transform,color] duration-700 ease-expo group-hover:translate-x-4 group-hover:text-brass-light",
                            active(l.href) && "display-italic text-brass-light",
                          )}
                        >
                          {l.label}
                        </span>
                      </span>
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden lg:col-span-4 lg:col-start-9 lg:flex lg:items-center">
            <div data-menu-photo className="shape-arch relative aspect-[3/4] w-full overflow-hidden bg-ebony-3">
              <Image
                key={preview}
                src={preview}
                alt=""
                fill
                sizes="(min-width: 1024px) 30vw, 1px"
                className="animate-in fade-in object-cover duration-700"
              />
            </div>
          </div>
          <div className="col-span-12 mt-10 grid grid-cols-2 gap-6 border-t border-paper/10 pt-6 text-paper/70 sm:grid-cols-4">
            <div data-menu-foot>
              <p className="label mb-2 text-paper/40">Adresse</p>
              <p className="text-sm">{site.address}<br />{site.city}, {site.addressHint}</p>
            </div>
            <div data-menu-foot>
              <p className="label mb-2 text-paper/40">Téléphone</p>
              <a href={tel(site.phone)} tabIndex={open ? 0 : -1} className="link-line text-sm">{site.phone}</a>
            </div>
            <div data-menu-foot>
              <p className="label mb-2 text-paper/40">WhatsApp</p>
              <a href={wa(site.whatsapp, "Bonjour, je souhaite des informations sur L.M. Résidence.")} target="_blank" rel="noopener" tabIndex={open ? 0 : -1} className="link-line text-sm">Écrire un message</a>
            </div>
            <div data-menu-foot>
              <p className="label mb-2 text-paper/40">Accueil</p>
              <p className="text-sm">24 h / 24, 7 j / 7</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
