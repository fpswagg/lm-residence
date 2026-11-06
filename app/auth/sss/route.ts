import { NextResponse } from "next/server"
import { config } from "@/lib/config"
import { authProblem, startSignIn } from "@/lib/sss-auth"

/** The "Continuer avec SSS" button lands here, SSS asks the person, then /auth/sss/callback. */
export async function GET(request: Request) {
  if (authProblem()) return NextResponse.redirect(new URL("/dashboard", config.siteUrl))
  const next = new URL(request.url).searchParams.get("next")
  // The site also answers on www: the sign-in cookie must be set on the address SSS comes back to.
  const home = new URL(config.siteUrl).host
  if (request.headers.get("host") !== home) {
    return NextResponse.redirect(new URL(`/auth/sss?next=${encodeURIComponent(next ?? "/dashboard")}`, config.siteUrl))
  }
  return NextResponse.redirect(await startSignIn(next))
}

export const dynamic = "force-dynamic"
