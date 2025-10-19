"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("logements")
  const [logements, setLogements] = useState<any[]>([])
  const [services, setServices] = useState<any[]>([])

  const handleSeedData = async () => {
    try {
      const response = await fetch("/api/admin/seed", {
        method: "POST",
      })
      if (response.ok) {
        alert("Données seedées avec succès!")
      }
    } catch (error) {
      console.error("Error seeding data:", error)
    }
  }

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Panel</h1>
            <p className="text-lg opacity-90">Gestion des données (Développement)</p>
          </div>
        </section>

        {/* Admin Content */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-cream rounded-lg border border-border p-8">
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => setActiveTab("logements")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "logements"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Logements
                </button>
                <button
                  onClick={() => setActiveTab("services")}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === "services"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={handleSeedData}
                  className="px-6 py-2 rounded-lg font-medium bg-soft-green text-white hover:bg-soft-green/90 ml-auto"
                >
                  Seed Data
                </button>
              </div>

              <div className="text-foreground/80">
                <p className="mb-4">Cet espace admin permet de gérer les données JSON en développement.</p>
                <p className="mb-4">Les données sont stockées dans:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>
                    <code className="bg-background px-2 py-1 rounded">data/logements.json</code>
                  </li>
                  <li>
                    <code className="bg-background px-2 py-1 rounded">data/services.json</code>
                  </li>
                  <li>
                    <code className="bg-background px-2 py-1 rounded">data/sections.json</code>
                  </li>
                  <li>
                    <code className="bg-background px-2 py-1 rounded">data/news.json</code>
                  </li>
                </ul>
                <p className="mt-6 text-sm">
                  Pour une migration future vers Supabase, ces données peuvent être facilement importées dans une base
                  de données.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
