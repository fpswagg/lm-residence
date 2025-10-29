"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChefHat, Car, Shield, Sparkles, Shirt } from "lucide-react"
import services from "@/data/services.json"

interface Service {
  id: number
  nom: string
  description: string
  details: string
  prix: number
  devise: string
  periode: string
  options: string[]
}

const serviceIcons: { [key: string]: any } = {
  "chef": ChefHat,
  "Blanchisserie": Shirt,
  "Chauffeur": Car,
  "Sécurité": Shield,
  "default": Sparkles
}

export default function ServicesPage() {
  const router = useRouter();
  const whatsappUrl = `https://wa.me/${process.env.NEXT_PUBLIC_PHONE!.replace("+", "").replaceAll(" ","")}`;

  const getServiceIcon = (serviceName: string) => {
    for (const key in serviceIcons) {
      if (serviceName.includes(key)) {
        return serviceIcons[key]
      }
    }
    return serviceIcons.default
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-[#f8f4ef] to-[#ede8e0]">
        {/* Header - Enhanced */}
        <section className="relative bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-[#cd9a51]"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">Nos Services</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              Des services premium conçus avec soin pour enrichir votre séjour et vous offrir une expérience exceptionnelle
            </p>
          </div>
        </section>

        {/* Services - Enhanced */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {services.map((service, index) => {
                const Icon = getServiceIcon(service.nom)
                return (
                  <div
                    key={service.id}
                    className="group relative bg-white rounded-b-2xl p-8 md:p-10 border-2 border-[#d4c5b0] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Decorative wood grain border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47]"></div>
                    
                    {/* Decorative corner accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#cd9a51]/10 to-transparent rounded-bl-3xl rounded-tr-2xl"></div>

                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Icon Section */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7a9278]/20 to-[#cd9a51]/20 flex items-center justify-center border-2 border-[#d4c5b0] group-hover:scale-110 transition-transform duration-300">
                          <Icon size={36} className="text-[#5c3d2e]" />
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="flex-1">
                        <h3 className="text-3xl font-serif font-bold text-[#5c3d2e] mb-3 group-hover:text-[#8b6f47] transition-colors">
                          {service.nom}
                        </h3>
                        <p className="text-[#8b6f47] text-lg mb-3 font-medium">{service.description}</p>
                        <p className="text-[#5c3d2e]/70 mb-6 leading-relaxed">{service.details}</p>

                        {/* Price and CTA - Enhanced */}
                        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-6 border-t-2 border-[#d4c5b0] gap-4">
                          {/* {service.prix && <div>
                            <p className="text-[#8b6f47] text-sm font-medium mb-1">{service.periode}</p>
                            <p className="text-3xl font-serif font-bold text-[#5c3d2e]">
                              {service.prix.toLocaleString()}{" "}
                              <span className="text-lg text-[#8b6f47]">{service.devise}</span>
                            </p>
                          </div>} */}
                          <div className="flex-1 flex justify-end">
                            <button onClick={()=>router.push(whatsappUrl)} className="cursor-pointer px-8 py-3 bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] font-medium rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105 whitespace-nowrap">
                              {/* {service.prix ? "Demander ce Service" : "Discuter avec nous"} */}Discuter avec nous
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Empty state */}
            {services.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#ede8e0] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={32} className="text-[#8b6f47]" />
                </div>
                <p className="text-xl text-[#8b6f47]">Aucun service disponible</p>
              </div>
            )}
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-serif font-bold mb-4">Besoin d'un Service Personnalisé ?</h2>
            <p className="text-lg text-[#ede8e0] mb-8">
              Contactez-nous pour discuter de vos besoins spécifiques. Nous sommes là pour rendre votre séjour parfait.
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[#cd9a51] hover:bg-[#b8944d] text-[#2d1f15] font-bold rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Nous Contacter
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
