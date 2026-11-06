import { deleteRegle, saveRegle, saveSejour } from "../actions"
import { ActionForm, BoutonConfirme, Champ, inputClass } from "@/components/dashboard/form"
import { Carte, Titre } from "@/components/dashboard/ui"
import { dashBloc, dashProfil, requireDash, str } from "@/lib/dashboard"

const AIDE = "Une consigne par ligne."

export default async function Sejour() {
  const ctx = await requireDash()
  const lectureSeule = !ctx.canWrite
  const [bloc, profil] = await Promise.all([dashBloc(ctx, "regles"), dashProfil(ctx)])
  const regles = bloc?.entrees ?? []
  return (
    <>
      <Titre titre="Séjour" texte="Ce qui s'affiche sur la page Politiques du site." />
      <div className="space-y-4">
        <Carte>
          <ActionForm action={saveSejour} lectureSeule={lectureSeule}>
            <Champ label="Annulation" aide={AIDE}><textarea name="annulation" rows={4} defaultValue={str(profil?.policies?.cancellation)} className={inputClass} /></Champ>
            <Champ label="Inclus dans le séjour" aide="Un élément par ligne."><textarea name="inclus" rows={5} defaultValue={(profil?.amenities ?? []).join("\n")} className={inputClass} /></Champ>
          </ActionForm>
        </Carte>
        <h2 className="pt-2 font-serif text-xl font-bold">Règles</h2>
        {regles.map((r) => (
          <Carte key={r.id}>
            <ActionForm
              action={saveRegle}
              lectureSeule={lectureSeule}
              autres={<span className="ml-auto"><BoutonConfirme action={deleteRegle} id={r.id} lectureSeule={lectureSeule} texte="Supprimer" question={`Supprimer la règle « ${str(r.data.titre)} » ?`} /></span>}
            >
              <input type="hidden" name="id" value={r.id} />
              <Champ label="Titre"><input name="titre" required defaultValue={str(r.data.titre)} className={inputClass} /></Champ>
              <Champ label="Consignes" aide={AIDE}><textarea name="texte" rows={4} required defaultValue={str(r.data.texte)} className={inputClass} /></Champ>
            </ActionForm>
          </Carte>
        ))}
        <Carte>
          <h3 className="mb-3 font-medium">Ajouter une règle</h3>
          <ActionForm key={regles.length} action={saveRegle} bouton="Ajouter" lectureSeule={lectureSeule}>
            <Champ label="Titre"><input name="titre" required className={inputClass} /></Champ>
            <Champ label="Consignes" aide={AIDE}><textarea name="texte" rows={3} required className={inputClass} /></Champ>
          </ActionForm>
        </Carte>
      </div>
    </>
  )
}
