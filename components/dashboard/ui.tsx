import type { ReactNode } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

export function Titre({ titre, texte, action }: { titre: string; texte?: string; action?: { href: string; label: string } }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-3xl font-bold text-foreground">{titre}</h1>
        {texte && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{texte}</p>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="size-4" /> {action.label}
        </Link>
      )}
    </div>
  )
}

export const Carte = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`rounded-lg border border-border bg-card p-4 sm:p-5 ${className}`}>{children}</div>
)

export const Pastille = ({ on, children }: { on: boolean; children: ReactNode }) => (
  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${on ? "bg-[#4a6741]/40 text-[#c4dcc0]" : "bg-muted text-muted-foreground"}`}>{children}</span>
)

export function Bandeau({ children }: { children: ReactNode }) {
  return <p role="status" className="mb-4 rounded-md border border-[#7a9278]/50 bg-[#4a6741]/25 px-3 py-2 text-sm text-[#d3e6cf]">{children}</p>
}

export function Vide({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">{children}</p>
}
