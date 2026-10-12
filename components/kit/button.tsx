import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Magnetic } from "@/components/motion/magnetic"
import { TLink } from "@/components/site/transition"
import { ArrowIcon, WhatsAppIcon } from "@/components/site/icons"
import { cn } from "@/lib/utils"

type Variant = "solid" | "paper" | "outline" | "outline-light" | "link"

const base = "label group/btn relative inline-flex items-center justify-center gap-4 whitespace-nowrap transition-colors duration-500 disabled:pointer-events-none disabled:opacity-40"
const variants: Record<Variant, string> = {
  solid: "h-14 rounded-full bg-ebony px-8 text-paper hover:bg-ebony-3",
  paper: "h-14 rounded-full bg-paper px-8 text-ebony hover:bg-brass-light",
  outline: "h-14 rounded-full border border-ebony/25 px-7 text-ebony hover:border-ebony hover:bg-ebony hover:text-paper",
  "outline-light": "h-14 rounded-full border border-paper/25 px-7 text-paper hover:border-paper hover:bg-paper hover:text-ebony",
  link: "gap-3",
}

interface Common {
  children: ReactNode
  variant?: Variant
  icon?: "arrow" | "whatsapp" | "none"
  magnetic?: boolean
  className?: string
}

/** Texte qui roule vers le haut au survol (deux copies dans un masque). */
function Roll({ children, link }: { children: ReactNode; link?: boolean }) {
  if (link) return <span className="link-line">{children}</span>
  return (
    <span className="relative block overflow-hidden">
      <span className="block transition-transform duration-700 ease-expo group-hover/btn:-translate-y-full">{children}</span>
      <span aria-hidden className="absolute inset-0 block translate-y-full transition-transform duration-700 ease-expo group-hover/btn:translate-y-0">
        {children}
      </span>
    </span>
  )
}

function Icon({ icon }: { icon: Common["icon"] }) {
  if (icon === "none") return null
  if (icon === "whatsapp") return <WhatsAppIcon className="size-4" />
  return <ArrowIcon className="size-4 transition-transform duration-700 ease-expo group-hover/btn:translate-x-1" />
}

/** Bouton / lien du site: pilule ébène ou papier, contour, ou lien souligné. */
export function Button({
  children,
  variant = "solid",
  icon = "arrow",
  magnetic = variant !== "link",
  className,
  href,
  external,
  ...rest
}: Common & { href?: string; external?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const cls = cn(base, variants[variant], className)
  const inner = (
    <>
      {icon === "whatsapp" && <Icon icon={icon} />}
      <Roll link={variant === "link"}>{children}</Roll>
      {icon !== "whatsapp" && <Icon icon={icon} />}
    </>
  )
  let el: ReactNode
  if (href && (external || /^(https?:|tel:|mailto:)/.test(href))) {
    el = (
      <a href={href} className={cls} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener" : undefined}>
        {inner}
      </a>
    )
  } else if (href) {
    el = (
      <TLink href={href} className={cls}>
        {inner}
      </TLink>
    )
  } else {
    el = (
      <button type="button" className={cls} {...rest}>
        {inner}
      </button>
    )
  }
  return magnetic ? <Magnetic>{el}</Magnetic> : el
}

/** Étiquette: capitales espacées dans une pilule fine. */
export function Tag({ children, tone = "dark", dot, className }: { children: ReactNode; tone?: "dark" | "light" | "brass" | "sage"; dot?: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "label inline-flex h-8 items-center gap-2 rounded-full border px-3.5",
        tone === "dark" && "border-ebony/15 text-ebony/75",
        tone === "light" && "border-paper/20 text-paper/80",
        tone === "brass" && "border-brass-deep/40 text-brass-deep",
        tone === "sage" && "border-sage-deep/40 text-sage-deep",
        className,
      )}
    >
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}

/** Titre de section: numéro, filet, intitulé. */
export function Eyebrow({ n, children, className, tone = "dark" }: { n?: string; children: ReactNode; className?: string; tone?: "dark" | "light" }) {
  return (
    <p className={cn("label flex items-center gap-4", tone === "dark" ? "text-brass-deep" : "text-brass-light", className)}>
      {n && <span className="num">{n}</span>}
      {n && <span className="h-px w-10 bg-current opacity-50" />}
      {children}
    </p>
  )
}
