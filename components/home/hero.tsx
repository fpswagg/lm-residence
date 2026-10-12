"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { whenOpen } from "@/lib/gate"
import type { Photo } from "@/lib/photos"
import { heroVideo } from "@/lib/site"

/**
 * Premier écran: « Une maison, quatre portes. » autour d'une photo en arche. L'arche s'ouvre à
 * l'arrivée; au scroll elle grandit jusqu'à remplir l'écran pendant que le titre s'écarte.
 * Quand une vidéo d'ambiance existera (lib/site.ts → heroVideo), elle remplace la photo.
 */
export function Hero({ photo }: { photo: Photo }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      if (reducedMotion()) return

      // Entrée (à l'ouverture de la porte)
      const intro = gsap
        .timeline({ paused: true })
        .fromTo(q("[data-hero-arch]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "door" })
        .fromTo(q("[data-hero-media]"), { scale: 1.45 }, { scale: 1.12, duration: 2.2 }, 0)
        .from(q("[data-hero-line]"), { yPercent: 105, duration: 1.4, stagger: 0.12 }, 0.35)
        .from(q("[data-hero-fade]"), { opacity: 0, y: 18, duration: 1, stagger: 0.08 }, 0.9)
      const cancel = whenOpen(() => intro.play())

      // Scroll: l'arche remplit l'écran.
      const mm = gsap.matchMedia()
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (ctx) => {
        const desktop = ctx.conditions?.desktop
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: "top top", end: "+=110%", scrub: 0.6, pin: true, anticipatePin: 1 },
            defaults: { ease: "none" },
          })
          .to(q("[data-hero-arch]"), { width: "100vw", height: "100svh", top: 0, borderRadius: 0, duration: 1 }, 0)
          .to(q("[data-hero-media]"), { scale: 1, duration: 1 }, 0)
          .to(q("[data-hero-l1]"), { xPercent: desktop ? -38 : -20, opacity: 0, duration: 0.7 }, 0)
          .to(q("[data-hero-l2]"), { xPercent: desktop ? 38 : 20, opacity: 0, duration: 0.7 }, 0)
          .to(q("[data-hero-fade]"), { opacity: 0, y: -20, duration: 0.4 }, 0)
          .fromTo(q("[data-hero-caption]"), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35 }, 0.65)
      })
      return () => {
        cancel()
        mm.revert()
      }
    },
    { scope: root },
  )

  return (
    <section ref={root} data-theme="light" className="relative h-[100svh] min-h-[600px] overflow-hidden bg-paper" aria-label="Accueil">
      {/* Photo en arche */}
      <div
        data-hero-arch
        className="shape-arch absolute inset-x-0 mx-auto top-[19svh] z-0 h-[62svh] w-[66vw] overflow-hidden bg-paper-3 md:top-[17svh] md:h-[70svh] md:w-[min(30vw,30rem)]"
      >
        <div data-hero-media className="absolute inset-0 scale-[1.12]">
          {heroVideo ? (
            <video
              className="h-full w-full object-cover"
              src={heroVideo.src}
              poster={photo.src}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="100vw"
              placeholder="blur"
              blurDataURL={photo.blur}
              className="object-cover"
              style={{ objectPosition: photo.position }}
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ebony/55 via-transparent to-transparent" aria-hidden />
        <div data-hero-caption className="absolute inset-x-0 bottom-0 shell pb-10 text-paper opacity-0">
          <p className="label mb-3 text-paper/75">Studio Alain-Christophe — la table ronde</p>
          <p className="display text-big max-w-[14ch]">
            Entrez, <em className="display-italic">vous êtes chez vous.</em>
          </p>
        </div>
      </div>

      {/* Titre */}
      <h1 className="pointer-events-none relative z-10 h-full">
        <span className="sr-only">L.M. Résidence, Yaoundé: une maison, quatre portes.</span>
        <span aria-hidden data-hero-l1 className="absolute left-[var(--gutter)] top-[calc(var(--header-h)+9svh)] block overflow-hidden md:top-[22svh]">
          <span data-hero-line className="display block text-giant">Une maison,</span>
        </span>
        <span aria-hidden data-hero-l2 className="absolute bottom-[17svh] right-[var(--gutter)] block overflow-hidden text-right md:bottom-[16svh]">
          <span data-hero-line className="display block text-giant">
            quatre <em className="display-italic text-brass-deep">portes.</em>
          </span>
        </span>
      </h1>

      {/* Bas d'écran */}
      <div className="absolute inset-x-0 bottom-0 z-10 shell flex items-end justify-between gap-6 pb-6 md:pb-8">
        <p data-hero-fade className="max-w-[34ch] text-[0.95rem] leading-snug text-ebony/75 max-md:hidden">
          Trois studios et une chambre dans une maison calme de Yaoundé, quartier Hippodrome. Le chef, le
          chauffeur et la sécurité veillent sur votre séjour.
        </p>
        <p data-hero-fade className="label flex items-center gap-3 text-ebony/70">
          <span className="relative block h-8 w-px overflow-hidden bg-ebony/15">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.2s_var(--ease-in-out)_infinite] bg-ebony" />
          </span>
          Défiler
        </p>
        <p data-hero-fade className="label text-right text-ebony/70">
          Yaoundé
          <br />
          3°52′ N · 11°31′ E
        </p>
      </div>
    </section>
  )
}
