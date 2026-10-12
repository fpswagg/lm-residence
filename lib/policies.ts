/** Conditions de séjour (source: ancienne page Politiques). Partagées par /politiques et les pages logement. */
export const policies = [
  {
    id: "horaires",
    title: "Arrivée et départ",
    meta: "14:00 · 11:00",
    lines: ["Arrivée à partir de 14 h 00.", "Départ avant 11 h 00.", "Une arrivée plus tôt ou un départ plus tard peuvent s’arranger selon les disponibilités: écrivez-nous."],
  },
  {
    id: "annulation",
    title: "Annulation",
    meta: "Gratuite à J-7",
    lines: ["Gratuite jusqu’à 7 jours avant l’arrivée.", "50 % du séjour entre 7 et 3 jours avant l’arrivée.", "100 % du séjour à moins de 3 jours de l’arrivée."],
  },
  {
    id: "paiement",
    title: "Paiement",
    meta: "Acompte 30 %",
    lines: ["Un acompte de 30 % confirme la réservation.", "Le solde se règle à l’arrivée.", "Virement bancaire ou espèces."],
  },
  {
    id: "regles",
    title: "La vie de la maison",
    meta: "Calme après 22:00",
    lines: [
      "Le calme est de rigueur après 22 h 00.",
      "On ne fume pas à l’intérieur des logements.",
      "Les animaux de compagnie ne sont pas admis.",
      "Pas de fête ni de réunion sans accord préalable.",
      "Merci de prendre soin des lieux et des équipements.",
    ],
  },
  {
    id: "inclus",
    title: "Compris dans chaque séjour",
    meta: "Wi-Fi · ménage",
    lines: ["Wi-Fi haut débit.", "Climatisation.", "Ménage quotidien.", "Sécurité DAK 24 h/24.", "Une conciergerie pour vos demandes."],
  },
] as const
