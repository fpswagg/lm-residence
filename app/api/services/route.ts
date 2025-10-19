import services from "@/data/services.json"

export async function GET() {
  return Response.json(services.services)
}
