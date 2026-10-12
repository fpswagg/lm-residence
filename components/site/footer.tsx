import { TLink } from "./transition"
import { Magnetic } from "@/components/motion/magnetic"
import { SplitReveal } from "@/components/motion/split-reveal"
import { ArrowIcon, WhatsAppIcon } from "./icons"
import { nav, site, tel, wa } from "@/lib/site"

/** Pied de page: une invitation en très grand, les coordonnées, puis le nom qui déborde du bas. */
export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer data-theme="dark" className="relative overflow-hidden bg-ebony text-paper">
      <div className="shell pt-[clamp(6rem,14vw,12rem)]">
        <p className="label mb-8 text-brass-light">Séjour court ou long</p>
        <SplitReveal as="h2" className="display text-huge max-w-[12ch]">
          La porte est <em className="display-italic text-brass-light">ouverte</em>.
        </SplitReveal>
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Magnetic>
            <TLink
              href="/reservation"
              className="label group inline-flex h-14 items-center gap-4 rounded-full bg-paper px-8 text-ebony transition-colors duration-500 hover:bg-brass-light"
            >
              Demander une réservation
              <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </TLink>
          </Magnetic>
          <Magnetic>
            <a
              href={wa(site.whatsapp, "Bonjour, je souhaite réserver à L.M. Résidence.")}
              target="_blank"
              rel="noopener"
              className="label inline-flex h-14 items-center gap-3 rounded-full border border-paper/25 px-7 transition-colors duration-500 hover:border-paper"
            >
              <WhatsAppIcon className="size-4" />
              WhatsApp
            </a>
          </Magnetic>
        </div>

        <div className="mt-[clamp(5rem,10vw,9rem)] grid grid-cols-2 gap-x-6 gap-y-10 border-t border-paper/12 pt-10 md:grid-cols-4">
          <div>
            <p className="label mb-4 text-paper/45">Adresse</p>
            <address className="not-italic leading-relaxed text-paper/85">
              {site.longName}
              <br />
              {site.address}
              <br />
              {site.city}, {site.addressHint}
            </address>
          </div>
          <div>
            <p className="label mb-4 text-paper/45">Nous joindre</p>
            <ul className="space-y-2 text-paper/85">
              <li><a className="link-line" href={tel(site.phone)}>{site.phone}</a></li>
              <li><a className="link-line" href={wa(site.whatsapp)} target="_blank" rel="noopener">WhatsApp</a></li>
              {site.email && <li><a className="link-line" href={`mailto:${site.email}`}>{site.email}</a></li>}
            </ul>
          </div>
          <div>
            <p className="label mb-4 text-paper/45">La résidence</p>
            <ul className="space-y-2 text-paper/85">
              {nav.map((l) => (
                <li key={l.href}><TLink className="link-line" href={l.href}>{l.label}</TLink></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="label mb-4 text-paper/45">Suivre</p>
            <ul className="space-y-2 text-paper/85">
              {site.facebook && <li><a className="link-line" href={site.facebook} target="_blank" rel="noopener">Facebook</a></li>}
              {site.instagram && <li><a className="link-line" href={site.instagram} target="_blank" rel="noopener">Instagram</a></li>}
              <li><TLink className="link-line" href="/politiques">Politiques &amp; conditions</TLink></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="shell mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper/12 py-6 text-paper/45">
        <p className="label">© {year} {site.longName}</p>
        <p className="label">Yaoundé · Cameroun</p>
      </div>

      <p aria-hidden className="display pointer-events-none select-none whitespace-nowrap text-center text-[17.4vw] leading-[0.72] text-paper/[0.06] translate-y-[8%]">
        Lucien Marie
      </p>
    </footer>
  )
}
