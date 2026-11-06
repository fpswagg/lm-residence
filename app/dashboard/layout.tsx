import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { ErreurClient } from "@/components/dashboard/erreur-connexion"
import { DashNav } from "@/components/dashboard/nav"
import { config } from "@/lib/config"
import { dashState } from "@/lib/dashboard"
import { authProblem } from "@/lib/sss-auth"
import logo from "@/public/logo.png"
import "./dashboard.css"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Tableau de bord | L.M. Résidence", robots: { index: false, follow: false } }

const ERREURS: Record<string, string> = {
  access_denied: "La connexion a été annulée.",
  expired: "La connexion a pris trop de temps. Réessaie.",
  bad_state: "Ce lien de connexion n'est plus valable. Réessaie.",
}

function Ecran({ children }: { children: ReactNode }) {
  return (
    <main className="dash flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6 text-center sm:p-8">
        <Image src={logo} alt="" width={56} height={56} className="mx-auto mb-4 size-14 object-contain" />
        {children}
        <Link href="/" className="mt-5 inline-block text-sm text-muted-foreground hover:text-foreground">Retour au site</Link>
      </div>
    </main>
  )
}

const BoutonSortie = ({ children, className }: { children: ReactNode; className: string }) => (
  <form action="/auth/sss/sign-out" method="post"><button className={className}>{children}</button></form>
)

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const state = await dashState()

  if (state.kind === "signed_out") {
    return (
      <Ecran>
        <h1 className="font-serif text-2xl font-bold">Espace équipe</h1>
        <p className="mb-5 mt-2 text-sm text-muted-foreground">Connecte-toi avec ton compte SSS pour gérer les logements, les services, les photos et les demandes reçues.</p>
        <ErreurClient messages={ERREURS} />
        {authProblem() ? (
          <p className="rounded-md border border-red-400/40 bg-red-950/50 p-3 text-sm text-red-200">La connexion SSS n'est pas encore activée sur ce site.</p>
        ) : (
          <a href="/auth/sss?next=/dashboard" className="block rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Continuer avec SSS</a>
        )}
      </Ecran>
    )
  }

  if (state.kind === "wrong_business") {
    const u = state.session.user
    return (
      <Ecran>
        <h1 className="font-serif text-2xl font-bold">Accès refusé</h1>
        <p className="mb-5 mt-2 text-sm text-muted-foreground">Le compte {u.email || u.name || "SSS"} ne fait pas partie de l'équipe de L.M. Résidence.</p>
        <BoutonSortie className="w-full rounded-md bg-primary px-4 py-3 font-semibold text-primary-foreground hover:bg-primary/90">Changer de compte</BoutonSortie>
      </Ecran>
    )
  }

  const { session, canWrite } = state.ctx
  return (
    <div className="dash min-h-screen bg-background lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="sticky top-0 z-20 border-b border-border bg-card lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex h-full flex-col gap-3 p-3 lg:p-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <Image src={logo} alt="" width={36} height={36} className="size-9 object-contain" />
              <span className="font-serif text-lg font-bold">L.M. Résidence</span>
            </Link>
            <div className="lg:hidden">
              <BoutonSortie className="text-xs text-muted-foreground">Se déconnecter</BoutonSortie>
            </div>
          </div>
          <DashNav />
          <div className="mt-auto hidden space-y-2 border-t border-border pt-3 text-sm lg:block">
            <p className="truncate font-medium" title={session.user.email ?? undefined}>{session.user.name || session.user.email}</p>
            <Link href="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3.5" /> Voir le site</Link>
            <a href={config.appUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"><ExternalLink className="size-3.5" /> Ouvrir SSS</a>
            <BoutonSortie className="text-muted-foreground hover:text-foreground">Se déconnecter</BoutonSortie>
          </div>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-6 lg:p-8">
        {!canWrite && <p className="mb-4 rounded-md border border-border bg-muted p-3 text-sm">Ton accès SSS permet seulement de consulter.</p>}
        {children}
      </main>
    </div>
  )
}
