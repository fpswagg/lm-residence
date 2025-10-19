"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Camera, Maximize2, Filter } from "lucide-react"
import { useState, useEffect } from "react"

interface GalleryImage {
  id: number
  title: string
  description: string
  category: string
  url: string
}

interface Category {
  id: string
  name: string
  count: number
}

interface GalleryData {
  images: GalleryImage[]
  categories: Category[]
}

export default function GalleryPage() {
  const [galleryData, setGalleryData] = useState<GalleryData>({ images: [], categories: [] })
  const [selectedCategory, setSelectedCategory] = useState<string>("tous")
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        setGalleryData(data)
        setFilteredImages(data.images)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error loading gallery:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (selectedCategory === "tous") {
      setFilteredImages(galleryData.images)
    } else {
      setFilteredImages(galleryData.images.filter((img) => img.category === selectedCategory))
    }
  }, [selectedCategory, galleryData.images])

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-[#1a1612] to-[#2d1f15]">
        {/* Header - Enhanced */}
        <section className="relative bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] py-20 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7a9278] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-[#cd9a51]"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">Galerie</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              Découvrez les espaces élégants et chaleureux de L.M. Résidence à travers notre galerie photo
            </p>
          </div>
        </section>

        {/* Gallery Grid - Enhanced */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Category Filters */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Filter className="text-[#cd9a51]" size={24} />
                <h2 className="text-2xl font-serif font-bold text-[#cd9a51]">Filtrer par catégorie</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {galleryData.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] shadow-lg scale-105"
                        : "bg-[#2d1f15] text-[#b8956a] border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:text-[#cd9a51]"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#3d2817] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Camera size={32} className="text-[#cd9a51]" />
                </div>
                <p className="text-xl text-[#b8956a]">Chargement de la galerie...</p>
              </div>
            )}

            {/* Images Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-2xl aspect-square bg-[#3d2817] border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-500 cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Decorative wood grain border */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47] z-10"></div>
                    
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    
                    {/* Overlay with gradient and content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          <h3 className="text-white font-serif font-bold text-2xl mb-2">
                            {image.title}
                          </h3>
                          <p className="text-[#ede8e0] text-sm mb-4">
                            {image.description}
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 text-[#cd9a51] text-xs">
                              <Camera size={14} />
                              <span>Photo</span>
                            </div>
                            <div className="flex items-center gap-1 text-[#cd9a51] text-xs">
                              <Maximize2 size={14} />
                              <span>Voir en grand</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Corner accent */}
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#cd9a51]/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filteredImages.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-[#3d2817] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera size={32} className="text-[#cd9a51]" />
                </div>
                <p className="text-xl text-[#b8956a]">Aucune image dans cette catégorie</p>
              </div>
            )}

            {/* Call to action */}
            <div className="mt-16 text-center p-10 bg-[#2d1f15] rounded-2xl border-2 border-[#5c3d2e] shadow-2xl">
              <h2 className="text-3xl font-serif font-bold text-[#cd9a51] mb-4">
                Envie de Découvrir Nos Espaces en Personne ?
              </h2>
              <p className="text-[#f8f4ef]/80 mb-8 max-w-2xl mx-auto text-lg">
                Réservez une visite ou contactez-nous pour plus d'informations sur nos logements et services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/reservation"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] font-bold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Réserver Maintenant
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#cd9a51] text-[#cd9a51] font-bold rounded-lg hover:bg-[#cd9a51] hover:text-[#1a1612] transition-all duration-300"
                >
                  Nous Contacter
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
