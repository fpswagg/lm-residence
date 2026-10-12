import type { Metadata } from "next"
import { PageHead } from "@/components/kit/page-head"
import { GalleryWall, type GalleryFilter } from "@/components/kit/gallery-wall"
import { Button } from "@/components/kit/button"
import { logements } from "@/lib/logements"
import { photos } from "@/lib/photos"

export const metadata: Metadata = {
  title: "Galerie",
  description: "La maison en images: les studios Jean-Philippe, Alain-Christophe, Camilla, la chambre Marie, les espaces communs et les détails de L.M. Résidence.",
  alternates: { canonical: "/galerie" },
}

// Ordre du mur: les plus belles d'abord, en alternant maison et logements.
const wall = [...photos].sort((a, b) => b.note - a.note || (a.studio ? 1 : 0) - (b.studio ? 1 : 0))

const filters: GalleryFilter[] = [
  { id: "tout", label: "Tout" },
  { id: "maison", label: "La maison", rooms: ["exterieur", "entree", "espaces-communs"] },
  { id: "details", label: "Détails", rooms: ["details"] },
  ...logements.map((l) => ({ id: l.slug, label: l.court, studio: l.slug })),
]

export default function GaleriePage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Galerie"
        title={
          <>
            La maison, <em className="display-italic text-brass-deep">pièce par pièce</em>
          </>
        }
        intro="Le bois sculpté, la terre cuite, la lumière des lampes. Filtrez par logement, touchez une photo pour la voir en grand."
        className="pb-10 md:pb-14"
      />
      <section data-theme="light" className="bg-paper pb-[clamp(5rem,10vw,9rem)]" aria-label="Photos">
        <GalleryWall photos={wall} filters={filters} studios={Object.fromEntries(logements.map((l) => [l.slug, l.court]))} />
        <div className="shell mt-16 flex justify-end">
          <Button href="/logements" variant="link">
            Voir les logements
          </Button>
        </div>
      </section>
    </>
  )
}
