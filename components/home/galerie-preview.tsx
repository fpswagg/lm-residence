import { Figure } from "@/components/motion/figure"
import { SplitReveal } from "@/components/motion/split-reveal"
import { TLink } from "@/components/site/transition"
import { ArrowIcon } from "@/components/site/icons"
import type { Photo } from "@/lib/photos"

/** Aperçu de la galerie: un collage éditorial, formats et décalages volontairement irréguliers. */
export function GaleriePreview({ photos }: { photos: [Photo, Photo, Photo, Photo, Photo] }) {
  const [a, b, c, d, e] = photos
  return (
    <section data-theme="light" className="relative bg-paper py-[clamp(7rem,14vw,12rem)]" aria-labelledby="galerie-title">
      <div className="shell grid-12 items-end">
        <p className="label col-span-12 flex items-center gap-4 text-brass-deep md:col-span-3">
          <span className="num">04</span>
          <span className="h-px w-10 bg-current opacity-50" />
          Galerie
        </p>
        <SplitReveal as="h2" id="galerie-title" className="display text-huge col-span-12 mt-8 md:col-span-9 md:mt-0">
          Les détails <em className="display-italic text-brass-deep">qui restent.</em>
        </SplitReveal>
      </div>

      <TLink href="/galerie" data-cursor="Voir" aria-label="Voir toute la galerie" className="shell mt-16 grid grid-cols-12 gap-x-[clamp(0.75rem,2vw,1.5rem)] gap-y-6 md:mt-24">
        <Figure photo={a} sizes="(min-width:768px) 34vw, 60vw" parallax={10} className="shape-arch col-span-7 aspect-[3/4] md:col-span-4" />
        <div className="col-span-5 flex flex-col justify-end gap-6 md:col-span-3 md:col-start-6 md:pb-[20%]">
          <Figure photo={b} sizes="(min-width:768px) 24vw, 40vw" className="aspect-square rounded-full" />
          <p className="label max-w-[22ch] text-ebony/60">{b.alt}</p>
        </div>
        <Figure photo={c} sizes="(min-width:768px) 30vw, 90vw" parallax={14} className="col-span-12 aspect-[4/3] md:col-span-3 md:col-start-10 md:-mt-[30%] md:aspect-[3/4]" />
        <Figure photo={d} sizes="(min-width:768px) 40vw, 60vw" parallax={8} className="col-span-7 aspect-[4/3] md:col-span-5 md:col-start-2 md:mt-[8%]" />
        <Figure photo={e} sizes="(min-width:768px) 22vw, 40vw" className="shape-arch col-span-5 aspect-[2/3] md:col-span-3 md:col-start-8 md:mt-[-4%]" />
      </TLink>

      <div className="shell mt-16 flex justify-end">
        <TLink href="/galerie" className="label group inline-flex items-center gap-3">
          <span className="link-line">Toute la galerie</span>
          <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
        </TLink>
      </div>
    </section>
  )
}
