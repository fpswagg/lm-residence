import Link from "next/link"
import { Mail, MessageCircle, Phone } from "lucide-react"
import { setTraitee } from "../actions"
import { Carte, Pastille, Titre, Vide } from "@/components/dashboard/ui"
import { dashDemandes, quand, requireDash, waLink } from "@/lib/dashboard"

const lienBouton = "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:border-primary"

export default async function Demandes({ searchParams }: { searchParams: Promise<{ vue?: string }> }) {
  const ctx = await requireDash()
  const traitees = (await searchParams).vue === "traitees"
  const toutes = await dashDemandes(ctx)
  const liste = toutes.filter((d) => d.traitee === traitees)
  const nbTraitees = toutes.filter((d) => d.traitee).length

  return (
    <>
      <Titre titre="Demandes" texte="Les réservations et les messages envoyés depuis le site ou au concierge." />
      <div className="mb-4 flex gap-2 text-sm">
        <Link href="/dashboard/demandes" className={`rounded-full px-4 py-2 ${!traitees ? "bg-primary font-semibold text-primary-foreground" : "bg-muted"}`}>À traiter ({toutes.length - nbTraitees})</Link>
        <Link href="/dashboard/demandes?vue=traitees" className={`rounded-full px-4 py-2 ${traitees ? "bg-primary font-semibold text-primary-foreground" : "bg-muted"}`}>Traitées ({nbTraitees})</Link>
      </div>
      {liste.length === 0 ? (
        <Vide>{traitees ? "Aucune demande traitée." : "Rien à traiter. Tout est à jour."}</Vide>
      ) : (
        <div className="space-y-3">
          {liste.map((d) => {
            const wa = d.telephone ? waLink(d.telephone, `Bonjour ${d.nom}, L.M. Résidence vous répond.`) : null
            return (
              <Carte key={d.id}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="nom">{d.nom}</h2>
                    <p className="text-xs text-muted-foreground">{quand(d.at)}</p>
                  </div>
                  <Pastille on={d.reservation}>{d.reservation ? "Réservation" : "Message"}</Pastille>
                </div>
                {d.reservation && (
                  <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
                    {[["Logement", d.logement], ["Arrivée", d.arrivee], ["Départ", d.depart], ["Personnes", d.personnes]].map(([k, v]) => (
                      <div key={k}><dt className="text-xs text-muted-foreground">{k}</dt><dd>{v || "—"}</dd></div>
                    ))}
                  </dl>
                )}
                {d.message && <p className="mt-3 whitespace-pre-line text-sm">{d.message}</p>}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {wa && <a href={wa} target="_blank" rel="noreferrer" className={lienBouton}><MessageCircle className="size-4" /> WhatsApp</a>}
                  {d.telephone && <a href={`tel:${d.telephone}`} className={lienBouton}><Phone className="size-4" /> {d.telephone}</a>}
                  {d.email && <a href={`mailto:${d.email}`} className={lienBouton}><Mail className="size-4" /> Email</a>}
                  {ctx.canWrite && (
                    <form action={setTraitee} className="ml-auto">
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="traitee" value={String(!d.traitee)} />
                      <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">{d.traitee ? "Remettre à traiter" : "Marquer comme traitée"}</button>
                    </form>
                  )}
                </div>
              </Carte>
            )
          })}
        </div>
      )}
    </>
  )
}
