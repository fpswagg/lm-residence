"use client"

import Link, { type LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react"
import { gsap, reducedMotion } from "@/components/motion/gsap"
import { closeGate, openGate } from "@/lib/gate"
import { useLenis } from "@/components/motion/motion-provider"

const NAMES: Record<string, string> = {
  "/": "Accueil",
  "/logements": "Logements",
  "/services": "Services",
  "/galerie": "Galerie",
  "/a-propos": "La maison",
  "/contact": "Contact",
  "/reservation": "Réserver",
  "/politiques": "Politiques",
}
const nameOf = (path: string) =>
  NAMES[path] ?? NAMES["/" + (path.split("/")[1] ?? "")] ?? "L.M. Résidence"

type Navigate = (href: string) => void
const TransitionContext = createContext<Navigate | null>(null)

/** Rideau entre les pages: il monte, la page change dessous, il repart vers le haut. */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()
  const curtain = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const pending = useRef<string | null>(null)
  const busy = useRef(false)

  const navigate = useCallback<Navigate>(
    (href) => {
      const target = new URL(href, window.location.href)
      if (busy.current) return
      if (reducedMotion() || !curtain.current) {
        router.push(href)
        return
      }
      busy.current = true
      pending.current = target.pathname
      closeGate()
      lenis?.stop()
      if (label.current) label.current.textContent = nameOf(target.pathname)
      const el = curtain.current
      gsap.killTweensOf(el)
      gsap
        .timeline({ onComplete: () => router.push(href) })
        .set(el, { visibility: "visible", yPercent: 100, borderTopLeftRadius: "50% 18vh", borderTopRightRadius: "50% 18vh" })
        .to(el, { yPercent: 0, borderTopLeftRadius: "0% 0vh", borderTopRightRadius: "0% 0vh", duration: 0.85, ease: "door" })
        .fromTo(label.current, { yPercent: 110 }, { yPercent: 0, duration: 0.7 }, "-=0.45")
    },
    [router, lenis],
  )

  // La nouvelle page est montée sous le rideau: on le retire.
  useEffect(() => {
    if (!busy.current || pending.current !== pathname) return
    const el = curtain.current!
    lenis?.start()
    gsap
      .timeline({
        delay: 0.1,
        onComplete: () => {
          gsap.set(el, { visibility: "hidden" })
          busy.current = false
        },
      })
      .to(label.current, { yPercent: -110, duration: 0.5, ease: "power3.in" })
      .to(el, { yPercent: -100, borderBottomLeftRadius: "50% 18vh", borderBottomRightRadius: "50% 18vh", duration: 0.9, ease: "door" }, "-=0.15")
      .add(openGate, "-=0.55")
      .set(el, { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 })
  }, [pathname, lenis])

  return (
    <TransitionContext.Provider value={navigate}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[80] flex items-center justify-center bg-ebony text-paper"
        style={{ visibility: "hidden" }}
      >
        <span className="block overflow-hidden">
          <span ref={label} className="display-italic block text-big">
            &nbsp;
          </span>
        </span>
      </div>
    </TransitionContext.Provider>
  )
}

export const useNavigate = () => useContext(TransitionContext)

type TLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { children?: ReactNode }

/** next/link avec la transition de rideau (clic simple sur un lien interne vers une autre page). */
export const TLink = forwardRef<HTMLAnchorElement, TLinkProps>(function TLink({ onClick, href, ...rest }, ref) {
  const navigate = useNavigate()
  const pathname = usePathname()
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || !navigate) return
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (rest.target && rest.target !== "_self") return
    const url = new URL(String(href), window.location.href)
    if (url.origin !== window.location.origin) return
    if (url.pathname === pathname) {
      if (!url.hash) {
        e.preventDefault()
        ;(window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis?.scrollTo(0) ?? window.scrollTo({ top: 0, behavior: "smooth" })
      }
      return
    }
    e.preventDefault()
    navigate(url.pathname + url.search + url.hash)
  }
  return <Link ref={ref} href={href} onClick={handle} {...rest} />
})
