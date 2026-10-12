import { Hero } from "@/components/home/hero"
import { Manifesto } from "@/components/home/manifesto"
import { Marquee } from "@/components/home/marquee"
import { Rooms } from "@/components/home/rooms"
import { Journee } from "@/components/home/journee"
import { GaleriePreview } from "@/components/home/galerie-preview"
import { Adresse } from "@/components/home/adresse"
import { logements, minPrice, fcfa } from "@/lib/logements"
import { photo } from "@/lib/photos"

// Affichage des prix: en attente de la réponse du propriétaire (§8). Par défaut, affichés.
const SHOW_PRICES = true

export default function Home() {
  return (
    <>
      <Hero photo={photo("salle-a-manger-ac")} />
      <Manifesto
        pills={[photo("escalier"), photo("table-jp"), photo("applique")]}
        stats={[
          { value: "04", label: "logements" },
          { value: "24/7", label: "sécurité DAK" },
          { value: "1", label: "chef sur place" },
          { value: SHOW_PRICES ? fcfa(minPrice).replace(" FCFA", "") : "—", label: SHOW_PRICES ? "FCFA / nuit, à partir de" : "tarifs sur demande" },
        ]}
      />
      <Marquee
        words={["Sécurité DAK 24/7", "Cuisinier sur place", "Véhicule avec chauffeur", "Climatisation", "Wi-Fi", "Canal+", "Blanchisserie"]}
      />
      <Rooms rooms={logements} showPrices={SHOW_PRICES} />
      <Journee
        moments={[
          { time: "07:00", title: "Le petit-déjeuner", text: "Le chef de la maison prépare le repas du matin, servi chez vous ou à la table commune.", photo: photo("table-jp") },
          { time: "11:00", title: "Le chauffeur", text: "Un véhicule avec chauffeur pour vos rendez-vous, vos courses ou l’aéroport.", photo: photo("facade-2") },
          { time: "18:00", title: "Le linge", text: "Blanchisserie et entretien: vous rentrez, la chambre est faite, le linge est plié.", photo: photo("chambre-marie") },
          { time: "23:00", title: "La veille", text: "Les agents de DAK Sécurité gardent la maison jour et nuit. Dormez tranquille.", photo: photo("applique") },
        ]}
      />
      <GaleriePreview photos={[photo("escalier"), photo("sculptures"), photo("salon-jp"), photo("comptoir"), photo("palmier")]} />
      <Adresse photo={photo("facade")} />
    </>
  )
}
