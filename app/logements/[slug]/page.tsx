import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Slideshow } from "@/components/kit/slideshow"
import { Rail } from "@/components/kit/rail"
import { RoomCard } from "@/components/kit/room-card"
import { Accordion } from "@/components/kit/accordion"
import { Button, Eyebrow, Tag } from "@/components/kit/button"
import { SplitReveal } from "@/components/motion/split-reveal"
import { TLink } from "@/components/site/transition"
import { fcfa, logement, logements } from "@/lib/logements"
import { policies } from "@/lib/policies"
import { showPrices, site, wa } from "@/lib/site"

type Params = Promise<{ slug: string }>

export function generateStaticParams() {
  return logements.map((l) => ({ slug: l.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const l = logement((await params).slug)
  if (!l) return {}
  const p = l.photos[0]!
  return {
    title: l.nom,
    description: `${l.nom}, ${l.surface}, pour ${l.capacite} personnes à L.M. Résidence, Yaoundé. ${l.accroche}`,
    alternates: { canonical: `/logements/${l.slug}` },
    openGraph: { images: [{ url: p.src, width: p.width, height: p.height, alt: p.alt }] },
  }
}

export default async function LogementPage({ params }: { params: Params }) {
  const l = logement((await params).slug)
  if (!l) notFound()
  const n = logements.indexOf(l) + 1
  const others = logements.filter((o) => o.slug !== l.slug)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    name: `${l.nom} — ${site.name}`,
    description: l.description,
    floorSize: { "@type": "QuantitativeValue", value: parseInt(l.surface), unitCode: "MTK" },
    occupancy: { "@type": "QuantitativeValue", maxValue: l.capacite },
    amenityFeature: l.equipements.map((e) => ({ "@type": "LocationFeatureSpecification", name: e, value: true })),
    image: l.photos.slice(0, 4).map((p) => `${site.url}${p.src}`),
    containedInPlace: { "@type": "LodgingBusiness", name: site.longName, address: `${site.address}, ${site.city}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section data-theme="light" className="bg-paper pt-[calc(var(--header-h)+clamp(2.5rem,8vh,5rem))]">
        <div className="shell">
          <nav aria-label="Fil d’Ariane" className="label flex items-center gap-3 text-ebony/50">
            <TLink href="/logements" className="link-line">
              Logements
            </TLink>
            <span aria-hidden>/</span>
            <span className="num text-brass-deep" aria-current="page">
              {String(n).padStart(2, "0")} · {l.court}
            </span>
          </nav>
          <div className="mt-8 grid-12 items-end gap-y-8">
            <SplitReveal as="h1" on="gate" className="display text-giant col-span-12 lg:col-span-8">
              {l.type === "chambre" ? "Chambre" : "Studio"} <em className="display-italic text-brass-deep">{l.court}</em>
            </SplitReveal>
            <div className="col-span-12 lg:col-span-4">
              <SplitReveal on="gate" delay={0.2} className="lede text-ebony/80">
                {l.accroche}
              </SplitReveal>
            </div>
          </div>
        </div>

        <div className="shell mt-12 md:mt-16">
          <Slideshow photos={l.photos} label={l.nom} priority sizes="(min-width:768px) 92vw, 100vw" frameClassName="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/8]" />
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-[clamp(5rem,10vw,9rem)]" aria-labelledby="t-logement">
        <div className="shell grid-12 gap-y-14">
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow n="01">Le logement</Eyebrow>
            <dl className="mt-10 grid grid-cols-3 border-y border-ebony/15 py-5 lg:grid-cols-1 lg:gap-6 lg:border-y-0 lg:py-0">
              {[
                ["Surface", l.surface],
                ["Pour", `${l.capacite} personne${l.capacite > 1 ? "s" : ""}`],
                ["La nuit", showPrices ? fcfa(l.prix) : "Sur demande"],
              ].map(([k, v]) => (
                <div key={k} className="lg:border-t lg:border-ebony/15 lg:pt-4">
                  <dt className="label text-ebony/50">{k}</dt>
                  <dd className="serif-text num mt-1 text-xl lg:text-3xl">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <SplitReveal as="p" id="t-logement" by="words" className="serif-text text-mid leading-[1.15]">
              {l.description}
            </SplitReveal>
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Points forts">
              {l.highlights.map((h) => (
                <li key={h}>
                  <Tag tone="brass" dot>
                    {h}
                  </Tag>
                </li>
              ))}
            </ul>
            <h2 className="label mt-16 text-ebony/55">Équipements</h2>
            <ul className="mt-4 grid border-t border-ebony/15 sm:grid-cols-2 sm:gap-x-10">
              {l.equipements.map((e, i) => (
                <li key={e} className="flex items-baseline gap-4 border-b border-ebony/15 py-4">
                  <span className="label num text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[1.05rem]">{e}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section data-theme="light" className="bg-paper-2 py-[clamp(5rem,10vw,9rem)]" aria-labelledby="t-pratique">
        <div className="shell grid-12 gap-y-10">
          <div className="col-span-12 lg:col-span-4">
            <Eyebrow n="02">Bon à savoir</Eyebrow>
            <h2 id="t-pratique" className="display text-big mt-8">
              Avant <em className="display-italic text-brass-deep">d’arriver</em>
            </h2>
          </div>
          <Accordion
            className="col-span-12 lg:col-span-7 lg:col-start-6"
            single
            defaultOpen={0}
            items={policies.map((p) => ({
              title: p.title,
              meta: p.meta,
              content: (
                <ul className="space-y-2">
                  {p.lines.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              ),
            }))}
          />
        </div>
      </section>

      <section data-theme="dark" className="bg-ebony py-[clamp(5rem,11vw,10rem)] text-paper">
        <div className="shell grid-12 items-end gap-y-10">
          <div className="col-span-12 lg:col-span-8">
            <Eyebrow n="03" tone="light">
              Réserver
            </Eyebrow>
            <p className="display text-huge mt-8">
              {l.court}, <em className="display-italic text-brass-light">à vous.</em>
            </p>
          </div>
          <div className="col-span-12 flex flex-col items-start gap-6 lg:col-span-4 lg:items-end">
            {showPrices && (
              <p className="serif-text num text-2xl text-paper/85">
                {fcfa(l.prix)} <span className="label text-paper/50">la nuit</span>
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Button href={`/reservation?logement=${l.slug}`} variant="paper">
                Demander ces dates
              </Button>
              <Button href={wa(site.whatsapp, `Bonjour, je suis intéressé(e) par le ${l.nom} à L.M. Résidence.`)} variant="outline-light" icon="whatsapp">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-[clamp(5rem,10vw,9rem)]" aria-labelledby="t-autres">
        <Rail
          label="Les autres logements"
          head={
            <div>
              <Eyebrow n="04">Les autres portes</Eyebrow>
              <h2 id="t-autres" className="display text-big mt-6">
                Voir <em className="display-italic text-brass-deep">ailleurs</em>
              </h2>
            </div>
          }
          itemClassName="w-[78vw] sm:w-[44vw] lg:w-[29vw]"
        >
          {others.map((o) => (
            <RoomCard key={o.slug} room={o} n={logements.indexOf(o) + 1} arch={logements.indexOf(o) % 2 === 1} />
          ))}
        </Rail>
      </section>
    </>
  )
}
