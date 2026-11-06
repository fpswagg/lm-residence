export type Logement = {
  id: string
  nom: string
  type: string
  description: string
  capacite: number | null
  surface: string
  prix: number
  devise: string
  disponibilite: boolean
  equipements: string[]
  images: string[]
}

export type Service = {
  id: string
  nom: string
  description: string
  details: string
  devise: string
  periode: string
}

export type GalleryImage = {
  id: number
  title: string
  description: string
  category: string
  url: string
}

export type Texte = { titre: string; sousTitre: string; texte: string }
export type Carte = { titre: string; description: string }
export type Regle = { titre: string; lignes: string[] }

export type Site = {
  contact: {
    phone: string
    email: string
    address: string
    facebook: string
    instagram: string
    twitter: string
  }
  logements: Logement[]
  services: Service[]
  galerie: GalleryImage[]
  categories: { id: string; name: string }[]
  textes: Record<string, Texte>
  atouts: Carte[]
  valeurs: Carte[]
  histoire: string[]
  regles: Regle[]
  annulation: string[]
  inclus: string[]
  horaires: { jours: string; heures: string }[]
  seo: { titre: string; description: string; motsCles: string[] }
}
