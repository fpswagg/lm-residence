"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP, reducedMotion } from "@/components/motion/gsap"
import { TLink } from "@/components/site/transition"
import { ArrowIcon } from "@/components/site/icons"
import { fcfa, type Logement } from "@/lib/logements"
import { cn } from "@/lib/utils"

/**
 * Les quatre logements. Bureau: défilement horizontal épinglé, une « porte » par écran, photos en
 * parallaxe latérale. Mobile: les mêmes panneaux, empilés.
 */
export function Rooms({ rooms, showPrices }: { rooms: Logement[]; showPrices: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion()) return
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add("(min-width: 1024px)", () => {
        const track = q("[data-rooms-track]")[0] as HTMLElement
        const distance = () => track.scrollWidth - window.innerWidth
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        gsap.to(q("[data-rooms-bar]"), {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
        })
        for (const panel of q("[data-room]")) {
          const main = panel.querySelector("[data-room-main] img")
          const small = panel.querySelector("[data-room-small]")
          const st = { trigger: panel, containerAnimation: scroll, start: "left right", end: "right left", scrub: true }
          if (main) gsap.fromTo(main, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: st })
          if (small) gsap.fromTo(small, { xPercent: 30 }, { xPercent: -30, ease: "none", scrollTrigger: st })
          gsap.from(panel.querySelectorAll("[data-room-name] > span"), {
            yPercent: 105,
            duration: 1.2,
            stagger: 0.06,
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left 70%", once: true },
          })
        }
      })
      mm.add("(max-width: 1023px)", () => {
        for (const panel of q("[data-room]")) {
          gsap.from(panel.querySelectorAll("[data-room-name] > span"), {
            yPercent: 105,
            duration: 1.2,
            scrollTrigger: { trigger: panel, start: "top 75%", once: true },
          })
          const img = panel.querySelector("[data-room-main]")
          if (img) gsap.fromTo(img, { clipPath: "inset(18% 10% 0% 10%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: img, start: "top 95%", end: "top 35%", scrub: true } })
        }
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="logements" data-theme="light" className="relative overflow-hidden bg-paper-2" aria-labelledby="rooms-title">
      <div data-rooms-track className="flex flex-col lg:h-[100svh] lg:w-max lg:flex-row lg:items-stretch">
        {/* Intro */}
        <div className="shell flex flex-col justify-between py-24 lg:w-[38vw] lg:py-[calc(var(--header-h)+6vh)] lg:pr-0">
          <p className="label flex items-center gap-4 text-brass-deep">
            <span className="num">02</span>
            <span className="h-px w-10 bg-current opacity-50" />
            Les logements
          </p>
          <div>
            <h2 id="rooms-title" className="display text-huge mt-10">
              Quatre <em className="display-italic text-brass-deep">portes</em>
            </h2>
            <p className="mt-8 max-w-[36ch] text-ebony/70">
              Trois studios de 45 m² avec cuisine et salon, et une chambre. Chacun a son caractère, tous ont
              la climatisation, le Wi-Fi et Canal+.
            </p>
          </div>
          <p className="label mt-12 hidden items-center gap-3 text-ebony/50 lg:flex">
            Faites défiler <ArrowIcon className="size-4" />
          </p>
        </div>

        {rooms.map((r, i) => {
          const [main, small] = r.photos
          return (
            <article
              key={r.slug}
              data-room
              className="relative grid border-t border-ebony/10 lg:w-[86vw] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] lg:border-l lg:border-t-0 xl:w-[78vw]"
              aria-labelledby={`room-${r.slug}`}
            >
              <TLink
                href={`/logements/${r.slug}`}
                data-room-main
                data-cursor="Visiter"
                className={cn(
                  "relative mx-[var(--gutter)] mt-10 block aspect-[4/5] overflow-hidden bg-paper-3 lg:m-0 lg:my-[calc(var(--header-h)+3vh)] lg:ml-[4vw] lg:aspect-auto",
                  i % 2 ? "shape-arch" : "rounded-none",
                )}
                aria-label={`Visiter ${r.nom}`}
                tabIndex={-1}
              >
                <Image
                  src={main.src}
                  alt={main.alt}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  placeholder="blur"
                  blurDataURL={main.blur}
                  className="scale-[1.18] object-cover"
                  style={{ objectPosition: main.position }}
                />
              </TLink>

              <div className="relative flex flex-col justify-between px-[var(--gutter)] pb-16 pt-10 lg:px-[4vw] lg:py-[calc(var(--header-h)+3vh)]">
                <div className="flex items-start justify-between gap-6">
                  <span className="display num text-big text-brass-deep/90">{String(i + 1).padStart(2, "0")}</span>
                  {small && (
                    <div data-room-small className="relative hidden aspect-[3/4] w-[min(13vw,12rem)] overflow-hidden rounded-full lg:block">
                      <Image src={small.src} alt={small.alt} fill sizes="200px" className="object-cover" style={{ objectPosition: small.position }} />
                    </div>
                  )}
                </div>

                <div className="mt-10 lg:mt-0">
                  <p className="label text-ebony/55">{r.type === "chambre" ? "Chambre" : "Studio"}</p>
                  <h3 id={`room-${r.slug}`} data-room-name className="display mt-3 text-[clamp(3rem,7.4vw,8rem)]">
                    <span className="block overflow-hidden"><span className="block">{r.court}</span></span>
                  </h3>
                  <p className="lede mt-6 max-w-[26ch] text-ebony/80">{r.accroche}</p>
                </div>

                <div className="mt-10">
                  <dl className="grid grid-cols-3 border-y border-ebony/15 py-5">
                    <div>
                      <dt className="label text-ebony/50">Surface</dt>
                      <dd className="serif-text num mt-1 text-xl">{r.surface}</dd>
                    </div>
                    <div>
                      <dt className="label text-ebony/50">Pour</dt>
                      <dd className="serif-text num mt-1 text-xl">{r.capacite} pers.</dd>
                    </div>
                    <div>
                      <dt className="label text-ebony/50">La nuit</dt>
                      <dd className="serif-text num mt-1 text-xl">{showPrices ? fcfa(r.prix) : "Sur demande"}</dd>
                    </div>
                  </dl>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                    <ul className="flex flex-wrap gap-x-4 gap-y-1">
                      {r.highlights.map((h) => (
                        <li key={h} className="label text-ebony/60">{h}</li>
                      ))}
                    </ul>
                    <TLink href={`/logements/${r.slug}`} className="label group inline-flex items-center gap-3">
                      <span className="link-line">Découvrir</span>
                      <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                    </TLink>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <div aria-hidden className="absolute inset-x-[var(--gutter)] bottom-6 hidden h-px bg-ebony/10 lg:block">
        <div data-rooms-bar className="h-full origin-left scale-x-0 bg-ebony" />
      </div>
    </section>
  )
}
