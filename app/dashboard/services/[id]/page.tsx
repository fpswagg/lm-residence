import { notFound } from "next/navigation"
import { ServiceForm } from "@/components/dashboard/forms"
import { Carte, Titre } from "@/components/dashboard/ui"
import { dashService, requireDash } from "@/lib/dashboard"

export default async function Service({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireDash()
  const service = await dashService(ctx, (await params).id)
  if (!service) notFound()
  return (
    <>
      <Titre titre={service.nom} />
      <Carte><ServiceForm key={service.id} service={service} lectureSeule={!ctx.canWrite} /></Carte>
    </>
  )
}
