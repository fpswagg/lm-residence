"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ReservationPage() {
  const searchParams = useSearchParams()
  const logementId = searchParams.get("logement")

  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    logement: logementId || "",
    dateArrivee: "",
    dateDepart: "",
    nombrePersonnes: "1",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({
          nom: "",
          email: "",
          telephone: "",
          logement: logementId || "",
          dateArrivee: "",
          dateDepart: "",
          nombrePersonnes: "1",
          message: "",
        })
        setTimeout(() => setSubmitted(false), 5000)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-b from-[#f8f4ef] to-[#ede8e0]">
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
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">Réservation</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              Réservez votre séjour à L.M. Résidence en quelques clics. Nous vous contacterons rapidement pour confirmer votre réservation.
            </p>
          </div>
        </section>

        {/* Reservation Form - Enhanced */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {submitted && (
              <div className="mb-8 p-6 bg-[#7a9278]/10 border-2 border-[#7a9278] text-[#4a6741] rounded-xl flex items-center gap-4 shadow-lg">
                <div className="w-12 h-12 rounded-full bg-[#7a9278] flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-bold text-lg mb-1">Demande de réservation envoyée avec succès!</p>
                  <p className="text-sm">Nous vous contacterons bientôt pour confirmer les détails de votre séjour.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 md:p-10 border-2 border-[#d4c5b0] shadow-2xl">
              {/* Decorative wood grain border */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8b6f47] via-[#cd9a51] to-[#8b6f47] rounded-t-2xl"></div>
              
              <h2 className="text-3xl font-serif font-bold text-[#5c3d2e] mb-8 flex items-center gap-3">
                <span className="w-2 h-8 bg-[#cd9a51]"></span>
                Détails de Votre Réservation
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Nom Complet <span className="text-[#cd9a51]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Email <span className="text-[#cd9a51]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Téléphone <span className="text-[#cd9a51]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    placeholder="+237 XXX XXX XXX"
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Type de Logement <span className="text-[#cd9a51]">*</span>
                  </label>
                  <select
                    name="logement"
                    value={formData.logement}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  >
                    <option value="">Sélectionner un logement</option>
                    <option value="1">Studio Confort</option>
                    <option value="2">Studio Premium</option>
                    <option value="3">Studio Deluxe</option>
                    <option value="4">Chambre Individuelle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Date d'Arrivée <span className="text-[#cd9a51]">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateArrivee"
                    value={formData.dateArrivee}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Date de Départ <span className="text-[#cd9a51]">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateDepart"
                    value={formData.dateDepart}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                    Nombre de Personnes <span className="text-[#cd9a51]">*</span>
                  </label>
                  <select
                    name="nombrePersonnes"
                    value={formData.nombrePersonnes}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                  >
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4 personnes</option>
                  </select>
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                  Message Supplémentaire
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all resize-none"
                  placeholder="Demandes spéciales, services additionnels, allergies alimentaires, etc."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] font-bold rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] text-lg"
              >
                Confirmer la Réservation
              </button>
              
              <p className="text-xs text-[#8b6f47] text-center mt-4">
                Après soumission, nous vous contacterons dans les 24h pour confirmer votre réservation
              </p>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
