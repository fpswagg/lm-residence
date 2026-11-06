import Link from "next/link"
import { Bandeau, Pastille, Titre, Vide } from "@/components/dashboard/ui"
import { dashServices, fcfa, requireDash } from "@/lib/dashboard"

export default async function Services({ searchParams }: { searchParams: Promise<{ ajoute?: string; supprime?: string }> }) {
  const ctx = await requireDash()
  const sp = await searchParams
  const liste = await dashServices(ctx)
  return (
    <>
      <Titre titre="Services" action={ctx.canWrite ? { href: "/dashboard/services/nouveau", label: "Ajouter" } : undefined} />
      {sp.ajoute && <Bandeau>Service ajouté. Le site est à jour.</Bandeau>}
      {sp.supprime && <Bandeau>Service supprimé.</Bandeau>}
      {liste.length === 0 ? <Vide>Aucun service.</Vide> : (
        <div className="space-y-3">
          {liste.map((s) => (
            <Link key={s.id} href={`/dashboard/services/${s.id}`} className="block rounded-lg border border-border bg-card p-4 transition hover:border-primary">
              <div className="flex items-center justify-between gap-2">
                <h2 className="nom">{s.nom}</h2>
                <Pastille on={s.visible}>{s.visible ? "Visible" : "Caché"}</Pastille>
              </div>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{s.description}</p>
              {s.prix > 0 && <p className="mt-1 text-sm">{fcfa(s.prix)}{s.periode ? ` ${s.periode}` : ""}</p>}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
