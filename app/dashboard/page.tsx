import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Carte, Titre } from "@/components/dashboard/ui"
import { dashBloc, dashDemandes, dashLogements, dashServices, quand, requireDash } from "@/lib/dashboard"

export default async function Apercu() {
  const ctx = await requireDash()
  const [demandes, logements, services, galerie] = await Promise.all([dashDemandes(ctx), dashLogements(ctx), dashServices(ctx), dashBloc(ctx, "galerie")])
  const aTraiter = demandes.filter((d) => !d.traitee)
  const visibles = logements.filter((l) => l.visible)
  const sansPhoto = visibles.filter((l) => !l.photos.length)
  const prenom = (ctx.session.user.name || "").split(" ")[0]

  const chiffres = [
    { href: "/dashboard/demandes", n: aTraiter.length, label: "demandes à traiter", fort: aTraiter.length > 0 },
    { href: "/dashboard/logements", n: visibles.length, label: `logements visibles sur ${logements.length}` },
    { href: "/dashboard/services", n: services.filter((s) => s.visible).length, label: "services visibles" },
    { href: "/dashboard/galerie", n: galerie?.entrees.length ?? 0, label: "photos en galerie" },
  ]

  return (
    <>
      <Titre titre={prenom ? `Bonjour ${prenom}` : "Bonjour"} texte="Tout ce que tu changes ici apparaît sur le site et dans SSS." />
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {chiffres.map((c) => (
          <Link key={c.href} href={c.href} className={`rounded-lg border bg-card p-4 transition hover:border-primary ${c.fort ? "border-primary" : "border-border"}`}>
            <span className={`block font-serif text-3xl font-bold ${c.fort ? "text-primary" : ""}`}>{c.n}</span>
            <span className="text-sm text-muted-foreground">{c.label}</span>
          </Link>
        ))}
      </div>
      {sansPhoto.length > 0 && (
        <p className="mb-6 flex items-start gap-2 rounded-md border border-primary/50 p-3 text-sm">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-primary" />
          <span>Visibles sans photo : {sansPhoto.map((l) => l.nom).join(", ")}.</span>
        </p>
      )}
      <Carte>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">Dernières demandes</h2>
          <Link href="/dashboard/demandes" className="text-sm text-primary hover:underline">Tout voir</Link>
        </div>
        {demandes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune demande pour l'instant.</p>
        ) : (
          <ul className="divide-y divide-border">
            {demandes.slice(0, 5).map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <span className="min-w-0">
                  <span className="block truncate font-medium">{d.nom}</span>
                  <span className="block truncate text-muted-foreground">{d.reservation ? `Réservation : ${d.logement}` : d.message}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{quand(d.at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Carte>
    </>
  )
}
