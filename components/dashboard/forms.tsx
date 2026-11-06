import type { ReactNode } from "react"
import Link from "next/link"
import { deleteLogement, deletePhotoGalerie, deleteService, saveLogement, savePhotoGalerie, saveService } from "@/app/dashboard/actions"
import { ActionForm, BoutonConfirme, Champ, inputClass } from "./form"
import { PhotosField } from "./photos-field"
import type { DashLogement, DashService, Entree } from "@/lib/dashboard"
import { str } from "@/lib/dashboard"

const Retour = ({ href, children }: { href: string; children: ReactNode }) => (
  <Link href={href} className="px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground">{children}</Link>
)

const Visible = ({ on, aide }: { on: boolean; aide: string }) => (
  <label className="flex items-start gap-3 rounded-md border border-border p-3">
    <input type="checkbox" name="visible" defaultChecked={on} className="mt-0.5 size-5 accent-[#cd9a51]" />
    <span>
      <span className="block text-sm font-medium">Visible sur le site</span>
      <span className="block text-xs text-muted-foreground">{aide}</span>
    </span>
  </label>
)

export function LogementForm({ logement, lectureSeule }: { logement?: DashLogement; lectureSeule: boolean }) {
  const l = logement
  return (
    <ActionForm
      action={saveLogement}
      lectureSeule={lectureSeule}
      bouton={l ? "Enregistrer" : "Ajouter le logement"}
      autres={
        <>
          <Retour href="/dashboard/logements">Retour</Retour>
          {l && <span className="ml-auto"><BoutonConfirme action={deleteLogement} id={l.id} lectureSeule={lectureSeule} texte="Supprimer" question={`Supprimer « ${l.nom} » ? Il disparaîtra du site et de SSS.`} /></span>}
        </>
      }
    >
      {l && <input type="hidden" name="id" value={l.id} />}
      <Champ label="Photos" aide="La première photo est celle qu'on voit en premier sur le site.">
        <PhotosField initial={l?.photos} />
      </Champ>
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Nom"><input name="nom" required defaultValue={l?.nom} className={inputClass} /></Champ>
        <Champ label="Type">
          <select name="categorie" defaultValue={l?.categorie ?? "Studio"} className={inputClass}>
            <option>Studio</option>
            <option>Chambre</option>
          </select>
        </Champ>
        <Champ label="Prix par nuit (FCFA)"><input name="prix" required inputMode="numeric" defaultValue={l?.prix ?? ""} className={inputClass} /></Champ>
        <Champ label="Nombre de personnes"><input name="capacite" inputMode="numeric" defaultValue={l?.capacite} className={inputClass} /></Champ>
        <Champ label="Surface" aide="Par exemple : 45 m²"><input name="surface" defaultValue={l?.surface} className={inputClass} /></Champ>
        <Champ label="Position" aide="1 s'affiche en premier."><input name="ordre" inputMode="numeric" defaultValue={l ? l.ordre : ""} className={inputClass} /></Champ>
      </div>
      <Champ label="Description"><textarea name="description" rows={4} defaultValue={l?.description} className={inputClass} /></Champ>
      <Champ label="Équipements" aide="Séparés par des virgules : Wi-Fi, Climatisation, Cuisine"><textarea name="equipements" rows={2} defaultValue={l?.equipements} className={inputClass} /></Champ>
      <Visible on={l?.visible ?? true} aide="Décoche pour le cacher : il reste enregistré, mais les visiteurs ne le voient plus et ne peuvent plus le réserver." />
    </ActionForm>
  )
}

export function ServiceForm({ service, lectureSeule }: { service?: DashService; lectureSeule: boolean }) {
  const s = service
  return (
    <ActionForm
      action={saveService}
      lectureSeule={lectureSeule}
      bouton={s ? "Enregistrer" : "Ajouter le service"}
      autres={
        <>
          <Retour href="/dashboard/services">Retour</Retour>
          {s && <span className="ml-auto"><BoutonConfirme action={deleteService} id={s.id} lectureSeule={lectureSeule} texte="Supprimer" question={`Supprimer « ${s.nom} » ? Il disparaîtra du site et de SSS.`} /></span>}
        </>
      }
    >
      {s && <input type="hidden" name="id" value={s.id} />}
      <Champ label="Nom"><input name="nom" required defaultValue={s?.nom} className={inputClass} /></Champ>
      <Champ label="Description"><textarea name="description" rows={3} defaultValue={s?.description} className={inputClass} /></Champ>
      <Champ label="Détails"><textarea name="details" rows={3} defaultValue={s?.details} className={inputClass} /></Champ>
      <div className="grid gap-4 sm:grid-cols-3">
        <Champ label="Prix (FCFA)" aide="Pas affiché sur le site, mais le concierge peut l'annoncer aux clients."><input name="prix" inputMode="numeric" defaultValue={s?.prix || ""} className={inputClass} /></Champ>
        <Champ label="Période" aide="Par exemple : par jour"><input name="periode" defaultValue={s?.periode} className={inputClass} /></Champ>
        <Champ label="Position" aide="1 s'affiche en premier."><input name="ordre" inputMode="numeric" defaultValue={s ? s.ordre : ""} className={inputClass} /></Champ>
      </div>
      <Visible on={s?.visible ?? true} aide="Décoche pour le cacher sans le supprimer." />
    </ActionForm>
  )
}

export function GalerieForm({ entree, categories, lectureSeule }: { entree?: Entree; categories: string[]; lectureSeule: boolean }) {
  const d = entree?.data
  const url = str(d?.photo)
  return (
    <ActionForm
      action={savePhotoGalerie}
      lectureSeule={lectureSeule}
      bouton={entree ? "Enregistrer" : "Ajouter à la galerie"}
      autres={
        <>
          <Retour href="/dashboard/galerie">Retour</Retour>
          {entree && <span className="ml-auto"><BoutonConfirme action={deletePhotoGalerie} id={entree.id} lectureSeule={lectureSeule} texte="Retirer" question="Retirer cette photo de la galerie du site ?" /></span>}
        </>
      }
    >
      {entree && <input type="hidden" name="id" value={entree.id} />}
      <Champ label="Photo"><PhotosField max={1} initial={url ? [{ url, key: "", alt: str(d?.titre) }] : []} /></Champ>
      <div className="grid gap-4 sm:grid-cols-2">
        <Champ label="Titre"><input name="titre" required defaultValue={str(d?.titre)} className={inputClass} /></Champ>
        <Champ label="Catégorie">
          <select name="categorie" defaultValue={str(d?.categorie) || categories[0]} className={inputClass}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Champ>
      </div>
      <Champ label="Description"><textarea name="description" rows={2} defaultValue={str(d?.description)} className={inputClass} /></Champ>
      <Champ label="Position" aide="1 s'affiche en premier."><input name="position" inputMode="numeric" defaultValue={str(d?.position)} className={`${inputClass} max-w-32`} /></Champ>
    </ActionForm>
  )
}
