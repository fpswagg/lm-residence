"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function PoliciesPage() {
  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-background">
        {/* Header */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4">Politiques & Horaires</h1>
            <p className="text-lg opacity-90">Informations importantes pour votre séjour</p>
          </div>
        </section>

        {/* Policies Content */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {/* Check-in/Check-out */}
              <div className="bg-cream rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Horaires d'Arrivée et de Départ</h2>
                <div className="space-y-3 text-foreground/80">
                  <p>
                    <strong>Check-in:</strong> À partir de 14h00
                  </p>
                  <p>
                    <strong>Check-out:</strong> Avant 11h00
                  </p>
                  <p className="text-sm">
                    Des arrangements spéciaux peuvent être faits selon la disponibilité. Veuillez nous contacter.
                  </p>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="bg-cream rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Politique d'Annulation</h2>
                <div className="space-y-3 text-foreground/80">
                  <p>• Annulation gratuite jusqu'à 7 jours avant l'arrivée</p>
                  <p>• 50% de frais d'annulation entre 3 et 7 jours</p>
                  <p>• 100% de frais d'annulation moins de 3 jours avant l'arrivée</p>
                </div>
              </div>

              {/* House Rules */}
              <div className="bg-cream rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Règles de la Résidence</h2>
                <div className="space-y-3 text-foreground/80">
                  <p>• Respecter le calme après 22h00</p>
                  <p>• Pas de fumer à l'intérieur des logements</p>
                  <p>• Les animaux de compagnie ne sont pas autorisés</p>
                  <p>• Respecter les installations et équipements</p>
                  <p>• Pas de fêtes ou réunions sans autorisation préalable</p>
                </div>
              </div>

              {/* Payment Terms */}
              <div className="bg-cream rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Conditions de Paiement</h2>
                <div className="space-y-3 text-foreground/80">
                  <p>• Acompte de 30% requis à la réservation</p>
                  <p>• Solde à payer à l'arrivée</p>
                  <p>• Nous acceptons les virements bancaires et les paiements en espèces</p>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-cream rounded-lg p-8 border border-border">
                <h2 className="text-2xl font-serif font-bold text-primary mb-4">Services Inclus</h2>
                <div className="space-y-3 text-foreground/80">
                  <p>• WiFi haute vitesse gratuit</p>
                  <p>• Climatisation</p>
                  <p>• Nettoyage quotidien</p>
                  <p>• Accès à la sécurité 24h/24</p>
                  <p>• Assistance concierge</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
