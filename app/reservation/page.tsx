import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHead } from "@/components/kit/page-head"
import { ReservationFlow } from "@/components/forms/reservation-flow"
import { photo } from "@/lib/photos"

export const metadata: Metadata = {
  title: "Réserver",
  description: "Demandez une réservation à L.M. Résidence, Yaoundé: choisissez vos dates et votre logement, nous confirmons sous 24 heures.",
  alternates: { canonical: "/reservation" },
}

export default function ReservationPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Réservation"
        title={
          <>
            Votre <em className="display-italic text-brass-deep">séjour</em>, en quatre temps
          </>
        }
        intro="Des dates, un logement, vos coordonnées. Rien n’est débité: nous confirmons la disponibilité sous 24 heures."
        photo={photo("chambre-jp")}
        className="pb-10 md:pb-14"
      />
      <section data-theme="light" className="bg-paper pb-[clamp(5rem,10vw,9rem)]" aria-label="Formulaire de réservation">
        <div className="shell">
          <div className="mx-auto max-w-5xl">
            <Suspense fallback={<div className="min-h-[40rem]" />}>
              <ReservationFlow />
            </Suspense>
          </div>
        </div>
      </section>
    </>
  )
}
