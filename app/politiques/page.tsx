"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useSite, useTextes } from "@/components/site-provider"
import type { Regle } from "@/lib/site-types"

/** "Check-in: À partir de 14h00" shows its label in bold, and the other lines of such a section are notes. Other sections are bullet lists. */
const LIBELLE = /^([^:]{2,24}):\s+(.+)$/

function Section({ titre, lignes }: Regle) {
  const aLibelles = lignes.some((l) => LIBELLE.test(l))
  return (
    <div className="bg-cream rounded-lg p-8 border border-border">
      <h2 className="text-2xl font-serif font-bold text-primary mb-4">{titre}</h2>
      <div className="space-y-3 text-foreground/80">
        {lignes.map((ligne, i) => {
          const m = ligne.match(LIBELLE)
          if (!aLibelles) return <p key={i}>• {ligne}</p>
          if (!m) return <p key={i} className="text-sm">{ligne}</p>
          return <p key={i}><strong>{m[1]}:</strong> {m[2]}</p>
        })}
      </div>
    </div>
  )
}

export default function PoliciesPage() {
  const { regles, annulation, inclus } = useSite()
  const page = useTextes()("Page Politiques")
  const [premiere, ...suite] = regles

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">{page.titre}</h1>
            <p className="text-lg opacity-90">{page.texte}</p>
          </div>
        </section>

        {/* Policies Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {premiere && <Section {...premiere} />}
              <Section titre="Politique d'Annulation" lignes={annulation} />
              {suite.map((r) => <Section key={r.titre} {...r} />)}
              <Section titre="Services Inclus" lignes={inclus} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
