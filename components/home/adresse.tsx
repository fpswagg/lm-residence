import { Figure } from "@/components/motion/figure"
import { SplitReveal } from "@/components/motion/split-reveal"
import { Magnetic } from "@/components/motion/magnetic"
import { ArrowIcon } from "@/components/site/icons"
import type { Photo } from "@/lib/photos"
import { site } from "@/lib/site"

const MAPS = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Chambre de Commerce Hippodrome Yaoundé")}`

/** Où nous trouver: quartier, repère, distances, lien vers la carte. */
export function Adresse({ photo }: { photo: Photo }) {
  return (
    <section data-theme="dark" className="relative bg-ebony py-[clamp(7rem,14vw,12rem)] text-paper" aria-labelledby="adresse-title">
      <div className="shell grid-12 gap-y-14">
        <div className="col-span-12 md:col-span-6">
          <p className="label flex items-center gap-4 text-brass-light">
            <span className="num">05</span>
            <span className="h-px w-10 bg-current opacity-50" />
            L’adresse
          </p>
          <SplitReveal as="h2" id="adresse-title" className="display text-huge mt-8">
            Au cœur de <em className="display-italic text-brass-light">Hippodrome.</em>
          </SplitReveal>
          <p className="lede mt-10 max-w-[34ch] text-paper/75">
            {site.address}, {site.addressHint}. Un quartier calme et central de Yaoundé; le chauffeur de la
            maison vous attend à l’aéroport sur demande.
          </p>
          <dl className="mt-12 grid max-w-md grid-cols-2 gap-y-6 border-t border-paper/15 pt-6">
            {[
              ["Quartier", "Hippodrome"],
              ["Repère", "Chambre de Commerce"],
              ["Accueil", "24 h / 24"],
              ["Transferts", "Avec chauffeur"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="label text-paper/50">{k}</dt>
                <dd className="serif-text num mt-1 text-xl">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-12">
            <Magnetic className="inline-block">
              <a href={MAPS} target="_blank" rel="noopener noreferrer" className="shape-pill label inline-flex items-center gap-3 border border-paper/30 px-6 py-4 transition-colors duration-500 hover:bg-paper hover:text-ebony">
                Ouvrir la carte <ArrowIcon className="size-4 -rotate-45" />
              </a>
            </Magnetic>
          </div>
        </div>
        <Figure photo={photo} sizes="(min-width:768px) 40vw, 90vw" parallax={12} className="shape-arch col-span-12 aspect-[4/5] md:col-span-5 md:col-start-8" />
      </div>
    </section>
  )
}
