import "server-only";
import nodemailer from "nodemailer";

export const user = process.env.MAILER_USER!;
export const pass = process.env.MAILER_PASS!;

export const devEmail = process.env.MAILER_RECEIVER!;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user,
    pass,
  },
  from: user,
  tls: {
    rejectUnauthorized: false,
  },
});

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!)
const nl2br = (v: string) => esc(v).replace(/\n/g, "<br>")
const row = (k: string, v: string) => `<p style="margin:4px 0"><strong>${k} :</strong> ${esc(v)}</p>`
const frame = (title: string, body: string) => `
  <div style="font-family: Georgia, serif; color: #15110d; background: #f3ede3; padding: 24px;">
    <h2 style="font-weight: normal; margin: 0 0 16px;">${esc(title)}</h2>
    ${body}
  </div>`

export async function contact_us(name: string, email: string, telephone: string | null | undefined, message: string) {
  const text = [`Nouveau message de ${name}`, "", `Nom : ${name}`, `Email : ${email}`, telephone ? `Téléphone : ${telephone}` : null, "", "Message :", message]
    .filter((l) => l !== null)
    .join("\n")
  const html = frame(
    `Nouveau message de ${name}`,
    `${row("Email", email)}${telephone ? row("Téléphone", telephone) : ""}<hr style="border:0;border-top:1px solid #ccc;margin:16px 0"><p>${nl2br(message)}</p>`,
  )
  return await transporter.sendMail({ from: user, to: devEmail, replyTo: email, subject: "Message de L.M. Résidence", text, html })
}

export async function reservation(
  nom: string,
  email: string,
  telephone: string,
  logement: string,
  dateArrivee: string,
  dateDepart: string,
  nombrePersonnes: string,
  message: string | null | undefined,
) {
  const rows: [string, string][] = [
    ["Nom", nom],
    ["Email", email],
    ["Téléphone", telephone],
    ["Logement", logement],
    ["Arrivée", dateArrivee],
    ["Départ", dateDepart],
    ["Personnes", nombrePersonnes],
  ]
  const text = ["Nouvelle demande de réservation", "", ...rows.map(([k, v]) => `${k} : ${v}`), ...(message ? ["", "Message :", message] : [])].join("\n")
  const html = frame(
    "Nouvelle demande de réservation",
    rows.map(([k, v]) => row(k, v)).join("") + (message ? `<hr style="border:0;border-top:1px solid #ccc;margin:16px 0"><p>${nl2br(message)}</p>` : ""),
  )
  return await transporter.sendMail({ from: user, to: devEmail, replyTo: email, subject: `Réservation ${logement} · ${dateArrivee} → ${dateDepart}`, text, html })
}
