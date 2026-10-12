import { reservation } from "@/lib/mail"
import { fieldErrors, reservationSchema } from "@/lib/schemas"
import { logements } from "@/lib/logements"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = reservationSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: "invalid", fields: fieldErrors(parsed.error) }, { status: 400 })
  const v = parsed.data
  if (v.site) return Response.json({ success: true })
  const nomLogement = logements.find((l) => l.slug === v.logement || String(l.id) === v.logement)?.nom ?? v.logement
  try {
    await reservation(v.nom, v.email, v.telephone, nomLogement, v.dateArrivee, v.dateDepart, String(v.nombrePersonnes), v.message || null)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving reservation:", error)
    return Response.json({ error: "Failed to save reservation" }, { status: 500 })
  }
}
