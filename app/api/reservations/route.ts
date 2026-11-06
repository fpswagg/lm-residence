import { reservation } from "@/lib/mail"
import { sendToSss, visitorIpOf, within } from "@/lib/sss"

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, logement, dateArrivee, dateDepart, nombrePersonnes, message, website } = await request.json()
    if (website) return Response.json({ success: true })

    const demande = [
      "Demande de réservation",
      `Logement : ${logement}`,
      `Arrivée : ${dateArrivee}`,
      `Départ : ${dateDepart}`,
      `Personnes : ${nombrePersonnes}`,
      message ? `\nMessage : ${message}` : "",
    ].filter(Boolean).join("\n")

    // SSS is where requests are followed; the email stays as a second copy.
    const [sss, mail] = await Promise.allSettled([
      sendToSss({ name: nom, email, phone: telephone, message: demande }, visitorIpOf(request)),
      within(reservation(nom, email, telephone, logement, dateArrivee, dateDepart, nombrePersonnes, message)),
    ])
    if (sss.status === "rejected") console.error("SSS reservation failed:", sss.reason)
    if (mail.status === "rejected") console.error("Reservation email failed:", mail.reason)
    if (sss.status === "rejected" && mail.status === "rejected") throw new Error("No channel worked")

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving reservation:", error)
    return Response.json({ error: "Failed to save reservation" }, { status: 500 })
  }
}
