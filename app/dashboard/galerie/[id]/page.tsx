import { notFound } from "next/navigation"
import { GalerieForm } from "@/components/dashboard/forms"
import { Carte, Titre } from "@/components/dashboard/ui"
import { dashBloc, requireDash, str } from "@/lib/dashboard"

export default async function PhotoGalerie({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requireDash()
  const { id } = await params
  const bloc = await dashBloc(ctx, "galerie")
  const entree = bloc?.entrees.find((e) => e.id === id)
  if (!bloc || !entree) notFound()
  const categories: string[] = (bloc.fields.find((f) => f.key === "categorie")?.options ?? []).map(String)
  return (
    <>
      <Titre titre={str(entree.data.titre) || "Photo"} />
      <Carte><GalerieForm key={entree.id} entree={entree} categories={categories} lectureSeule={!ctx.canWrite} /></Carte>
    </>
  )
}
