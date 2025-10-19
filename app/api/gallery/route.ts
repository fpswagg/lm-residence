import { NextResponse } from "next/server"
import galleryData from "@/data/gallery.json"

export async function GET() {
  return NextResponse.json(galleryData)
}

