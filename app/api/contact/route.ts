import { contact_us } from "@/lib/mail"

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, message } = await request.json()
    
    await contact_us(nom, email, telephone, message);

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error processing contact:", error)
    return Response.json({ error: "Failed to process contact" }, { status: 500 })
  }
}
