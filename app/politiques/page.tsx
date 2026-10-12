import type { Metadata } from "next"
import { PageHead } from "@/components/kit/page-head"
import { Accordion } from "@/components/kit/accordion"
import { Button } from "@/components/kit/button"
import { policies } from "@/lib/policies"

export const metadata: Metadata = {
  title: "Conditions de séjour",
  description: "Horaires d’arrivée et de départ, annulation, paiement et règles de la maison à L.M. Résidence, Yaoundé.",
  alternates: { canonical: "/politiques" },
}

export default function PolitiquesPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Conditions"
        title={
          <>
            Les règles <em className="display-italic text-brass-deep">simples</em> de la maison
          </>
        }
        intro="Pour que tout le monde y soit bien. Une question sur un cas particulier ? Écrivez-nous, on trouve toujours un arrangement."
        className="pb-10 md:pb-14"
      />
      <section data-theme="light" className="bg-paper pb-[clamp(5rem,10vw,9rem)]" aria-label="Conditions de séjour">
        <div className="shell grid-12 gap-y-12">
          <nav aria-label="Sommaire" className="col-span-12 lg:col-span-3">
            <ol className="space-y-3 lg:sticky lg:top-32">
              {policies.map((p, i) => (
                <li key={p.id} className="label num text-ebony/55">
                  <span className="mr-3 text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                  {p.title}
                </li>
              ))}
            </ol>
          </nav>
          <Accordion
            className="col-span-12 lg:col-span-8 lg:col-start-5"
            numbered
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
        <div className="shell mt-16 flex flex-wrap gap-3">
          <Button href="/reservation">Demander une réservation</Button>
          <Button href="/contact" variant="outline" icon="none">Une question</Button>
        </div>
      </section>
    </>
  )
}
