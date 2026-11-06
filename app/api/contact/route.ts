import { contact_us } from "@/lib/mail"
import { sendToSss, visitorIpOf, within } from "@/lib/sss"

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, message, website } = await request.json()
    if (website) return Response.json({ success: true })

    // SSS is where requests are followed; the email stays as a second copy.
    const [sss, mail] = await Promise.allSettled([
      sendToSss({ name: nom, email, phone: telephone, message }, visitorIpOf(request)),
      within(contact_us(nom, email, telephone, message)),
    ])
    if (sss.status === "rejected") console.error("SSS contact failed:", sss.reason)
    if (mail.status === "rejected") console.error("Contact email failed:", mail.reason)
    if (sss.status === "rejected" && mail.status === "rejected") throw new Error("No channel worked")

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error processing contact:", error)
    return Response.json({ error: "Failed to process contact" }, { status: 500 })
  }
}
