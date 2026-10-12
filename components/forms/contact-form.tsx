"use client"

import { useState, type FormEvent } from "react"
import { Field, Honeypot, TextArea } from "@/components/kit/field"
import { Button } from "@/components/kit/button"
import { Sent, SendError } from "@/components/kit/form-status"
import { contactSchema, fieldErrors } from "@/lib/schemas"
import { site, wa } from "@/lib/site"

const empty = { nom: "", email: "", telephone: "", message: "", site: "" }

export function ContactForm() {
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: e.target.value }))
    if (errors[k]) setErrors(({ [k]: _, ...rest }) => rest)
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const parsed = contactSchema.safeParse(v)
    if (!parsed.success) {
      const f = fieldErrors(parsed.error)
      setErrors(f)
      document.getElementById(`c-${Object.keys(f)[0]}`)?.focus()
      return
    }
    setStatus("sending")
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(v) })
      if (r.status === 400) {
        const j = await r.json().catch(() => ({}))
        setErrors(j.fields ?? {})
        setStatus("idle")
        return
      }
      if (!r.ok) throw new Error(String(r.status))
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  if (status === "sent")
    return (
      <Sent title={<>Merci, <em className="display-italic text-brass-deep">c’est noté.</em></>}>
        <p>Votre message est bien parti. Nous vous répondons sous 24 heures, souvent bien avant.</p>
        <div className="mt-8">
          <Button variant="link" onClick={() => (setV(empty), setStatus("idle"))}>
            Écrire un autre message
          </Button>
        </div>
      </Sent>
    )

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-x-10 gap-y-6 md:grid-cols-2" aria-label="Formulaire de contact">
      <Honeypot value={v.site} onChange={(x) => setV((s) => ({ ...s, site: x }))} />
      <Field id="c-nom" label="Nom" name="nom" autoComplete="name" required value={v.nom} onChange={set("nom")} error={errors.nom} />
      <Field id="c-email" label="E-mail" name="email" type="email" autoComplete="email" required value={v.email} onChange={set("email")} error={errors.email} />
      <Field id="c-telephone" label="Téléphone" hint="facultatif" name="telephone" type="tel" autoComplete="tel" value={v.telephone} onChange={set("telephone")} error={errors.telephone} className="md:col-span-2" />
      <TextArea id="c-message" label="Message" name="message" required value={v.message} onChange={set("message")} error={errors.message} placeholder="Vos dates, vos questions…" className="md:col-span-2" />
      <div className="flex flex-wrap items-center gap-6 md:col-span-2">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi…" : "Envoyer le message"}
        </Button>
        <p className="text-sm text-ebony/55">
          Plus rapide:{" "}
          <a className="link-line text-ebony" href={wa(site.whatsapp)} target="_blank" rel="noopener">
            WhatsApp
          </a>
        </p>
      </div>
      {status === "error" && (
        <div className="md:col-span-2">
          <SendError>L’envoi n’a pas abouti. Réessayez dans un instant, ou écrivez-nous sur WhatsApp.</SendError>
        </div>
      )}
    </form>
  )
}
