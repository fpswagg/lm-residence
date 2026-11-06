import Link from "next/link"
import { Bandeau, Titre, Vide } from "@/components/dashboard/ui"
import { dashBloc, requireDash, str } from "@/lib/dashboard"

export default async function Galerie({ searchParams }: { searchParams: Promise<{ ajoute?: string; supprime?: string }> }) {
  const ctx = await requireDash()
  const sp = await searchParams
  const bloc = await dashBloc(ctx, "galerie")
  const photos = bloc?.entrees ?? []
  const plein = photos.length >= 60
  return (
    <>
      <Titre titre="Galerie" texte={plein ? "60 photos, c'est le maximum : retires-en une pour en ajouter une autre." : "Les photos de la page Galerie du site."} action={ctx.canWrite && !plein ? { href: "/dashboard/galerie/nouveau", label: "Ajouter" } : undefined} />
      {sp.ajoute && <Bandeau>Photo ajoutée. Le site est à jour.</Bandeau>}
      {sp.supprime && <Bandeau>Photo retirée de la galerie.</Bandeau>}
      {photos.length === 0 ? <Vide>Aucune photo.</Vide> : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <Link key={p.id} href={`/dashboard/galerie/${p.id}`} className="group overflow-hidden rounded-lg border border-border bg-card transition hover:border-primary">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={str(p.data.photo)} alt={str(p.data.titre)} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <span className="block p-2.5">
                <span className="block truncate text-sm font-medium">{str(p.data.titre)}</span>
                <span className="block truncate text-xs text-muted-foreground">{str(p.data.categorie)}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
