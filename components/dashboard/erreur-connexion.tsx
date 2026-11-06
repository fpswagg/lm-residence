"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

function Message({ messages }: { messages: Record<string, string> }) {
  const code = useSearchParams().get("error")
  if (!code) return null
  return <p role="alert" className="mb-4 rounded-md border border-red-400/40 bg-red-950/50 p-3 text-sm text-red-200">{messages[code] ?? "La connexion n'a pas abouti. Réessaie."}</p>
}

/** Layouts don't receive the address: the sign-in error is read here. */
export function ErreurClient({ messages }: { messages: Record<string, string> }) {
  return <Suspense><Message messages={messages} /></Suspense>
}
