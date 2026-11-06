import "server-only"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { config } from "./config"
import { BLOCS } from "./sss"
import { getAccessToken, getSession, safeNext, type SssBusiness, type SssSession } from "./sss-auth"

/**
 * Team dashboard (/dashboard). Read and written with the signed-in person's own SSS
 * access: they can do here what their role in the business allows in SSS, nothing more.
 */

export type Raw = Record<string, any>
export const str = (v: unknown) => (typeof v === "string" ? v : typeof v === "number" ? String(v) : "")
export const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : Number(v) || 0)
const list = (v: unknown): Raw[] => (Array.isArray(v) ? v : Array.isArray((v as Raw)?.items) ? (v as Raw).items : [])

const EARLY_REFRESH_MS = 60_000

export type DashContext = { session: SssSession; business: SssBusiness; base: string; token: string; canWrite: boolean }
export type DashState = { kind: "ok"; ctx: DashContext } | { kind: "signed_out" } | { kind: "wrong_business"; session: SssSession }

function dashboardBusiness(session: SssSession | null): SssBusiness | null {
  const b = session?.user.business
  return b && (b.id === config.storeId || b.slug === config.storeId) ? b : null
}

const canWrite = (session: SssSession) => session.scope.split(/\s+/).includes("business")
const baseOf = (b: SssBusiness) => `/api/v1/stores/${encodeURIComponent(b.id)}`

/** For pages (read-only cookies). An expired token goes through /auth/sss/refresh and comes back. */
export async function dashState(): Promise<DashState> {
  const session = await getSession()
  if (!session) return { kind: "signed_out" }
  const business = dashboardBusiness(session)
  if (!business) return { kind: "wrong_business", session }
  if (session.expiresAt - EARLY_REFRESH_MS <= Date.now()) {
    const here = (await headers()).get("x-pathname")
    redirect(`/auth/sss/refresh?next=${encodeURIComponent(safeNext(here))}`)
  }
  return { kind: "ok", ctx: { session, business, base: baseOf(business), token: session.accessToken, canWrite: canWrite(session) } }
}

export async function requireDash(): Promise<DashContext> {
  const state = await dashState()
  if (state.kind !== "ok") redirect("/dashboard")
  return state.ctx
}

/** For server actions and route handlers: may refresh the token (cookies are writable there). */
export async function actionDash(): Promise<DashContext> {
  const session = await getSession()
  const business = dashboardBusiness(session)
  const token = await getAccessToken()
  if (!session || !business || !token) throw new Error("Ta session a expiré : reconnecte-toi avec SSS.")
  if (!canWrite(session)) throw new Error("Ton accès SSS permet seulement de consulter.")
  return { session, business, base: baseOf(business), token, canWrite: true }
}

export class ApiFailure extends Error {
  constructor(readonly status: number, message: string) {
    super(message)
  }
}

export async function api<T = any>(ctx: DashContext, path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const h = new Headers({ Authorization: `Bearer ${ctx.token}`, Accept: "application/json" })
  if (init.body !== undefined) h.set("Content-Type", "application/json")
  const res = await fetch(`${config.apiUrl}${ctx.base}${path}`, {
    method: init.method ?? "GET",
    headers: h,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
    signal: AbortSignal.timeout(20000),
  })
  const body = (await res.json().catch(() => null)) as { data?: unknown; error?: { message?: string } } | null
  if (!res.ok) throw new ApiFailure(res.status, body?.error?.message || `SSS a répondu ${res.status}`)
  return (body?.data ?? null) as T
}

// ── Logements (SSS products) ─────────────────────────────────────────────────

export type Photo = { url: string; key: string; alt: string }

export type DashLogement = {
  id: string
  nom: string
  categorie: string
  description: string
  prix: number
  capacite: string
  surface: string
  equipements: string
  ordre: number
  visible: boolean
  photos: Photo[]
  meta: Raw
}

function photosDe(p: Raw): Photo[] {
  return (Array.isArray(p.images) ? p.images : [])
    .map((i: Raw) => ({ url: str(i.url), key: str(i.key), alt: str(i.alt) }))
    .filter((i: Photo) => i.url && !i.url.includes("placeholder"))
}

function logementDe(p: Raw): DashLogement {
  const m: Raw = p.metadata ?? {}
  return {
    id: str(p.id),
    nom: str(p.name),
    categorie: str(p.category) || "Studio",
    description: str(p.description),
    prix: num(p.price),
    capacite: str(m.capacite),
    surface: str(m.surface),
    equipements: Array.isArray(m.equipements) ? m.equipements.join(", ") : str(m.equipements),
    ordre: num(m.ordre),
    visible: p.active !== false,
    photos: photosDe(p),
    meta: m,
  }
}

export async function dashLogements(ctx: DashContext): Promise<DashLogement[]> {
  const out: Raw[] = []
  let cursor = ""
  for (let page = 0; page < 10; page++) {
    const raw = await api(ctx, `/products?limit=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""}`)
    out.push(...list(raw))
    cursor = Array.isArray(raw) ? "" : str((raw as Raw)?.nextCursor)
    if (!cursor) break
  }
  return out.map(logementDe).sort((a, b) => a.ordre - b.ordre)
}

export async function dashLogement(ctx: DashContext, id: string): Promise<DashLogement | null> {
  const raw = await api(ctx, `/products/${encodeURIComponent(id)}`).catch(notFound)
  return raw ? logementDe(raw) : null
}

const notFound = (err: unknown) => {
  if (err instanceof ApiFailure && err.status === 404) return null
  throw err
}

// ── Services (SSS records) ───────────────────────────────────────────────────

export type DashService = {
  id: string
  nom: string
  description: string
  details: string
  prix: number
  periode: string
  ordre: number
  visible: boolean
  data: Raw
  meta: Raw
}

function serviceDe(r: Raw): DashService {
  const data: Raw = r.data ?? {}
  // On the site, the details are the second paragraph of the description.
  const [description = "", ...details] = str(data.description).split(/\n\s*\n/)
  return {
    id: str(r.id),
    nom: str(r.name),
    description: description.trim(),
    details: details.join("\n\n").trim(),
    prix: num(data.price),
    periode: str(r.metadata?.periode),
    ordre: num(r.metadata?.ordre),
    visible: data.active !== false,
    data,
    meta: r.metadata ?? {},
  }
}

export async function dashServices(ctx: DashContext): Promise<DashService[]> {
  return list(await api(ctx, "/sasto/service")).map(serviceDe).sort((a, b) => a.ordre - b.ordre)
}

export async function dashService(ctx: DashContext, id: string): Promise<DashService | null> {
  const raw = await api(ctx, `/sasto/service/${encodeURIComponent(id)}`).catch(notFound)
  return raw ? serviceDe(raw) : null
}

// ── Demandes (SSS feedback: site forms, customer bot) ────────────────────────

export type DashDemande = {
  id: string
  at: string
  reservation: boolean
  nom: string
  telephone: string
  email: string
  message: string
  logement: string
  arrivee: string
  depart: string
  personnes: string
  traitee: boolean
  meta: Raw
}

function demandeDe(r: Raw): DashDemande {
  const d: Raw = r.data ?? {}
  const message = str(d.message) || str(d.body)
  const reservation = message.startsWith("Demande de réservation")
  const champ = (nom: string) => message.match(new RegExp(`^${nom} : (.*)$`, "m"))?.[1]?.trim() ?? ""
  return {
    id: str(r.id),
    at: str(r.createdAt),
    reservation,
    nom: str(d.name) || str(d.clientName) || str(r.name),
    telephone: str(d.phone),
    email: str(d.email),
    message: reservation ? champ("Message") : message,
    logement: reservation ? champ("Logement") : "",
    arrivee: reservation ? champ("Arrivée") : "",
    depart: reservation ? champ("Départ") : "",
    personnes: reservation ? champ("Personnes") : "",
    traitee: r.metadata?.handled === true,
    meta: r.metadata ?? {},
  }
}

export async function dashDemandes(ctx: DashContext): Promise<DashDemande[]> {
  return list(await api(ctx, "/sasto/feedback")).map(demandeDe).sort((a, b) => b.at.localeCompare(a.at))
}

// ── Sections of the site (SSS custom blocks) ─────────────────────────────────

export type Entree = { id: string; data: Raw }
export type Bloc = { id: string; fields: Raw[]; entrees: Entree[] }

/** Entries of a block by its id, or its name if it was rebuilt. Null when it no longer exists. */
export async function dashBloc(ctx: DashContext, which: keyof typeof BLOCS): Promise<Bloc | null> {
  const { id, name } = BLOCS[which]
  let found = await api(ctx, `/custom-blocks/${id}/entries`).catch(notFound)
  if (!found) {
    const other = list(await api(ctx, "/custom-blocks")).find((b) => b.name === name)
    if (!other) return null
    found = await api(ctx, `/custom-blocks/${encodeURIComponent(str(other.id))}/entries`)
  }
  const entrees = list(found.entries)
    .map((e) => ({ id: str(e.id), data: (e.data ?? {}) as Raw }))
    .sort((a, b) => num(a.data.position) - num(b.data.position))
  return { id: str(found.block?.id), fields: found.block?.fields ?? [], entrees }
}

// ── Profile: hours, policies, what is included ──────────────────────────────

/** SSS answers { profile, now, nowEn }: only the saved settings matter here. */
export async function dashProfil(ctx: DashContext): Promise<Raw> {
  return (await api(ctx, "/profile"))?.profile ?? {}
}

// ── Formatting ───────────────────────────────────────────────────────────────

export const fcfa = (n: number) => `${new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/\s/g, " ")} FCFA`

export function quand(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleString("fr-FR", { timeZone: "Africa/Douala", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
}

/** wa.me link for a phone number (Cameroon by default). */
export function waLink(phone: string, text = ""): string | null {
  let digits = phone.replace(/\D/g, "")
  if (digits.length === 9) digits = `237${digits}`
  if (digits.length < 9) return null
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`
}
