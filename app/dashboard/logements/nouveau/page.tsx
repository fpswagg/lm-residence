import { LogementForm } from "@/components/dashboard/forms"
import { Carte, Titre } from "@/components/dashboard/ui"
import { requireDash } from "@/lib/dashboard"

export default async function Nouveau() {
  const ctx = await requireDash()
  return (
    <>
      <Titre titre="Nouveau logement" />
      <Carte><LogementForm lectureSeule={!ctx.canWrite} /></Carte>
    </>
  )
}
