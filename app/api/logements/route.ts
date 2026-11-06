import logements_indisponibles from "@/data/logements_indisponibles.json"
import { getSite } from "@/lib/sss"
import { NextResponse } from "next/server"

export async function GET() {
    const { logements } = await getSite()
    const noms = new Set(logements.map((l) => l.nom))
    return NextResponse.json([...logements, ...logements_indisponibles.filter((l) => !noms.has(l.nom))])
}
