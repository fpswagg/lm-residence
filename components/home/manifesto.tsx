import Image from "next/image"
import { SplitReveal } from "@/components/motion/split-reveal"
import type { Photo } from "@/lib/photos"

function Pill({ photo, className = "" }: { photo: Photo; className?: string }) {
  return (
    <span className={`relative mx-[0.12em] inline-block h-[0.78em] w-[1.7em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline ${className}`}>
      <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" style={{ objectPosition: photo.position }} />
    </span>
  )
}

/** Le manifeste: un paragraphe en grand, révélé mot à mot au scroll, avec de petites photos dans le texte. */
export function Manifesto({ pills, stats }: { pills: [Photo, Photo, Photo]; stats: { value: string; label: string }[] }) {
  return (
    <section data-theme="light" className="relative bg-paper py-[clamp(7rem,16vw,14rem)]">
      <div className="shell grid-12">
        <p className="label col-span-12 mb-10 flex items-center gap-4 text-brass-deep md:col-span-3 md:mb-0 md:pt-4">
          <span className="num">01</span>
          <span className="h-px w-10 bg-current opacity-50" />
          La maison
        </p>
        <SplitReveal
          as="p"
          by="words"
          className="col-span-12 serif-text text-[clamp(1.9rem,4.3vw,4.4rem)] leading-[1.08] tracking-[-0.02em] md:col-span-9"
        >
          Ici, ni hall d’hôtel ni couloirs sans fin. Une maison
          <Pill photo={pills[0]} />
          à Yaoundé, quatre portes, et des gens qui vous appellent par votre nom. Le chef prépare le
          petit-déjeuner
          <Pill photo={pills[1]} />, le chauffeur attend en bas, et la nuit, la maison veille
          <Pill photo={pills[2]} />.
        </SplitReveal>

        <dl className="col-span-12 mt-20 grid grid-cols-2 gap-y-10 border-t border-ebony/15 pt-8 md:col-span-9 md:col-start-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse">
              <dt className="label mt-2 text-ebony/55">{s.label}</dt>
              <dd className="display num text-mid">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
