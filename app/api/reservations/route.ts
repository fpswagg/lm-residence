import { reservation } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const { nom, email, telephone, logement, dateArrivee, dateDepart, nombrePersonnes, message } = await request.json()

    await reservation(nom, email, telephone, logement, dateArrivee, dateDepart, nombrePersonnes, message);

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error saving reservation:", error)
    return Response.json({ error: "Failed to save reservation" }, { status: 500 })
  }
}
