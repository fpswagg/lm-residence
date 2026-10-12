import Image from "next/image"
import { TLink } from "@/components/site/transition"
import { ArrowIcon } from "@/components/site/icons"
import { fcfa, type Logement } from "@/lib/logements"
import { showPrices } from "@/lib/site"
import { cn } from "@/lib/utils"

/** Carte logement: photo cadrée (arche une fois sur deux), numéro, nom, faits en petites capitales. */
export function RoomCard({ room, n, arch, tone = "dark" }: { room: Logement; n: number; arch?: boolean; tone?: "dark" | "light" }) {
  const p = room.photos[0]!
  const light = tone === "light"
  return (
    <TLink href={`/logements/${room.slug}`} data-cursor="Visiter" className={cn("group/card block", light && "text-paper")} draggable={false}>
      <div className={cn("relative aspect-[4/5] overflow-hidden", light ? "bg-ebony-3" : "bg-paper-3", arch && "shape-arch")}>
        <Image
          src={p.src}
          alt={p.alt}
          fill
          sizes="(min-width:1024px) 30vw, 78vw"
          placeholder="blur"
          blurDataURL={p.blur}
          draggable={false}
          className="object-cover transition-transform duration-[1400ms] ease-expo group-hover/card:scale-[1.06]"
          style={{ objectPosition: p.position }}
        />
      </div>
      <div className="mt-6 flex items-baseline justify-between gap-4">
        <span className={cn("label num", light ? "text-brass-light" : "text-brass-deep")}>{String(n).padStart(2, "0")}</span>
        <span className={cn("label", light ? "text-paper/50" : "text-ebony/50")}>{room.type === "chambre" ? "Chambre" : "Studio"}</span>
      </div>
      <h3 className="display mt-3 text-mid">{room.court}</h3>
      <div className={cn("mt-5 flex items-center justify-between gap-4 border-t pt-4", light ? "border-paper/15" : "border-ebony/15")}>
        <p className={cn("label num", light ? "text-paper/65" : "text-ebony/65")}>
          {room.surface} · {room.capacite} pers.{showPrices && ` · ${fcfa(room.prix)}`}
        </p>
        <ArrowIcon className="size-4 transition-transform duration-700 ease-expo group-hover/card:translate-x-1" />
      </div>
    </TLink>
  )
}
