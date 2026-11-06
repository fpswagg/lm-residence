import { saveContacts, saveHistoire, saveHoraires } from "../actions"
import { ActionForm, Champ, inputClass } from "@/components/dashboard/form"
import { Carte, Titre } from "@/components/dashboard/ui"
import { api, dashProfil, requireDash, str } from "@/lib/dashboard"

const JOURS = [["mon", "Lundi"], ["tue", "Mardi"], ["wed", "Mercredi"], ["thu", "Jeudi"], ["fri", "Vendredi"], ["sat", "Samedi"], ["sun", "Dimanche"]]

export default async function Residence() {
  const ctx = await requireDash()
  const lectureSeule = !ctx.canWrite
  const [store, vitrine, profil] = await Promise.all([api(ctx, ""), api(ctx, "/showcase"), dashProfil(ctx)])
  const socials = vitrine?.design?.socials ?? {}
  const jours = profil?.hours?.days ?? {}
  return (
    <>
      <Titre titre="Résidence" texte="Les contacts, les horaires et l'histoire affichés sur le site." />
      <div className="space-y-4">
        <Carte>
          <h2 className="mb-3 font-serif text-xl font-bold">Contacts et réseaux</h2>
          <ActionForm action={saveContacts} lectureSeule={lectureSeule}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Champ label="Téléphone"><input name="phone" type="tel" defaultValue={str(store?.phone)} className={inputClass} /></Champ>
              <Champ label="WhatsApp"><input name="whatsapp" type="tel" defaultValue={str(store?.whatsapp)} className={inputClass} /></Champ>
              <Champ label="Email"><input name="email" type="email" defaultValue={str(store?.email)} className={inputClass} /></Champ>
              <Champ label="Adresse"><input name="address" defaultValue={str(store?.address)} className={inputClass} /></Champ>
              <Champ label="Facebook"><input name="facebook" defaultValue={str(socials.facebook)} className={inputClass} /></Champ>
              <Champ label="Instagram"><input name="instagram" defaultValue={str(socials.instagram)} className={inputClass} /></Champ>
              <Champ label="X (Twitter)"><input name="twitter" defaultValue={str(socials.x)} className={inputClass} /></Champ>
            </div>
          </ActionForm>
        </Carte>
        <Carte>
          <h2 className="mb-1 font-serif text-xl font-bold">Horaires d'accueil</h2>
          <p className="mb-3 text-sm text-muted-foreground">Laisse les deux heures vides si c'est fermé ce jour-là.</p>
          <ActionForm action={saveHoraires} lectureSeule={lectureSeule}>
            <div className="space-y-2">
              {JOURS.map(([k, nom]) => (
                <div key={k} className="grid grid-cols-[84px_1fr_1fr] items-center gap-2">
                  <span className="text-sm">{nom}</span>
                  <input type="time" name={`${k}-de`} aria-label={`${nom}, ouverture`} defaultValue={str(jours[k]?.[0]?.from)} className={inputClass} />
                  <input type="time" name={`${k}-a`} aria-label={`${nom}, fermeture`} defaultValue={str(jours[k]?.[0]?.to)} className={inputClass} />
                </div>
              ))}
            </div>
          </ActionForm>
        </Carte>
        <Carte>
          <h2 className="mb-3 font-serif text-xl font-bold">Notre histoire</h2>
          <ActionForm action={saveHistoire} lectureSeule={lectureSeule}>
            <Champ label="Texte de la page À propos" aide="Laisse une ligne vide entre deux paragraphes."><textarea name="histoire" rows={8} defaultValue={str(vitrine?.aboutMarkdown)} className={inputClass} /></Champ>
          </ActionForm>
        </Carte>
      </div>
    </>
  )
}
