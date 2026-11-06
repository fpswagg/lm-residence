import { notFound } from "next/navigation"
import { LogementForm } from "@/components/dashboard/forms"
import { Carte, Titre } from "@/components/dashboard/ui"
import { dashLogement, requireDash } from "@/lib/dashboard"

export default async function Logement({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireDash()
  const logement = await dashLogement(ctx, (await params).id)
  if (!logement) notFound()
  return (
    <>
      <Titre titre={logement.nom} />
      <Carte><LogementForm key={logement.id} logement={logement} lectureSeule={!ctx.canWrite} /></Carte>
    </>
  )
}
