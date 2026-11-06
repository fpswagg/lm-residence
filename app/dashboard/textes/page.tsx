import { saveTexte } from "../actions"
import { ActionForm, Champ, inputClass } from "@/components/dashboard/form"
import { Titre, Vide } from "@/components/dashboard/ui"
import { dashBloc, requireDash, str, type Entree } from "@/lib/dashboard"

/** The site places each text by its "partie": grouped here by the page it appears on. */
const PAGES: [string, (p: string) => boolean][] = [
  ["Accueil", (p) => p.startsWith("Accueil") || p.startsWith("Atout")],
  ["Logements", (p) => p === "Page Logements"],
  ["Services", (p) => p.includes("Services")],
  ["Galerie", (p) => p.includes("Galerie")],
  ["À propos", (p) => p.includes("À propos") || p.startsWith("Valeur") || p === "Nos valeurs" || p === "Notre équipe"],
  ["Contact et réservation", (p) => p === "Page Contact" || p === "Page Réservation"],
  ["Politiques", (p) => p === "Page Politiques"],
  ["Bas de page", (p) => p === "Bas de page"],
  ["Recherche Google", (p) => p === "Référencement" || p === "Mots-clés"],
]

function Texte({ e, lectureSeule }: { e: Entree; lectureSeule: boolean }) {
  const d = e.data
  return (
    <details className="rounded-lg border border-border bg-card open:border-primary/60">
      <summary className="cursor-pointer select-none p-4">
        <span className="font-medium">{str(d.partie)}</span>
        <span className="block truncate text-sm text-muted-foreground">{str(d.titre) || str(d.texte)}</span>
      </summary>
      <div className="px-4 pb-4">
        <ActionForm action={saveTexte} lectureSeule={lectureSeule}>
          <input type="hidden" name="id" value={e.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Champ label="Titre"><input name="titre" defaultValue={str(d.titre)} className={inputClass} /></Champ>
            <Champ label="Sous-titre"><input name="sousTitre" defaultValue={str(d.sousTitre)} className={inputClass} /></Champ>
          </div>
          <Champ label="Texte"><textarea name="texte" rows={4} defaultValue={str(d.texte)} className={inputClass} /></Champ>
        </ActionForm>
      </div>
    </details>
  )
}

export default async function Textes() {
  const ctx = await requireDash()
  const bloc = await dashBloc(ctx, "textes")
  if (!bloc) return <Vide>Les textes du site n'existent plus dans SSS.</Vide>
  const pris = new Set<string>()
  const groupes = PAGES.map(([page, test]) => {
    const entrees = bloc.entrees.filter((e) => !pris.has(e.id) && test(str(e.data.partie)))
    entrees.forEach((e) => pris.add(e.id))
    return [page, entrees] as const
  })
  const autres = bloc.entrees.filter((e) => !pris.has(e.id))
  if (autres.length) groupes.push(["Autres", autres])

  return (
    <>
      <Titre titre="Textes" texte="Les titres et les textes de chaque page du site. Touche une ligne pour la modifier." />
      <div className="space-y-6">
        {groupes.filter(([, l]) => l.length).map(([page, entrees]) => (
          <section key={page}>
            <h2 className="mb-2 font-serif text-xl font-bold">{page}</h2>
            <div className="space-y-2">
              {entrees.map((e) => <Texte key={e.id} e={e} lectureSeule={!ctx.canWrite} />)}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
