import logements from "@/data/logements.json"
import logements_indisponibles from "@/data/logements_indisponibles.json"
import { NextResponse } from "next/server"

export function GET() {
    return NextResponse.json([...logements, ...logements_indisponibles]);
}