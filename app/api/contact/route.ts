import { contact_us } from "@/lib/mail"
import { contactSchema, fieldErrors } from "@/lib/schemas"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: "invalid", fields: fieldErrors(parsed.error) }, { status: 400 })
  const { nom, email, telephone, message, site } = parsed.data
  // Piège rempli: on fait comme si de rien n'était.
  if (site) return Response.json({ success: true })
  try {
    await contact_us(nom, email, telephone || null, message)
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error processing contact:", error)
    return Response.json({ error: "Failed to process contact" }, { status: 500 })
  }
}
