"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Home, Award, MapPin, CheckCircle, Users, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <>
      <Navigation />

      {/* Hero Section - Enhanced with dark wood theme */}
      <section className="relative min-h-[90vh] bg-gradient-to-br from-[#2d1f15] via-[#1a1612] to-[#2d1f15] flex items-center justify-center overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-20 right-20 w-96 h-96 bg-[#7a9278] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
        </div>

        {/* Subtle wood pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 3px, #5c3d2e 3px, #5c3d2e 6px)`
        }}></div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          {/* Decorative top accent */}
          <div className="flex justify-center mb-8">
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#cd9a51] to-transparent"></div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#cd9a51] mb-6 text-balance">
            L.M. Résidence
          </h1>
          
          <p className="text-2xl sm:text-3xl text-[#b8956a] mb-6 text-balance font-serif italic">
            Votre destination de luxe à Yaoundé
          </p>
          
          <p className="text-lg text-[#f8f4ef]/80 mb-12 max-w-3xl mx-auto text-balance leading-relaxed">
            Découvrez le confort et l'élégance dans nos logements haut de gamme, avec des services personnalisés pour un
            séjour inoubliable. Une expérience artisanale de l'hospitalité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/logements"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] font-medium rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              Découvrir nos logements
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/reservation"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#cd9a51] text-[#cd9a51] font-medium rounded-lg hover:bg-[#cd9a51] hover:text-[#1a1612] transition-all duration-300"
            >
              Réserver maintenant
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 text-sm text-[#b8956a]">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-[#7a9278]" />
              <span>Service Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-[#7a9278]" />
              <span>Sécurité 24/7</span>
            </div>
            <div className="flex items-center gap-2">
              <Award size={20} className="text-[#7a9278]" />
              <span>Qualité Garantie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-[#2d1f15] to-[#1a1612]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block">
              <div className="h-1 w-16 bg-[#cd9a51] mx-auto mb-6"></div>
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#cd9a51] mb-4">
                Pourquoi Choisir L.M. Résidence
              </h2>
              <p className="text-lg text-[#b8956a] max-w-2xl mx-auto">
                Une expérience unique alliant confort artisanal et services d'excellence
              </p>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Home,
                titre: "Confort Premium",
                description: "Des logements élégants et bien équipés, décorés avec goût dans un style artisanal chaleureux pour votre confort maximal.",
                color: "#7a9278"
              },
              {
                icon: Users,
                titre: "Services Personnalisés",
                description: "Cuisinier, chauffeur, sécurité - tous les services à votre disposition pour un séjour sans soucis.",
                color: "#cd9a51"
              },
              {
                icon: MapPin,
                titre: "Localisation Idéale",
                description: "Situé au cœur de Yaoundé, proche de tous les lieux d'intérêt et facilement accessible.",
                color: "#8b6f47"
              },
            ].map((feature, idx) => (
              <div 
                key={idx} 
                className="group relative p-8 bg-[#2d1f15] rounded-xl border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                {/* Decorative corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#cd9a51]/20 to-transparent rounded-bl-3xl rounded-tr-xl"></div>
                
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-lg flex items-center justify-center mb-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}30` }}
                >
                  <feature.icon size={28} style={{ color: feature.color }} />
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#cd9a51] mb-4">{feature.titre}</h3>
                <p className="text-[#f8f4ef]/80 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#3d2817] to-[#5c3d2e] text-[#f8f4ef]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">
            Prêt à Vivre l'Expérience L.M. Résidence ?
          </h2>
          <p className="text-lg text-[#f8f4ef]/80 mb-8 max-w-2xl mx-auto">
            Réservez dès maintenant et profitez de nos logements d'exception avec des services premium inclus.
          </p>
          <Link
            href="/reservation"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#cd9a51] hover:bg-[#b8944d] text-[#1a1612] font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            Réserver Votre Séjour
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
