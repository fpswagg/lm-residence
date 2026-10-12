import type { Metadata } from "next"
import { PageHead } from "@/components/kit/page-head"
import { Slideshow } from "@/components/kit/slideshow"
import { Button, Tag } from "@/components/kit/button"
import { SplitReveal } from "@/components/motion/split-reveal"
import { fcfa, logements } from "@/lib/logements"
import { photo } from "@/lib/photos"
import { showPrices } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Logements",
  description: "Trois studios de 45 m² et une chambre à L.M. Résidence, Yaoundé: climatisation, Wi-Fi, Canal+, cuisine équipée.",
  alternates: { canonical: "/logements" },
}

export default function LogementsPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Les logements"
        title={
          <>
            Quatre <em className="display-italic text-brass-deep">portes</em>
          </>
        }
        intro="Trois studios avec salon et cuisine, une chambre. Chacun a son caractère; tous ont la climatisation, le Wi-Fi, Canal+ et la maison autour."
        photo={photo("fauteuil-jp")}
      >
        <nav aria-label="Aller à un logement" className="mt-12">
          <ol className="grid grid-cols-2 gap-x-6 border-t border-ebony/15">
            {logements.map((l, i) => (
              <li key={l.slug} className="border-b border-ebony/15">
                <a href={`#${l.slug}`} className="group flex items-baseline gap-3 py-4">
                  <span className="label num text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="serif-text text-lg transition-transform duration-700 ease-expo group-hover:translate-x-1">{l.court}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHead>

      {logements.map((l, i) => {
        const dark = i % 2 === 1
        return (
          <section
            key={l.slug}
            id={l.slug}
            data-theme={dark ? "dark" : "light"}
            aria-labelledby={`t-${l.slug}`}
            className={cn("scroll-mt-0 py-[clamp(5rem,11vw,10rem)]", dark ? "bg-ebony text-paper" : i === 0 ? "bg-paper-2" : "bg-paper")}
          >
            <div className="shell grid-12 gap-y-14">
              <div className={cn("col-span-12 lg:col-span-7", dark && "lg:order-2 lg:col-start-6")}>
                <Slideshow
                  photos={l.photos}
                  label={l.nom}
                  tone={dark ? "light" : "dark"}
                  sizes="(min-width:1024px) 56vw, 92vw"
                  frameClassName={cn("aspect-[4/5] sm:aspect-[4/3]", i % 2 === 0 ? "" : "lg:aspect-[5/4]")}
                />
              </div>

              <div className={cn("col-span-12 flex flex-col lg:col-span-4", dark ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
                <span className={cn("display num text-big", dark ? "text-brass-light" : "text-brass-deep")}>{String(i + 1).padStart(2, "0")}</span>
                <p className={cn("label mt-10", dark ? "text-paper/55" : "text-ebony/55")}>{l.type === "chambre" ? "Chambre" : "Studio"}</p>
                <SplitReveal as="h2" id={`t-${l.slug}`} className="display mt-3 text-[clamp(3rem,6.4vw,6.5rem)]">
                  {l.court}
                </SplitReveal>
                <p className={cn("lede mt-6", dark ? "text-paper/80" : "text-ebony/80")}>{l.accroche}</p>

                <dl className={cn("mt-10 grid grid-cols-3 border-y py-5", dark ? "border-paper/15" : "border-ebony/15")}>
                  {[
                    ["Surface", l.surface],
                    ["Pour", `${l.capacite} pers.`],
                    ["La nuit", showPrices ? fcfa(l.prix) : "Sur demande"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className={cn("label", dark ? "text-paper/50" : "text-ebony/50")}>{k}</dt>
                      <dd className="serif-text num mt-1 text-lg xl:text-xl">{v}</dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Points forts">
                  {l.highlights.map((h) => (
                    <li key={h}>
                      <Tag tone={dark ? "light" : "dark"}>{h}</Tag>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap items-center gap-3 lg:mt-auto lg:pt-10">
                  <Button href={`/logements/${l.slug}`} variant={dark ? "paper" : "solid"}>
                    Voir le logement
                  </Button>
                  <Button href={`/reservation?logement=${l.slug}`} variant={dark ? "outline-light" : "outline"} icon="none">
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section data-theme="light" className="bg-paper py-[clamp(5rem,10vw,9rem)]">
        <div className="shell flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <p className="display text-big max-w-[14ch]">
            Pas sûr du <em className="display-italic text-brass-deep">bon choix ?</em>
          </p>
          <div className="flex flex-col items-start gap-4">
            <p className="max-w-[34ch] text-ebony/70">Dites-nous vos dates et combien vous êtes: on vous propose le logement qui convient.</p>
            <Button href="/contact" variant="link">
              Nous écrire
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
