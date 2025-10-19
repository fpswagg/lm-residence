"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Check, Users, Maximize2, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"

interface Logement {
  id: number
  nom: string
  type: string
  description: string
  capacite: number
  surface: string
  prix: number
  devise: string
  disponibilite: boolean
  equipements: string[]
  images: string[]
}

export default function LogementsPage() {
  const [logements, setLogements] = useState<Logement[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({})

  useEffect(() => {
    fetch("/api/logements")
      .then((res) => res.json())
      .then((data) => {
        setLogements(data)
        // Initialize current image index for each logement
        const initialIndexes: { [key: number]: number } = {}
        data.forEach((logement: Logement) => {
          initialIndexes[logement.id] = 0
        })
        setCurrentImageIndex(initialIndexes)
      })
  }, [])

  const nextImage = (logementId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [logementId]: (prev[logementId] + 1) % totalImages,
    }))
  }

  const prevImage = (logementId: number, totalImages: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [logementId]: (prev[logementId] - 1 + totalImages) % totalImages,
    }))
  }

  const goToImage = (logementId: number, index: number) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [logementId]: index,
    }))
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-[#1a1612] to-[#2d1f15]">
        {/* Header - Enhanced */}
        <section className="relative bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-[#cd9a51]"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">Nos Logements</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              Découvrez notre sélection de studios et chambres haut de gamme, décorés avec goût dans un style artisanal chaleureux
            </p>
          </div>
        </section>

        {/* Logements Grid - Enhanced */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              {logements.map((logement, index) => (
                <div
                  key={logement.id}
                  className="group relative bg-[#2d1f15] rounded-2xl overflow-hidden border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Decorative wood grain border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47]"></div>

                  {/* Image Carousel */}
                  <div className="relative h-72 bg-[#3d2817] overflow-hidden group/carousel">
                    {/* Current Image */}
                    <img
                      src={logement.images[currentImageIndex[logement.id] || 0] || "/placeholder.svg"}
                      alt={`${logement.nom} - Image ${(currentImageIndex[logement.id] || 0) + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Navigation Buttons */}
                    {logement.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            prevImage(logement.id, logement.images.length)
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1612]/80 hover:bg-[#cd9a51] text-[#f8f4ef] rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                          aria-label="Image précédente"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            nextImage(logement.id, logement.images.length)
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1a1612]/80 hover:bg-[#cd9a51] text-[#f8f4ef] rounded-full flex items-center justify-center opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                          aria-label="Image suivante"
                        >
                          <ChevronRight size={20} />
                        </button>
                      </>
                    )}
                    
                    {/* Image Indicators */}
                    {logement.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {logement.images.map((_, imgIndex) => (
                          <button
                            key={imgIndex}
                            onClick={(e) => {
                              e.preventDefault()
                              goToImage(logement.id, imgIndex)
                            }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              imgIndex === (currentImageIndex[logement.id] || 0)
                                ? "bg-[#cd9a51] w-6"
                                : "bg-[#f8f4ef]/50 hover:bg-[#f8f4ef]/80"
                            }`}
                            aria-label={`Aller à l'image ${imgIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Image Counter */}
                    {logement.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-[#1a1612]/80 text-[#f8f4ef] px-3 py-1 rounded-lg text-xs font-medium">
                        {(currentImageIndex[logement.id] || 0) + 1} / {logement.images.length}
                      </div>
                    )}
                    
                    {logement.disponibilite && (
                      <div className="absolute top-4 right-20 flex items-center gap-2 bg-[#7a9278] text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
                        <Sparkles size={16} />
                        Disponible
                      </div>
                    )}
                    
                    {/* Type badge */}
                    <div className="absolute top-4 left-4 bg-[#2d1f15]/95 text-[#cd9a51] px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase">
                      {logement.type}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-3xl font-serif font-bold text-[#cd9a51] mb-3 group-hover:text-[#b8956a] transition-colors">
                      {logement.nom}
                    </h3>
                    <p className="text-[#f8f4ef]/80 mb-6 leading-relaxed">{logement.description}</p>

                    {/* Details - Enhanced */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-4 bg-[#3d2817] rounded-lg border border-[#5c3d2e]">
                        <div className="w-10 h-10 rounded-lg bg-[#7a9278]/30 flex items-center justify-center">
                          <Users size={20} className="text-[#7a9278]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#b8956a] font-medium">Capacité</p>
                          <p className="text-[#f8f4ef] font-semibold">{logement.capacite} pers.</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-[#3d2817] rounded-lg border border-[#5c3d2e]">
                        <div className="w-10 h-10 rounded-lg bg-[#cd9a51]/30 flex items-center justify-center">
                          <Maximize2 size={20} className="text-[#cd9a51]" />
                        </div>
                        <div>
                          <p className="text-xs text-[#b8956a] font-medium">Surface</p>
                          <p className="text-[#f8f4ef] font-semibold">{logement.surface}</p>
                        </div>
                      </div>
                    </div>

                    {/* Equipements - Enhanced */}
                    <div className="mb-6">
                      <p className="text-[#cd9a51] font-semibold text-sm mb-4 flex items-center gap-2">
                        <span className="w-6 h-0.5 bg-[#cd9a51]"></span>
                        Équipements Inclus
                      </p>
                      <ul className="grid grid-cols-1 gap-2">
                        {logement.equipements.slice(0, 4).map((eq, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-[#f8f4ef]/80">
                            <div className="w-5 h-5 rounded-full bg-[#7a9278]/30 flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-[#7a9278]" />
                            </div>
                            {eq}
                          </li>
                        ))}
                      </ul>
                      {logement.equipements.length > 4 && (
                        <p className="text-xs text-[#b8956a] mt-2 ml-8">
                          +{logement.equipements.length - 4} autres équipements
                        </p>
                      )}
                    </div>

                    {/* Price and CTA - Enhanced */}
                    <div className="flex items-center justify-between pt-6 border-t-2 border-[#5c3d2e]">
                      <div>
                        <p className="text-[#b8956a] text-sm font-medium mb-1">À partir de</p>
                        <p className="text-3xl font-serif font-bold text-[#cd9a51]">
                          {logement.prix.toLocaleString()}{" "}
                          <span className="text-lg text-[#b8956a]">{logement.devise}</span>
                        </p>
                        <p className="text-xs text-[#b8956a]">par nuit</p>
                      </div>
                      <Link
                        href={`/reservation?logement=${logement.id}`}
                        className="px-6 py-3 bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] font-medium rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                      >
                        Réserver
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state if no logements */}
            {logements.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#3d2817] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={32} className="text-[#cd9a51]" />
                </div>
                <p className="text-xl text-[#b8956a]">Chargement des logements...</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
