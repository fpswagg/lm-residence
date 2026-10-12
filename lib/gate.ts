/**
 * La « porte »: les animations d'entrée d'une page attendent qu'elle s'ouvre, c'est-à-dire la fin du
 * préloader (premier chargement) ou le départ du rideau (navigation). Retour arrière et visites
 * suivantes: la porte est déjà ouverte, les animations partent tout de suite.
 */
let open = false
const waiting = new Set<() => void>()

export function closeGate() {
  open = false
}

export function openGate() {
  open = true
  const list = [...waiting]
  waiting.clear()
  for (const f of list) f()
}

export function isGateOpen() {
  return open
}

/** Lance f quand la porte est ouverte; renvoie de quoi annuler. */
export function whenOpen(f: () => void) {
  if (open) {
    f()
    return () => {}
  }
  waiting.add(f)
  return () => void waiting.delete(f)
}
