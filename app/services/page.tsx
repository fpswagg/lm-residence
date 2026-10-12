import type { Metadata } from "next"
import services from "@/data/services.json"
import { PageHead } from "@/components/kit/page-head"
import { Button, Eyebrow, Tag } from "@/components/kit/button"
import { Figure } from "@/components/motion/figure"
import { SplitReveal } from "@/components/motion/split-reveal"
import { photo } from "@/lib/photos"
import { policies } from "@/lib/policies"
import { site, wa } from "@/lib/site"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Services",
  description: "Cuisinier sur place, blanchisserie, véhicule avec chauffeur et sécurité DAK 24 h/24 à L.M. Résidence, Yaoundé.",
  alternates: { canonical: "/services" },
}

const PHOTOS = ["table-jp", "penderie-marie", "facade-2", "applique"]
const WHEN = ["Matin, midi et soir", "Pendant le séjour", "Jour et nuit", "24 h/24"]
const inclus = policies.find((p) => p.id === "inclus")!

export default function ServicesPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Services"
        title={
          <>
            La maison <em className="display-italic text-brass-deep">s’occupe</em> de vous
          </>
        }
        intro="Un chef, du linge propre, un chauffeur, des agents de sécurité. Les services se demandent à la carte, sur place ou avant d’arriver."
      />

      {services.map((s, i) => {
        const p = photo(PHOTOS[i] ?? "escalier")
        const flip = i % 2 === 1
        const nom = s.nom.replace("Chauffeur", "chauffeur")
        return (
          <section key={s.id} data-theme="light" aria-labelledby={`s-${s.id}`} className={cn("py-[clamp(4rem,9vw,8rem)]", i % 2 ? "bg-paper-2" : "bg-paper")}>
            <div className="shell grid-12 items-center gap-y-12">
              <Figure
                photo={p}
                sizes="(min-width:1024px) 34vw, 80vw"
                parallax={12}
                className={cn(
                  "col-span-10 aspect-[4/5] md:col-span-6 lg:col-span-5",
                  flip ? "col-start-3 md:order-2 md:col-start-7 lg:col-start-8 shape-arch" : "rounded-none",
                )}
              />
              <div className={cn("col-span-12 md:col-span-6 lg:col-span-5", flip ? "md:order-1 lg:col-start-2" : "md:col-start-7 lg:col-start-7")}>
                <span className="display num text-big text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                <SplitReveal as="h2" id={`s-${s.id}`} className="display text-huge mt-6">
                  {nom}
                </SplitReveal>
                <p className="lede mt-8 text-ebony/80">{s.description}</p>
                <p className="mt-5 max-w-[46ch] text-ebony/65">{s.details}</p>
                <div className="mt-8 flex flex-wrap gap-2">
                  <Tag tone="sage" dot>
                    {WHEN[i]}
                  </Tag>
                  <Tag>Tarif {s.periode}, sur demande</Tag>
                </div>
                <div className="mt-10">
                  <Button href={wa(site.whatsapp, `Bonjour, je voudrais en savoir plus sur le service « ${nom} » de L.M. Résidence.`)} variant="outline" icon="whatsapp">
                    En parler sur WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )
      })}

      <section data-theme="dark" className="bg-ebony py-[clamp(5rem,11vw,10rem)] text-paper" aria-labelledby="t-inclus">
        <div className="shell grid-12 gap-y-12">
          <div className="col-span-12 lg:col-span-5">
            <Eyebrow n="05" tone="light">
              Sans supplément
            </Eyebrow>
            <h2 id="t-inclus" className="display text-huge mt-8">
              Toujours <em className="display-italic text-brass-light">compris</em>
            </h2>
          </div>
          <ol className="col-span-12 lg:col-span-6 lg:col-start-7">
            {inclus.lines.map((x, i) => (
              <li key={x} className="flex items-baseline gap-6 border-t border-paper/15 py-6 last:border-b">
                <span className="label num text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                <span className="serif-text text-2xl md:text-3xl">{x.replace(/\.$/, "")}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="shell mt-16 flex flex-wrap gap-3">
          <Button href="/reservation" variant="paper">
            Demander une réservation
          </Button>
          <Button href="/contact" variant="outline-light" icon="none">
            Un service sur mesure
          </Button>
        </div>
      </section>
    </>
  )
}
