import type { Metadata } from "next"
import { PageHead } from "@/components/kit/page-head"
import { Eyebrow } from "@/components/kit/button"
import { ContactForm } from "@/components/forms/contact-form"
import { photo } from "@/lib/photos"
import { site, tel, wa } from "@/lib/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Écrire ou appeler L.M. Résidence, 196 rue 1073, Hippodrome, Yaoundé. Réponse sous 24 heures, WhatsApp disponible.",
  alternates: { canonical: "/contact" },
}

const HOURS = [
  ["Lundi – vendredi", "08:00 – 18:00"],
  ["Samedi", "09:00 – 14:00"],
  ["Dimanche", "Fermé"],
]

export default function ContactPage() {
  return (
    <>
      <PageHead
        n="01"
        eyebrow="Contact"
        title={
          <>
            Écrivez-<em className="display-italic text-brass-deep">nous</em>
          </>
        }
        intro="Une question, des dates, un séjour long? Nous répondons sous 24 heures. Pour aller plus vite, WhatsApp."
        photo={photo("facade-2")}
      />
      <section data-theme="light" className="bg-paper-2 py-[clamp(5rem,10vw,9rem)]">
        <div className="shell grid-12 gap-y-16">
          <aside className="col-span-12 space-y-12 lg:col-span-4">
            <div>
              <Eyebrow n="02">Nous joindre</Eyebrow>
              <ul className="mt-8 space-y-3">
                <li>
                  <a href={tel(site.phone)} className="serif-text link-line num text-3xl">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={wa(site.whatsapp)} target="_blank" rel="noopener" className="serif-text link-line text-3xl">
                    WhatsApp
                  </a>
                </li>
                {site.email && (
                  <li>
                    <a href={`mailto:${site.email}`} className="link-line text-lg">
                      {site.email}
                    </a>
                  </li>
                )}
              </ul>
            </div>
            <div>
              <p className="label text-ebony/50">Adresse</p>
              <address className="mt-3 not-italic leading-relaxed text-ebony/80">
                {site.longName}
                <br />
                {site.address}, {site.city}
                <br />
                {site.addressHint}
              </address>
            </div>
            <div>
              <p className="label text-ebony/50">Accueil</p>
              <dl className="mt-3 border-t border-ebony/15">
                {HOURS.map(([d, h]) => (
                  <div key={d} className="flex justify-between gap-4 border-b border-ebony/15 py-3">
                    <dt>{d}</dt>
                    <dd className="num text-ebony/70">{h}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm text-ebony/55">La sécurité veille 24 h/24: les arrivées tardives s’organisent.</p>
            </div>
          </aside>
          <div className="col-span-12 lg:col-span-7 lg:col-start-6">
            <Eyebrow n="03">Votre message</Eyebrow>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
