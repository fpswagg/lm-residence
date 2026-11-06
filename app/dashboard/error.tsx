"use client"

export default function Erreur({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-card p-8 text-center">
      <h1 className="font-serif text-2xl font-bold">Impossible de charger cette page</h1>
      <p className="mb-5 mt-2 text-sm text-muted-foreground">SSS ne répond pas pour le moment, ou ton rôle ne permet pas d'ouvrir cette page.</p>
      <button onClick={reset} className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Réessayer</button>
    </div>
  )
}
