"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Award, Heart, Shield, Users, Star, Target } from "lucide-react"
import { useSite, useTextes } from "@/components/site-provider"

const VALEURS_STYLE = [
  { icon: Award, color: "#cd9a51" },
  { icon: Heart, color: "#7a9278" },
  { icon: Star, color: "#b8956a" },
  { icon: Shield, color: "#5c3d2e" },
]

export default function AboutPage() {
  const { valeurs, histoire } = useSite()
  const t = useTextes()
  const page = t("Page À propos")
  const nosValeurs = t("Nos valeurs")
  const equipe = t("Notre équipe")
  const invitation = t("À propos - Invitation")
  const values = valeurs.map((v, i) => ({ ...v, ...VALEURS_STYLE[i % VALEURS_STYLE.length] }))

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-[#f8f4ef] to-[#ede8e0]">
        {/* Header - Enhanced */}
        <section className="relative bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#7a9278] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-[#cd9a51]"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">{page.titre}</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              {page.texte}
            </p>
          </div>
        </section>

        {/* About Content - Enhanced */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Histoire Section */}
            <div className="mb-20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-serif font-bold text-[#5c3d2e] mb-6 flex items-center gap-3">
                    <span className="w-2 h-10 bg-[#cd9a51]"></span>
                    Notre Histoire
                  </h2>
                  <div className="space-y-4 text-[#5c3d2e]/80 leading-relaxed">
                    {histoire.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>

                <div className="relative">
                  <div className="relative h-96 rounded-2xl overflow-hidden border-2 border-[#d4c5b0] shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8b6f47] to-[#5c3d2e] flex items-center justify-center">
                      <Target size={120} className="text-[#f8f4ef]/20" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#cd9a51]/20 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#7a9278]/20 rounded-full blur-2xl"></div>
                </div>
              </div>
            </div>

            {/* Valeurs Section */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-serif font-bold text-[#5c3d2e] mb-4">{nosValeurs.titre}</h2>
                <p className="text-lg text-[#8b6f47] max-w-2xl mx-auto">
                  {nosValeurs.texte}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((valeur, idx) => (
                  <div 
                    key={idx} 
                    className="group relative p-8 bg-white rounded-2xl border-2 border-[#d4c5b0] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-500"
                  >
                    {/* Decorative wood grain border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47]"></div>
                    
                    {/* Icon */}
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                      style={{ backgroundColor: `${valeur.color}20` }}
                    >
                      <valeur.icon size={32} style={{ color: valeur.color }} />
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-[#5c3d2e] mb-3">
                      {valeur.titre}
                    </h3>
                    <p className="text-[#5c3d2e]/70 leading-relaxed">
                      {valeur.description}
                    </p>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#cd9a51]/10 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Équipe Section */}
            <div className="p-10 bg-gradient-to-br from-white to-[#ede8e0] rounded-2xl border-2 border-[#d4c5b0] shadow-xl">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7a9278]/20 to-[#cd9a51]/20 flex items-center justify-center border-2 border-[#d4c5b0]">
                    <Users size={40} className="text-[#5c3d2e]" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-serif font-bold text-[#5c3d2e] mb-4">{equipe.titre}</h2>
                  {equipe.texte.split(/\n\s*\n/).map((p, i, all) => (
                    <p key={i} className={`text-[#5c3d2e]/80 leading-relaxed ${i < all.length - 1 ? "mb-6" : ""}`}>{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
              {invitation.titre}
            </h2>
            <p className="text-lg text-[#ede8e0] mb-8 max-w-2xl mx-auto">
              {invitation.texte}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/reservation"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#cd9a51] hover:bg-[#b8944d] text-[#2d1f15] font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                Réserver Maintenant
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[#f8f4ef] text-[#f8f4ef] font-bold rounded-lg hover:bg-[#f8f4ef] hover:text-[#5c3d2e] transition-all duration-300"
              >
                Nous Contacter
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
