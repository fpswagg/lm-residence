import { actionDash, api, ApiFailure } from "@/lib/dashboard"

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }
const MAX_BYTES = 4 * 1024 * 1024

/** One photo from the dashboard goes to the business's SSS files (resized in the browser first). */
export async function POST(request: Request) {
  const origin = request.headers.get("origin")
  if (origin && new URL(origin).host !== request.headers.get("host")) return Response.json({ error: "Requête refusée." }, { status: 403 })
  try {
    const ctx = await actionDash()
    const file = (await request.formData()).get("photo")
    if (!(file instanceof File) || !file.size) return Response.json({ error: "Aucune photo reçue." }, { status: 400 })
    const ext = TYPES[file.type]
    if (!ext) return Response.json({ error: "Photos acceptées : JPG, PNG ou WebP." }, { status: 400 })
    if (file.size > MAX_BYTES) return Response.json({ error: "Cette photo est trop lourde (4 Mo maximum)." }, { status: 400 })
    const base = file.name.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").slice(0, 60) || "photo"
    const up = await api(ctx, "/files", {
      method: "POST",
      body: { name: `${base}-${Date.now()}.${ext}`, mediaType: file.type, dataBase64: Buffer.from(await file.arrayBuffer()).toString("base64") },
    })
    return Response.json({ url: up.url, key: up.key, alt: "" })
  } catch (err) {
    const status = err instanceof ApiFailure ? err.status : 401
    return Response.json({ error: status === 403 ? "Ton rôle dans SSS ne permet pas d'ajouter des photos." : err instanceof Error ? err.message : "Envoi impossible." }, { status })
  }
}

export const dynamic = "force-dynamic"
