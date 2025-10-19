import logements from "@/data/logements.json"

export async function GET() {
  return Response.json(logements.logements)
}
