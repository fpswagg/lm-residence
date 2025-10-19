"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState } from "react"
import { Mail, Phone, MapPin } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitted(true)
        setFormData({ nom: "", email: "", telephone: "", message: "" })
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
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#cd9a51] rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="h-1 w-20 bg-[#cd9a51]"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-center">Nous Contacter</h1>
            <p className="text-lg text-[#ede8e0] text-center max-w-2xl mx-auto">
              Nous sommes à votre écoute pour toute question ou demande d'information
            </p>
          </div>
        </section>

        {/* Contact Section - Enhanced */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info - Enhanced */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#5c3d2e] mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#cd9a51]"></span>
                  Informations de Contact
                </h2>

                <div className="space-y-6 mb-12">
                  <a 
                    href={`tel:${process.env.NEXT_PUBLIC_PHONE!.replaceAll(" ", "")}`}
                    className="group flex gap-4 p-5 bg-white rounded-xl border-2 border-[#d4c5b0] hover:border-[#cd9a51] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7a9278]/20 to-[#cd9a51]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Phone className="text-[#7a9278]" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#5c3d2e] mb-1">Téléphone</p>
                      <p className="text-[#8b6f47]">{process.env.NEXT_PUBLIC_PHONE}</p>
                      <p className="text-xs text-[#8b6f47]/70 mt-1">Disponible 24/7</p>
                    </div>
                  </a>

                  <a 
                    href={`mailto:${process.env.NEXT_PUBLIC_EMAIL}`}
                    className="group flex gap-4 p-5 bg-white rounded-xl border-2 border-[#d4c5b0] hover:border-[#cd9a51] hover:shadow-lg transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#cd9a51]/20 to-[#8b6f47]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Mail className="text-[#cd9a51]" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#5c3d2e] mb-1">Email</p>
                      <p className="text-[#8b6f47]">{process.env.NEXT_PUBLIC_EMAIL}</p>
                      <p className="text-xs text-[#8b6f47]/70 mt-1">Réponse sous 24h</p>
                    </div>
                  </a>

                  <div className="group flex gap-4 p-5 bg-white rounded-xl border-2 border-[#d4c5b0] hover:border-[#cd9a51] hover:shadow-lg transition-all duration-300">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8b6f47]/20 to-[#7a9278]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="text-[#8b6f47]" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-[#5c3d2e] mb-1">Adresse</p>
                      <p className="text-[#8b6f47]">{process.env.NEXT_PUBLIC_ADDRESS}</p>
                      <p className="text-xs text-[#8b6f47]/70 mt-1">Quartier résidentiel</p>
                    </div>
                  </div>
                </div>

                {/* Horaires - Enhanced */}
                <div className="p-8 bg-gradient-to-br from-[#5c3d2e] to-[#8b6f47] rounded-2xl text-[#f8f4ef] border-2 border-[#d4c5b0] shadow-lg">
                  <h3 className="text-xl font-serif font-bold mb-6">Horaires d'Ouverture</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-3 border-b border-[#f8f4ef]/20">
                      <span className="text-[#ede8e0]">Lundi - Vendredi</span>
                      <span className="font-semibold">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-[#f8f4ef]/20">
                      <span className="text-[#ede8e0]">Samedi</span>
                      <span className="font-semibold">09:00 - 14:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#ede8e0]">Dimanche</span>
                      <span className="font-semibold">Fermé</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form - Enhanced */}
              <div>
                <h2 className="text-3xl font-serif font-bold text-[#5c3d2e] mb-8 flex items-center gap-3">
                  <span className="w-2 h-8 bg-[#cd9a51]"></span>
                  Formulaire de Contact
                </h2>

                {submitted && (
                  <div className="mb-6 p-5 bg-[#7a9278]/10 border-2 border-[#7a9278] text-[#4a6741] rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#7a9278] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold">Message envoyé avec succès!</p>
                      <p className="text-sm">Nous vous répondrons dans les plus brefs délais.</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border-2 border-[#d4c5b0] shadow-lg">
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
                      placeholder="Votre nom"
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
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleChange}
                      placeholder="+237 XXX XXX XXX"
                      className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#5c3d2e] mb-2">
                      Message <span className="text-[#cd9a51]">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Votre message..."
                      className="w-full px-4 py-3 border-2 border-[#d4c5b0] rounded-lg bg-[#f8f4ef] text-[#5c3d2e] placeholder:text-[#8b6f47]/50 focus:outline-none focus:ring-2 focus:ring-[#7a9278] focus:border-[#7a9278] transition-all resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#5c3d2e] to-[#8b6f47] text-[#f8f4ef] font-semibold rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Mail size={20} />
                    Envoyer le Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
