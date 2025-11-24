"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Camera, Maximize2, Filter, X, ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import galleryData from "@/data/gallery.json"

const images = galleryData.images.map((i,x)=>({...i,id:x}));

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

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("tous")
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(images)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [imageLoading, setImageLoading] = useState<{ [key: number]: boolean }>({})
  const [isTransitioning, setIsTransitioning] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

  // Filter images based on category and search
  useEffect(() => {
    setIsTransitioning(true)
    let filtered = images

    // Filter by category
    if (selectedCategory !== "tous") {
      filtered = filtered.filter((img) => img.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (img) =>
          img.title.toLowerCase().includes(query) ||
          img.description.toLowerCase().includes(query)
      )
    }

    // Smooth scroll to gallery on filter change
    setTimeout(() => {
      galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 100)

    setTimeout(() => {
      setFilteredImages(filtered)
      setIsTransitioning(false)
    }, 200)
  }, [selectedCategory, searchQuery])

  const navigateImage = (direction: number) => {
    if (!selectedImage) return
    const currentIndex = filteredImages.findIndex((img) => img.id === selectedImage.id)
    const newIndex = currentIndex + direction
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setSelectedImage(filteredImages[newIndex])
    }
  }

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!selectedImage) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImage(null)
      } else if (e.key === "ArrowLeft") {
        navigateImage(-1)
      } else if (e.key === "ArrowRight") {
        navigateImage(1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "unset"
    }
  }, [selectedImage, filteredImages])

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image)
  }

  const handleImageLoad = (imageId: number) => {
    setImageLoading((prev) => ({ ...prev, [imageId]: false }))
  }

  const handleImageLoadStart = (imageId: number) => {
    setImageLoading((prev) => ({ ...prev, [imageId]: true }))
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
        <section className="py-20" ref={galleryRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#b8956a] size-5" />
                <input
                  type="text"
                  placeholder="Rechercher une image..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#2d1f15] border-2 border-[#5c3d2e] rounded-lg text-[#f8f4ef] placeholder-[#b8956a]/60 focus:outline-none focus:border-[#cd9a51] focus:ring-2 focus:ring-[#cd9a51]/20 transition-all duration-300"
                  aria-label="Rechercher dans la galerie"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#b8956a] hover:text-[#cd9a51] transition-colors"
                    aria-label="Effacer la recherche"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Filter className="text-[#cd9a51]" size={24} />
                  <h2 className="text-2xl font-serif font-bold text-[#cd9a51]">Filtrer par catégorie</h2>
                </div>
                {filteredImages.length > 0 && (
                  <div className="text-[#b8956a] font-medium">
                    {filteredImages.length} {filteredImages.length === 1 ? "image" : "images"}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {galleryData.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2 focus:ring-offset-[#1a1612] ${
                      selectedCategory === category.id
                        ? "bg-gradient-to-r from-[#cd9a51] to-[#b8956a] text-[#1a1612] shadow-lg scale-105"
                        : "bg-[#2d1f15] text-[#b8956a] border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:text-[#cd9a51] hover:scale-105"
                    }`}
                    aria-pressed={selectedCategory === category.id}
                    aria-label={`Filtrer par ${category.name}`}
                  >
                    {category.name} ({images.filter(i=>category.id==="tous"||i.category===category.id).length})
                  </button>
                ))}
              </div>
            </div>
            {/* Images Grid */}
            <div
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity duration-300 ${
                isTransitioning ? "opacity-50" : "opacity-100"
              }`}
            >
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => openLightbox(image)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      openLightbox(image)
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`Voir ${image.title} en grand format`}
                  className="group relative overflow-hidden rounded-2xl aspect-square bg-[#3d2817] border-2 border-[#5c3d2e] hover:border-[#cd9a51] hover:shadow-2xl transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2 focus:ring-offset-[#1a1612]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Decorative wood grain border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47] z-10"></div>
                  
                  {/* Loading skeleton */}
                  {imageLoading[image.id] && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#3d2817] z-20">
                      <Loader2 className="text-[#cd9a51] animate-spin size-8" />
                    </div>
                  )}
                  
                  <img
                    src={image.url}
                    alt={image.title}
                    loading="lazy"
                    onLoadStart={() => handleImageLoadStart(image.id)}
                    onLoad={() => handleImageLoad(image.id)}
                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                      imageLoading[image.id] ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  
                  {/* Overlay with gradient and content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <div className="transform translate-y-4 group-hover:translate-y-0 group-focus:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-serif font-bold text-2xl mb-2">
                          {image.title}
                        </h3>
                        <p className="text-[#ede8e0] text-sm mb-4 line-clamp-2">
                          {image.description}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 text-[#cd9a51] text-xs">
                            <Camera size={14} />
                            <span>Photo</span>
                          </div>
                          <div className="flex items-center gap-1 text-[#cd9a51] text-xs">
                            <Maximize2 size={14} />
                            <span>Cliquez pour agrandir</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#cd9a51]/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredImages.length === 0 && !isTransitioning && (
              <div className="text-center py-20 animate-fade-in">
                <div className="w-20 h-20 bg-[#3d2817] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Camera size={32} className="text-[#cd9a51]" />
                </div>
                <p className="text-xl text-[#b8956a] mb-4">
                  {searchQuery
                    ? "Aucune image ne correspond à votre recherche"
                    : "Aucune image dans cette catégorie"}
                </p>
                {(searchQuery || selectedCategory !== "tous") && (
                  <button
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("tous")
                    }}
                    className="mt-4 px-6 py-3 bg-[#cd9a51] text-[#1a1612] font-medium rounded-lg hover:bg-[#b8956a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2"
                  >
                    Réinitialiser les filtres
                  </button>
                )}
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

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-fade-in"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Vue agrandie de l'image"
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedImage(null)
            }}
            className="absolute top-4 right-4 z-10 p-3 bg-[#2d1f15] text-[#cd9a51] rounded-full hover:bg-[#cd9a51] hover:text-[#1a1612] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2"
            aria-label="Fermer la vue agrandie"
          >
            <X size={24} />
          </button>

          {/* Navigation buttons */}
          {filteredImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(-1)
                }}
                disabled={filteredImages.findIndex((img) => img.id === selectedImage.id) === 0}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-[#2d1f15] text-[#cd9a51] rounded-full hover:bg-[#cd9a51] hover:text-[#1a1612] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2"
                aria-label="Image précédente"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(1)
                }}
                disabled={
                  filteredImages.findIndex((img) => img.id === selectedImage.id) ===
                  filteredImages.length - 1
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-4 bg-[#2d1f15] text-[#cd9a51] rounded-full hover:bg-[#cd9a51] hover:text-[#1a1612] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#cd9a51] focus:ring-offset-2"
                aria-label="Image suivante"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          {/* Image container */}
          <div
            className="relative w-full h-full flex items-center justify-center p-4 md:p-8 overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-6xl flex flex-col items-center justify-center gap-6 py-8">
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.title}
                  className="max-w-full max-h-[calc(100vh-250px)] w-auto h-auto object-contain rounded-lg shadow-2xl"
                  style={{ maxHeight: 'calc(100vh - 250px)' }}
                />
              </div>
              <div className="text-center max-w-2xl px-4">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#cd9a51] mb-2">
                  {selectedImage.title}
                </h3>
                <p className="text-base md:text-lg text-[#f8f4ef]/80">{selectedImage.description}</p>
                <div className="mt-4 text-sm text-[#b8956a]">
                  {filteredImages.findIndex((img) => img.id === selectedImage.id) + 1} /{" "}
                  {filteredImages.length}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-[#b8956a]/60 text-center">
            <p>Utilisez les flèches pour naviguer • ESC pour fermer</p>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
