import type { ReactNode } from "react"
import { SplitReveal } from "@/components/motion/split-reveal"
import { Figure } from "@/components/motion/figure"
import type { Photo } from "@/lib/photos"
import { Eyebrow } from "./button"
import { cn } from "@/lib/utils"

/** En-tête des pages intérieures: numéro, très grand titre révélé à l'ouverture, chapeau, photo en arche. */
export function PageHead({ n, eyebrow, title, intro, photo, children, className }: { n: string; eyebrow: string; title: ReactNode; intro?: ReactNode; photo?: Photo; children?: ReactNode; className?: string }) {
  return (
    <section data-theme="light" className={cn("relative bg-paper pb-[clamp(4rem,9vw,8rem)] pt-[calc(var(--header-h)+clamp(3rem,10vh,7rem))]", className)}>
      <div className="shell grid-12 items-end gap-y-10">
        <div className={cn("col-span-12", photo ? "lg:col-span-8" : "")}>
          <Eyebrow n={n}>{eyebrow}</Eyebrow>
          <SplitReveal as="h1" on="gate" className="display text-giant mt-8">
            {title}
          </SplitReveal>
        </div>
        {photo && (
          <Figure photo={photo} reveal="gate" priority sizes="(min-width:1024px) 26vw, 60vw" className="shape-arch col-span-7 col-start-6 aspect-[3/4] sm:col-span-5 sm:col-start-8 lg:col-span-3 lg:col-start-10" />
        )}
        {intro && (
          <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-5 lg:col-start-5">
            <SplitReveal on="gate" delay={0.25} className="lede text-ebony/80">
              {intro}
            </SplitReveal>
            {children}
          </div>
        )}
      </div>
    </section>
  )
}
