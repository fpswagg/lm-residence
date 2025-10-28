import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"
import logo from "@/public/logo.png"

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-[#3d2817] to-[#1a1612] text-[#f8f4ef]">
      {/* Decorative wood grain top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About - Enhanced */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#cd9a51] to-[#b8944d] rounded-md flex items-center justify-center shadow-lg overflow-hidden">
                <Image
                  src={logo}
                  alt="L.M. Résidence Logo"
                  width={36}
                  height={36}
                  className="object-contain w-9 h-9"
                  priority
                />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-[#f8f4ef]">L.M. Résidence</h3>
                <p className="text-xs text-[#cd9a51] tracking-wider">Yaoundé</p>
              </div>
            </div>
            <p className="text-sm text-[#ede8e0] leading-relaxed mb-6">
              Votre destination de choix pour un séjour confortable et luxueux à Yaoundé.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              {process.env.NEXT_PUBLIC_FACEBOOK_URL && <a href={process.env.NEXT_PUBLIC_FACEBOOK_URL} className="w-9 h-9 rounded-full bg-[#8b6f47]/30 hover:bg-[#cd9a51] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Facebook size={16} />
              </a>}
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && <a href={process.env.NEXT_PUBLIC_INSTAGRAM_URL} className="w-9 h-9 rounded-full bg-[#8b6f47]/30 hover:bg-[#cd9a51] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Instagram size={16} />
              </a>}
              {process.env.NEXT_PUBLIC_TWITTER_URL && <a href={process.env.NEXT_PUBLIC_TWITTER_URL} className="w-9 h-9 rounded-full bg-[#8b6f47]/30 hover:bg-[#cd9a51] flex items-center justify-center transition-all duration-300 hover:scale-110">
                <Twitter size={16} />
              </a>}
            </div>
          </div>

          {/* Quick Links - Enhanced */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-[#cd9a51]">Liens Rapides</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/logements" className="text-[#ede8e0] hover:text-[#cd9a51] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6f47] group-hover:bg-[#cd9a51] transition-colors"></span>
                  Nos Logements
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-[#ede8e0] hover:text-[#cd9a51] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6f47] group-hover:bg-[#cd9a51] transition-colors"></span>
                  Services
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="text-[#ede8e0] hover:text-[#cd9a51] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6f47] group-hover:bg-[#cd9a51] transition-colors"></span>
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-[#ede8e0] hover:text-[#cd9a51] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6f47] group-hover:bg-[#cd9a51] transition-colors"></span>
                  À Propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#ede8e0] hover:text-[#cd9a51] transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8b6f47] group-hover:bg-[#cd9a51] transition-colors"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact - Enhanced */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-[#cd9a51]">Contact</h3>
            <div className="space-y-4 text-sm">
              <a href={`tel:${process.env.NEXT_PUBLIC_PHONE!.replaceAll(" ", "")}`} className="flex items-start gap-3 text-[#ede8e0] hover:text-[#cd9a51] transition-colors group">
                <div className="w-8 h-8 rounded-md bg-[#8b6f47]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#cd9a51]/30 transition-colors">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-xs text-[#d4c5b0]">{process.env.NEXT_PUBLIC_PHONE}</p>
                </div>
              </a>
              <a href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`} className="flex items-start gap-3 text-[#ede8e0] hover:text-[#cd9a51] transition-colors group">
                <div className="w-8 h-8 rounded-md bg-[#8b6f47]/30 flex items-center justify-center flex-shrink-0 group-hover:bg-[#cd9a51]/30 transition-colors">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-xs text-[#d4c5b0]">{process.env.NEXT_PUBLIC_EMAIL}</p>
                </div>
              </a>
              <div className="flex items-start gap-3 text-[#ede8e0]">
                <div className="w-8 h-8 rounded-md bg-[#8b6f47]/30 flex items-center justify-center flex-shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-xs text-[#d4c5b0]">{process.env.NEXT_PUBLIC_ADDRESS}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hours & CTA */}
          <div>
            <h3 className="font-serif text-lg font-bold mb-6 text-[#cd9a51]">Horaires</h3>
            <div className="space-y-2 text-sm text-[#ede8e0] mb-6">
              <p className="flex items-center gap-2">
                <span className="text-[#d4c5b0]">Ouvert&nbsp;:</span>
                <span className="font-medium">24h/24</span>
              </p>
            </div>
            <Link
              href="/reservation"
              className="block text-center px-6 py-3 bg-gradient-to-r from-[#cd9a51] to-[#b8944d] text-[#1a1612] font-medium rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Réserver Maintenant
            </Link>
          </div>
        </div>

        {/* Bottom Bar - Enhanced */}
        <div className="border-t border-[#8b6f47]/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#d4c5b0]">
            &copy; 2025 L.M. Résidence. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-xs text-[#d4c5b0]">
            <Link href="/politiques" className="hover:text-[#cd9a51] transition-colors">
              Politique de Confidentialité
            </Link>
            <Link href="/politiques" className="hover:text-[#cd9a51] transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
