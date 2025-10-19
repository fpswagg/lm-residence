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

export async function contact_us(
  name: string,
  email: string,
  telephone: string|null|undefined,
  message: string
) {
  return await transporter.sendMail({
    from: user,
    to: devEmail,
    subject: "Message de L.M. Résidence",
    text: `
Nouveau message de ${name}

Nom : ${name}
Email : ${email}
${telephone&&`
  Telephone : ${telephone}`}Message : 
${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #1976d2;">Nouveau message de ${name}</h2>
        <p><strong>Email :</strong> ${email}</p>
        <hr style="margin: 20px 0;">
        ${telephone&&`<p><strong>Telephone :</strong> ${telephone}</p>`}
        <p><strong>Message :</strong></p>
        <p style="margin-left: 16px;">${message}</p>
      </div>
    `,
  });
}

export async function reservation(
  nom: string,
  email: string,
  telephone: string,
  logement: string,
  dateArrivee: string,
  dateDepart: string,
  nombrePersonnes: string,
  message: string|null|undefined
) {
  return await transporter.sendMail({
    from: user,
    to: devEmail,
    subject: "Nouvelle réservation de L.M. Résidence",
    text: `
Nouvelle réservation

Nom : ${nom}
Email : ${email}
Téléphone : ${telephone}
Logement : ${logement}
Date d'arrivée : ${dateArrivee}
Date de départ : ${dateDepart}
Nombre de personnes : ${nombrePersonnes}
${message&&`
Message : 
${message}`}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2 style="color: #1976d2;">Nouvelle réservation L.M. Résidence</h2>
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Téléphone :</strong> ${telephone}</p>
        <p><strong>Logement :</strong> ${logement}</p>
        <p><strong>Date d'arrivée :</strong> ${dateArrivee}</p>
        <p><strong>Date de départ :</strong> ${dateDepart}</p>
        <p><strong>Nombre de personnes :</strong> ${nombrePersonnes}</p>
        <hr style="margin: 20px 0;">
        ${message&&`
        <p><strong>Message :</strong></p>
        <p style="margin-left: 16px;">${message}</p>
        `}
      </div>
    `,
  });
}
