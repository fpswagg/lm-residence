import { GalerieForm } from "@/components/dashboard/forms"
import { Carte, Titre, Vide } from "@/components/dashboard/ui"
import { dashBloc, requireDash } from "@/lib/dashboard"

export default async function Nouveau() {
  const ctx = await requireDash()
  const bloc = await dashBloc(ctx, "galerie")
  if (!bloc) return <Vide>La galerie n'existe plus dans SSS.</Vide>
  const categories: string[] = (bloc.fields.find((f) => f.key === "categorie")?.options ?? []).map(String)
  return (
    <>
      <Titre titre="Nouvelle photo" />
      <Carte><GalerieForm categories={categories} lectureSeule={!ctx.canWrite} /></Carte>
    </>
  )
}
