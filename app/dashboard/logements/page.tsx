import Link from "next/link"
import { setLogementVisible } from "../actions"
import { Bandeau, Pastille, Titre, Vide } from "@/components/dashboard/ui"
import { dashLogements, fcfa, requireDash } from "@/lib/dashboard"

export default async function Logements({ searchParams }: { searchParams: Promise<{ ajoute?: string; supprime?: string }> }) {
  const ctx = await requireDash()
  const sp = await searchParams
  const liste = await dashLogements(ctx)
  return (
    <>
      <Titre titre="Logements" action={ctx.canWrite ? { href: "/dashboard/logements/nouveau", label: "Ajouter" } : undefined} />
      {sp.ajoute && <Bandeau>Logement ajouté. Le site est à jour.</Bandeau>}
      {sp.supprime && <Bandeau>Logement supprimé.</Bandeau>}
      {liste.length === 0 ? <Vide>Aucun logement.</Vide> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {liste.map((l) => (
            <div key={l.id} className="flex gap-3 rounded-lg border border-border bg-card p-3">
              <Link href={`/dashboard/logements/${l.id}`} className="size-24 shrink-0 overflow-hidden rounded-md bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {l.photos[0] ? <img src={l.photos[0].url} alt="" loading="lazy" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-xs text-muted-foreground">Sans photo</span>}
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <Link href={`/dashboard/logements/${l.id}`} className="truncate font-medium hover:text-primary">{l.nom}</Link>
                <span className="text-sm text-muted-foreground">{l.categorie} · {fcfa(l.prix)} / nuit</span>
                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <Pastille on={l.visible}>{l.visible ? "Visible" : "Caché"}</Pastille>
                  {ctx.canWrite && (
                    <form action={setLogementVisible}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="visible" value={String(!l.visible)} />
                      <button className="text-sm text-primary hover:underline">{l.visible ? "Cacher" : "Afficher"}</button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
