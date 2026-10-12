import { z } from "zod"

const phone = z
  .string()
  .trim()
  .max(30)
  .refine((v) => v.replace(/\D/g, "").length >= 8, "Numéro incomplet (8 chiffres au moins)")

export const contactSchema = z.object({
  nom: z.string().trim().min(2, "Votre nom, s’il vous plaît").max(120),
  email: z.string().trim().email("Adresse e-mail invalide").max(200),
  telephone: z.union([z.literal(""), phone]).optional(),
  message: z.string().trim().min(10, "Quelques mots de plus (10 caractères au moins)").max(4000),
  site: z.string().max(0).optional(),
})
export type ContactInput = z.infer<typeof contactSchema>

const day = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date invalide")

export const reservationSchema = z
  .object({
    nom: z.string().trim().min(2, "Votre nom, s’il vous plaît").max(120),
    email: z.string().trim().email("Adresse e-mail invalide").max(200),
    telephone: phone,
    logement: z.string().trim().min(1, "Choisissez un logement").max(80),
    dateArrivee: day,
    dateDepart: day,
    nombrePersonnes: z.coerce.number().int().min(1).max(10),
    message: z.string().trim().max(4000).optional().default(""),
    site: z.string().max(0).optional(),
  })
  .refine((v) => v.dateDepart > v.dateArrivee, { message: "Le départ doit suivre l’arrivée", path: ["dateDepart"] })
export type ReservationInput = z.infer<typeof reservationSchema>

/** Erreurs zod → { champ: premier message }. */
export const fieldErrors = (e: z.ZodError) => {
  const out: Record<string, string> = {}
  for (const i of e.issues) {
    const k = String(i.path[0] ?? "form")
    out[k] ??= i.message
  }
  return out
}
