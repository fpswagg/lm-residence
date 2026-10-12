import type { Metadata } from "next"
import { PageHead } from "@/components/kit/page-head"
import { Button, Eyebrow } from "@/components/kit/button"
import { Figure } from "@/components/motion/figure"
import { SplitReveal } from "@/components/motion/split-reveal"
import { photo } from "@/lib/photos"

export const metadata: Metadata = {
  title: "La maison",
  description: "L’histoire, les valeurs et l’équipe de L.M. Résidence, maison d’hôtes à Yaoundé: bois sculpté, accueil chaleureux, sécurité 24 h/24.",
  alternates: { canonical: "/a-propos" },
}

const values = [
  { t: "Excellence", d: "Nous recherchons l’excellence dans chaque détail, des matériaux aux services." },
  { t: "Hospitalité", d: "Un accueil chaleureux et sincère: c’est le cœur de la maison." },
  { t: "Qualité", d: "Literie, linge, équipements: seulement ce que nous voudrions chez nous." },
  { t: "Sécurité", d: "Agents DAK jour et nuit, pour que vous dormiez tranquille." },
]

export default function AboutPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="La maison"
        title={
          <>
            Une maison, <em className="display-italic text-brass-deep">pas un hôtel</em>
          </>
        }
        intro="L.M. Résidence est née d’une idée simple: offrir à Yaoundé un lieu où le confort artisanal rencontre l’exigence d’aujourd’hui."
        photo={photo("sculptures")}
      />

      <section data-theme="light" className="bg-paper py-[clamp(4rem,9vw,8rem)]" aria-labelledby="t-histoire">
        <div className="shell grid-12 items-center gap-y-12">
          <Figure photo={photo("salon-commun")} sizes="(min-width:1024px) 40vw, 90vw" className="col-span-12 aspect-[4/5] md:col-span-6 lg:col-span-5" />
          <div className="col-span-12 md:col-span-6 lg:col-span-5 lg:col-start-8">
            <Eyebrow n="02">Notre histoire</Eyebrow>
            <SplitReveal as="h2" id="t-histoire" className="display text-huge mt-8">
              Chaque détail, <em className="display-italic text-brass-deep">choisi</em>
            </SplitReveal>
            <div className="mt-8 space-y-5 text-ebony/75">
              <p className="lede text-ebony/85">Du bois sculpté aux carreaux de terre cuite, tout a été pensé pour votre bien-être.</p>
              <p>Depuis l’ouverture, nous nous engageons à offrir un hébergement de qualité supérieure: matériaux naturels et chaleureux, espaces aménagés avec soin, rien de superflu.</p>
              <p>Nos équipes travaillent chaque jour avec passion pour faire de votre séjour un moment à part, entre service personnalisé et attention aux moindres détails.</p>
            </div>
          </div>
        </div>
      </section>

      <section data-theme="dark" className="bg-ebony py-[clamp(5rem,11vw,10rem)] text-paper" aria-labelledby="t-valeurs">
        <div className="shell">
          <Eyebrow n="03" tone="light">Nos valeurs</Eyebrow>
          <h2 id="t-valeurs" className="display text-huge mt-8 max-w-[14ch]">
            Ce qui nous <em className="display-italic text-brass-light">tient</em>
          </h2>
          <ol className="mt-16 grid gap-x-10 md:grid-cols-2">
            {values.map((v, i) => (
              <li key={v.t} className="group/v border-t border-paper/15 py-10">
                <span className="label num text-brass-light">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display text-big mt-4 transition-transform duration-700 ease-expo group-hover/v:translate-x-3">{v.t}</h3>
                <p className="mt-4 max-w-[40ch] text-paper/65">{v.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-theme="light" className="bg-paper-2 py-[clamp(4rem,9vw,8rem)]" aria-labelledby="t-equipe">
        <div className="shell grid-12 items-center gap-y-12">
          <div className="col-span-12 md:order-1 md:col-span-6 lg:col-span-5 lg:col-start-2">
            <Eyebrow n="04">L’équipe</Eyebrow>
            <SplitReveal as="h2" id="t-equipe" className="display text-huge mt-8">
              Comme <em className="display-italic text-brass-deep">chez vous</em>
            </SplitReveal>
            <div className="mt-8 space-y-5 text-ebony/75">
              <p>Une équipe expérimentée, formée à l’hospitalité, attentive à vos besoins avant même que vous les formuliez.</p>
              <p>De la réception à l’entretien, en passant par la cuisine et le chauffeur, nous tenons à une atmosphère chaleureuse, où l’on se sent attendu.</p>
            </div>
          </div>
          <Figure photo={photo("accueil")} sizes="(min-width:1024px) 34vw, 80vw" className="col-span-10 col-start-3 aspect-[3/4] shape-arch md:order-2 md:col-span-5 md:col-start-8" />
        </div>
      </section>

      <section data-theme="light" className="bg-paper py-[clamp(5rem,10vw,9rem)]">
        <div className="shell flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-huge max-w-[12ch]">
            Venez <em className="display-italic text-brass-deep">voir</em>
          </h2>
          <div className="flex flex-wrap gap-3">
            <Button href="/reservation">Réserver</Button>
            <Button href="/contact" variant="outline" icon="none">Nous écrire</Button>
          </div>
        </div>
      </section>
    </>
  )
}
