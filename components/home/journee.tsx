"use client"

import Image from "next/image"
import { useRef } from "react"
import { gsap, useGSAP, reducedMotion } from "@/components/motion/gsap"
import type { Photo } from "@/lib/photos"

export interface Moment {
  time: string
  title: string
  text: string
  photo: Photo
}

// Matin → midi → soir → nuit
const SKY = ["#F3EDE3", "#E9DFC9", "#C99A63", "#15110D"]
const INK = ["#15110D", "#15110D", "#15110D", "#F3EDE3"]

/**
 * « Une journée à L.M. »: section épinglée; le fond passe du matin à la nuit, un disque (soleil puis
 * lune) traverse l'arc, chaque heure apporte sa photo et son service. Sans animation: liste simple.
 */
export function Journee({ moments }: { moments: Moment[] }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (reducedMotion()) return
      const q = gsap.utils.selector(root)
      const mm = gsap.matchMedia()
      mm.add("(min-width: 768px)", () => {
        const steps = q("[data-step]")
        const imgs = q("[data-step-img]")
        const n = steps.length
        gsap.set(steps.slice(1), { autoAlpha: 0 })
        gsap.set(imgs.slice(1), { clipPath: "inset(100% 0% 0% 0%)" })
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${n * 90}%`,
            scrub: 0.7,
            pin: true,
            anticipatePin: 1,
            onUpdate: (st) => {
              root.current!.dataset.theme = st.progress > 0.78 ? "dark" : "light"
            },
            onLeaveBack: () => (root.current!.dataset.theme = "light"),
          },
        })
        for (let i = 1; i < n; i++) {
          const at = i - 0.5
          tl.to(root.current, { backgroundColor: SKY[i], color: INK[i], duration: 1 }, at - 0.5)
            .to(steps[i - 1], { autoAlpha: 0, y: -40, duration: 0.35 }, at - 0.1)
            .fromTo(steps[i], { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.15)
            .to(imgs[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power2.inOut" }, at)
            .fromTo(imgs[i].querySelector("img"), { scale: 1.3 }, { scale: 1.05, duration: 0.8 }, at)
        }
        // Le disque suit un arc; il devient lune pour la nuit.
        tl.fromTo(q("[data-orb]"), { rotate: -70 }, { rotate: 70, duration: n - 1 }, 0)
          .to(q("[data-orb-fill]"), { backgroundColor: "#F3EDE3", boxShadow: "inset -0.9rem -0.4rem 0 0 #15110D", duration: 0.4 }, n - 1.6)
          .fromTo(q("[data-clock]"), { scaleX: 0 }, { scaleX: 1, duration: n - 1 }, 0)
          .to({}, { duration: 0.3 })
      })
      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      data-theme="light"
      className="relative overflow-hidden bg-paper text-ebony md:h-[100svh]"
      aria-labelledby="journee-title"
    >
      {/* Arc du ciel */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[58%] hidden h-[150vh] w-[150vh] -translate-x-1/2 rounded-full border border-current opacity-10 md:block" />
      <div aria-hidden data-orb className="pointer-events-none absolute left-1/2 top-[58%] hidden h-[150vh] w-0 origin-center md:block" style={{ transform: "rotate(-70deg)" }}>
        <span data-orb-fill className="absolute -left-6 -top-6 block size-12 rounded-full bg-brass" />
      </div>

      <div className="shell relative grid h-full grid-cols-1 gap-y-16 py-24 md:grid-cols-12 md:gap-x-6 md:py-0">
        <div className="flex flex-col justify-between md:col-span-5 md:py-[calc(var(--header-h)+5vh)]">
          <div>
            <p className="label flex items-center gap-4 opacity-70">
              <span className="num">03</span>
              <span className="h-px w-10 bg-current opacity-50" />
              Les services
            </p>
            <h2 id="journee-title" className="display text-big mt-8">
              Une journée <em className="display-italic">à L.M.</em>
            </h2>
          </div>

          <ol className="relative mt-12 md:mt-0 md:h-[34vh]">
            {moments.map((m, i) => (
              <li
                key={m.time}
                data-step
                className="mb-14 md:absolute md:inset-x-0 md:bottom-0 md:mb-0"
              >
                <div className="relative mb-6 aspect-[4/3] overflow-hidden md:hidden">
                  <Image src={m.photo.src} alt={m.photo.alt} fill sizes="90vw" className="object-cover" style={{ objectPosition: m.photo.position }} />
                </div>
                <p className="display num text-[clamp(3.5rem,8vw,7.5rem)] leading-none">
                  {m.time}
                </p>
                <h3 className="serif-text mt-4 text-2xl">{m.title}</h3>
                <p className="mt-3 max-w-[38ch] opacity-75">{m.text}</p>
                <span className="sr-only">Étape {i + 1} sur {moments.length}</span>
              </li>
            ))}
          </ol>

          <div aria-hidden className="mt-10 hidden h-px bg-current/20 md:block">
            <div data-clock className="h-full origin-left scale-x-0 bg-current" />
          </div>
        </div>

        <div className="relative hidden md:col-span-6 md:col-start-7 md:block">
          <div className="shape-arch absolute inset-x-0 bottom-0 top-[calc(var(--header-h)+5vh)] overflow-hidden">
            {moments.map((m, i) => (
              <div key={m.time} data-step-img className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
                <Image
                  src={m.photo.src}
                  alt={m.photo.alt}
                  fill
                  sizes="50vw"
                  placeholder="blur"
                  blurDataURL={m.photo.blur}
                  className="scale-105 object-cover"
                  style={{ objectPosition: m.photo.position }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
