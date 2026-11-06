"use server"

import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { actionDash, api, ApiFailure, dashBloc, dashLogement, dashLogements, dashProfil, dashService, dashServices, type Photo, type Raw } from "@/lib/dashboard"
import { BLOCS } from "@/lib/sss"

export type FormState = { error?: string; ok?: string; at?: number }

const field = (fd: FormData, name: string) => String(fd.get(name) ?? "").trim()
const nombre = (value: string) => {
  const n = Number(value.replace(/\s/g, "").replace(",", "."))
  return value && Number.isFinite(n) && n >= 0 ? n : NaN
}

function message(err: unknown): string {
  if (err instanceof ApiFailure && err.status === 403) return "Ton rôle dans SSS ne permet pas de faire ça."
  if (err instanceof ApiFailure && err.status >= 500) return "SSS ne répond pas pour le moment. Réessaie dans un instant."
  return err instanceof Error ? err.message : "Une erreur est survenue."
}

/** The public pages read SSS through the "sss" tag: the change shows at once. */
function miseAJour() {
  revalidateTag("sss")
  revalidatePath("/dashboard", "layout")
}

const fait = (ok: string): FormState => ({ ok, at: Date.now() })

function photosDu(fd: FormData): Photo[] {
  try {
    const raw = JSON.parse(field(fd, "photos") || "[]")
    if (!Array.isArray(raw)) return []
    return raw
      .map((p) => ({ url: String(p?.url ?? ""), key: String(p?.key ?? ""), alt: String(p?.alt ?? "") }))
      .filter((p) => /^https?:\/\//.test(p.url))
      .slice(0, 20)
  } catch {
    return []
  }
}

// ── Logements ────────────────────────────────────────────────────────────────

export async function saveLogement(_prev: FormState, fd: FormData): Promise<FormState> {
  let cree = false
  try {
    const ctx = await actionDash()
    const id = field(fd, "id")
    const nom = field(fd, "nom").slice(0, 160)
    const prix = nombre(field(fd, "prix"))
    const capacite = nombre(field(fd, "capacite"))
    if (nom.length < 2) return { error: "Indique le nom du logement." }
    if (!Number.isFinite(prix)) return { error: "Le prix n'est pas valide." }
    if (field(fd, "capacite") && !Number.isFinite(capacite)) return { error: "Le nombre de personnes n'est pas valide." }

    const avant = id ? await dashLogement(ctx, id) : null
    if (id && !avant) return { error: "Ce logement n'existe plus." }
    const photos = photosDu(fd).map((p) => ({ ...p, alt: p.alt || nom }))
    const ordreSaisi = nombre(field(fd, "ordre"))
    const ordre = Number.isFinite(ordreSaisi)
      ? ordreSaisi
      : avant?.ordre ?? Math.max(0, ...(await dashLogements(ctx)).map((l) => l.ordre)) + 1

    const metadata: Raw = { ...(avant?.meta ?? {}), ordre, surface: field(fd, "surface").slice(0, 40), equipements: field(fd, "equipements").slice(0, 1000) }
    if (Number.isFinite(capacite)) metadata.capacite = capacite
    else delete metadata.capacite

    const corps = {
      name: nom,
      price: prix,
      currency: "FCFA",
      description: field(fd, "description").slice(0, 2000),
      category: field(fd, "categorie") === "Chambre" ? "Chambre" : "Studio",
      unit: "nuit",
      unlimitedStock: true,
      active: fd.get("visible") === "on",
      images: photos,
      metadata,
    }
    if (avant) await api(ctx, `/products/${encodeURIComponent(avant.id)}`, { method: "PATCH", body: corps })
    else {
      await api(ctx, "/products", { method: "POST", body: { ...corps, quantity: 0 } })
      cree = true
    }
    miseAJour()
    if (avant) return fait("Logement enregistré. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
  if (cree) redirect("/dashboard/logements?ajoute=1")
  return {}
}

export async function setLogementVisible(fd: FormData): Promise<void> {
  const ctx = await actionDash()
  await api(ctx, `/products/${encodeURIComponent(field(fd, "id"))}`, { method: "PATCH", body: { active: field(fd, "visible") === "true" } })
  miseAJour()
}

export async function deleteLogement(fd: FormData): Promise<FormState | void> {
  try {
    const ctx = await actionDash()
    // The photos stay in SSS: the gallery and other logements can use the same files.
    await api(ctx, `/products/${encodeURIComponent(field(fd, "id"))}`, { method: "DELETE" })
    miseAJour()
  } catch (err) {
    return { error: message(err) }
  }
  redirect("/dashboard/logements?supprime=1")
}

// ── Services ─────────────────────────────────────────────────────────────────

export async function saveService(_prev: FormState, fd: FormData): Promise<FormState> {
  let cree = false
  try {
    const ctx = await actionDash()
    const id = field(fd, "id")
    const nom = field(fd, "nom").slice(0, 160)
    const prixTexte = field(fd, "prix")
    const prix = prixTexte ? nombre(prixTexte) : 0
    if (nom.length < 2) return { error: "Indique le nom du service." }
    if (!Number.isFinite(prix)) return { error: "Le prix n'est pas valide." }

    const avant = id ? await dashService(ctx, id) : null
    if (id && !avant) return { error: "Ce service n'existe plus." }
    const ordreSaisi = nombre(field(fd, "ordre"))
    const ordre = Number.isFinite(ordreSaisi)
      ? ordreSaisi
      : avant?.ordre ?? Math.max(0, ...(await dashServices(ctx)).map((s) => s.ordre)) + 1

    const data: Raw = {
      ...(avant?.data ?? { currency: "FCFA", durationMin: 0 }),
      price: prix,
      active: fd.get("visible") === "on",
      // On the site, the details are the second paragraph of the description.
      description: [field(fd, "description"), field(fd, "details")].filter(Boolean).join("\n\n").slice(0, 4000),
    }
    const metadata: Raw = { ...(avant?.meta ?? {}), ordre, periode: field(fd, "periode").slice(0, 40) }
    if (avant) await api(ctx, `/sasto/service/${encodeURIComponent(avant.id)}`, { method: "PATCH", body: { name: nom, data, metadata } })
    else {
      await api(ctx, "/sasto/service", { method: "POST", body: { name: nom, data, metadata } })
      cree = true
    }
    miseAJour()
    if (avant) return fait("Service enregistré. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
  if (cree) redirect("/dashboard/services?ajoute=1")
  return {}
}

export async function deleteService(fd: FormData): Promise<FormState | void> {
  try {
    const ctx = await actionDash()
    await api(ctx, `/sasto/service/${encodeURIComponent(field(fd, "id"))}`, { method: "DELETE" })
    miseAJour()
  } catch (err) {
    return { error: message(err) }
  }
  redirect("/dashboard/services?supprime=1")
}

// ── Demandes ─────────────────────────────────────────────────────────────────

export async function setTraitee(fd: FormData): Promise<void> {
  try {
    const ctx = await actionDash()
    const id = encodeURIComponent(field(fd, "id"))
    const row = await api(ctx, `/sasto/feedback/${id}`)
    await api(ctx, `/sasto/feedback/${id}`, { method: "PATCH", body: { metadata: { ...(row?.metadata ?? {}), handled: field(fd, "traitee") === "true" } } })
    revalidatePath("/dashboard", "layout")
  } catch (err) {
    throw new Error(message(err))
  }
}

// ── Galerie ──────────────────────────────────────────────────────────────────

export async function savePhotoGalerie(_prev: FormState, fd: FormData): Promise<FormState> {
  let cree = false
  try {
    const ctx = await actionDash()
    const bloc = await dashBloc(ctx, "galerie")
    if (!bloc) return { error: `La section « ${BLOCS.galerie.name} » n'existe plus dans SSS.` }
    const id = field(fd, "id")
    const titre = field(fd, "titre").slice(0, 160)
    const photo = photosDu(fd)[0]
    if (!titre) return { error: "Donne un titre à la photo." }
    if (!photo) return { error: "Ajoute une photo." }
    const avant = bloc.entrees.find((e) => e.id === id)
    if (id && !avant) return { error: "Cette photo n'existe plus." }
    const position = nombre(field(fd, "position"))
    const data = {
      ...(avant?.data ?? {}),
      titre,
      photo: photo.url,
      description: field(fd, "description").slice(0, 500),
      categorie: field(fd, "categorie"),
      position: Number.isFinite(position) ? position : avant?.data.position ?? bloc.entrees.length + 1,
    }
    if (avant) await api(ctx, `/custom-blocks/${bloc.id}/entries/${encodeURIComponent(avant.id)}`, { method: "PATCH", body: { data } })
    else {
      await api(ctx, `/custom-blocks/${bloc.id}/entries`, { method: "POST", body: { data } })
      cree = true
    }
    miseAJour()
    if (avant) return fait("Photo enregistrée. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
  if (cree) redirect("/dashboard/galerie?ajoute=1")
  return {}
}

async function retireEntree(which: keyof typeof BLOCS, id: string) {
  const ctx = await actionDash()
  const bloc = await dashBloc(ctx, which)
  if (!bloc) throw new Error("Cette section n'existe plus dans SSS.")
  await api(ctx, `/custom-blocks/${bloc.id}/entries/${encodeURIComponent(id)}`, { method: "DELETE" })
  miseAJour()
}

export async function deletePhotoGalerie(fd: FormData): Promise<FormState | void> {
  try {
    await retireEntree("galerie", field(fd, "id"))
  } catch (err) {
    return { error: message(err) }
  }
  redirect("/dashboard/galerie?supprime=1")
}

// ── Textes ───────────────────────────────────────────────────────────────────

export async function saveTexte(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    const bloc = await dashBloc(ctx, "textes")
    const avant = bloc?.entrees.find((e) => e.id === field(fd, "id"))
    if (!bloc || !avant) return { error: "Ce texte n'existe plus." }
    const data = { ...avant.data, titre: field(fd, "titre"), sousTitre: field(fd, "sousTitre"), texte: field(fd, "texte") }
    await api(ctx, `/custom-blocks/${bloc.id}/entries/${encodeURIComponent(avant.id)}`, { method: "PATCH", body: { data } })
    miseAJour()
    return fait("Enregistré. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}

// ── Séjour: règles, annulation, inclus ───────────────────────────────────────

export async function saveRegle(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    const bloc = await dashBloc(ctx, "regles")
    if (!bloc) return { error: `La section « ${BLOCS.regles.name} » n'existe plus dans SSS.` }
    const id = field(fd, "id")
    const titre = field(fd, "titre").slice(0, 160)
    const texte = field(fd, "texte").slice(0, 4000)
    if (!titre || !texte) return { error: "Indique un titre et au moins une consigne." }
    const avant = bloc.entrees.find((e) => e.id === id)
    if (id && !avant) return { error: "Cette règle n'existe plus." }
    const data = { ...(avant?.data ?? { position: bloc.entrees.length + 1 }), titre, texte }
    if (avant) await api(ctx, `/custom-blocks/${bloc.id}/entries/${encodeURIComponent(avant.id)}`, { method: "PATCH", body: { data } })
    else await api(ctx, `/custom-blocks/${bloc.id}/entries`, { method: "POST", body: { data } })
    miseAJour()
    return fait(avant ? "Règle enregistrée. Le site est à jour." : "Règle ajoutée. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}

export async function deleteRegle(fd: FormData): Promise<FormState | void> {
  try {
    await retireEntree("regles", field(fd, "id"))
  } catch (err) {
    return { error: message(err) }
  }
}

export async function saveSejour(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    const profil = await dashProfil(ctx)
    const inclus = field(fd, "inclus").split("\n").map((l) => l.trim().slice(0, 60)).filter(Boolean)
    if (inclus.length > 30) return { error: "30 éléments maximum dans « Inclus »." }
    await api(ctx, "/profile", {
      method: "PUT",
      body: { policies: { ...(profil?.policies ?? {}), cancellation: field(fd, "annulation").slice(0, 1500) }, amenities: inclus },
    })
    miseAJour()
    return fait("Enregistré. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}

// ── Résidence: contacts, réseaux, horaires, histoire ─────────────────────────

const lien = (v: string) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v)

export async function saveContacts(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    const whatsapp = field(fd, "whatsapp").slice(0, 40)
    if (whatsapp && whatsapp.replace(/\D/g, "").length < 9) return { error: "Le numéro WhatsApp semble incomplet." }
    const email = field(fd, "email").slice(0, 160)
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return { error: "L'adresse email n'est pas valide." }
    await api(ctx, "", {
      method: "PATCH",
      body: {
        phone: field(fd, "phone").slice(0, 40) || null,
        whatsapp: whatsapp || null,
        email: email || null,
        address: field(fd, "address").slice(0, 200) || null,
      },
    })
    // SSS rebuilds the whole design from what it receives: send all of it back.
    const vitrine = await api(ctx, "/showcase")
    const design = vitrine?.design ?? {}
    const socials: Raw = { ...(design.socials ?? {}) }
    for (const [cle, nom] of [["facebook", "facebook"], ["instagram", "instagram"], ["x", "twitter"]]) {
      const v = lien(field(fd, nom))
      if (v) socials[cle] = v.slice(0, 300)
      else delete socials[cle]
    }
    await api(ctx, "/showcase", { method: "PATCH", body: { design: { ...design, socials } } })
    miseAJour()
    return fait("Contacts enregistrés. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}

const JOURS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

export async function saveHoraires(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    const profil = await dashProfil(ctx)
    const avant: Raw = profil?.hours?.days ?? {}
    const days: Raw = {}
    for (const j of JOURS) {
      const from = field(fd, `${j}-de`)
      const to = field(fd, `${j}-a`)
      if (Boolean(from) !== Boolean(to)) return { error: "Indique l'heure d'ouverture et l'heure de fermeture, ou laisse les deux vides pour fermé." }
      // A second opening on the same day (set in SSS) stays as it is.
      days[j] = from ? [{ from, to }, ...(avant[j] ?? []).slice(1)] : []
    }
    await api(ctx, "/profile", { method: "PUT", body: { hours: { ...(profil?.hours ?? {}), days } } })
    miseAJour()
    return fait("Horaires enregistrés. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}

export async function saveHistoire(_prev: FormState, fd: FormData): Promise<FormState> {
  try {
    const ctx = await actionDash()
    await api(ctx, "/showcase", { method: "PATCH", body: { aboutMarkdown: field(fd, "histoire").slice(0, 8000) } })
    miseAJour()
    return fait("Histoire enregistrée. Le site est à jour.")
  } catch (err) {
    return { error: message(err) }
  }
}
