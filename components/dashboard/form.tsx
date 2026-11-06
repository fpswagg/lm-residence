"use client"

import { useActionState, useEffect, useRef, useState, useTransition, type ReactNode } from "react"
import { Check, Loader2 } from "lucide-react"
import type { FormState } from "@/app/dashboard/actions"

export const inputClass =
  "w-full rounded-md border border-border bg-input px-3 py-2.5 text-[15px] text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"

export function Champ({ label, aide, children }: { label: string; aide?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {aide && <span className="mt-1 block text-xs text-muted-foreground">{aide}</span>}
    </label>
  )
}

/** Keeps what was typed when SSS refuses (a plain form action would empty the fields). */
export function ActionForm({
  action,
  children,
  bouton = "Enregistrer",
  lectureSeule,
  autres,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>
  children: ReactNode
  bouton?: string
  lectureSeule?: boolean
  autres?: ReactNode
}) {
  const [state, formAction, pending] = useActionState(action, {})
  const [, startTransition] = useTransition()
  const [vu, setVu] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    setVu(Boolean(state.ok))
    if (state.error) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" })
    if (!state.ok) return
    const t = setTimeout(() => setVu(false), 5000)
    return () => clearTimeout(t)
  }, [state])

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        const fd = new FormData(e.currentTarget)
        startTransition(() => formAction(fd))
      }}
    >
      {children}
      {state.error && (
        <p ref={ref} role="alert" className="rounded-md border border-red-400/40 bg-red-950/50 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending || lectureSeule}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Enregistrement…" : bouton}
        </button>
        {vu && state.ok && (
          <span role="status" className="inline-flex items-center gap-1.5 text-sm text-[#a9c9a4]">
            <Check className="size-4" /> {state.ok}
          </span>
        )}
        {autres}
      </div>
    </form>
  )
}

/** A button that asks first: nothing comes back after a delete. */
export function BoutonConfirme({
  action,
  id,
  texte,
  question,
  lectureSeule,
}: {
  action: (fd: FormData) => Promise<FormState | void>
  id: string
  texte: string
  question: string
  lectureSeule?: boolean
}) {
  const [pending, start] = useTransition()
  const [erreur, setErreur] = useState("")
  return (
    <>
      <button
        type="button"
        disabled={pending || lectureSeule}
        onClick={() => {
          if (!window.confirm(question)) return
          const fd = new FormData()
          fd.set("id", id)
          setErreur("")
          start(async () => {
            try {
              const res = await action(fd)
              if (res?.error) setErreur(res.error)
            } catch (err) {
              // redirect() also lands here: Next.js handles it, only real errors are shown.
              if ((err as { digest?: string })?.digest?.startsWith("NEXT_REDIRECT")) throw err
              setErreur("Impossible de supprimer pour le moment.")
            }
          })
        }}
        className="rounded-md border border-red-400/40 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-950/50 disabled:opacity-50"
      >
        {pending ? "Suppression…" : texte}
      </button>
      {erreur && <span className="text-sm text-red-200">{erreur}</span>}
    </>
  )
}
