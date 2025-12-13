// services/gmailMail.js
import { google } from "googleapis";
import { getMatches } from "./matches.js";
import env from "../config/env.js";

// OAuth2 config
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  env.GMAIL_CLIENT_ID,
  env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: env.GMAIL_REFRESH_TOKEN,
});

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

export const sendMatchesEmail = async (toEmail) => {
  try {
    // Fecha de mañana en formato YYYYMMDD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fecha = tomorrow.toISOString().split("T")[0].replace(/-/g, "");

    // Obtener los partidos
    const data = await getMatches(fecha, env.CHECKS);

    if (!data || !data.result) {
      console.log("No hay partidos, no se envía email");
      return;
    }

    // Extraer año, mes y día
    const ano = fecha.slice(0, 4);
    const mes = fecha.slice(4, 6);
    const dia = fecha.slice(6, 8);
    const fechaFormateada = `${dia}/${mes}/${ano}`;

    // HTML (se mantiene igual)
    let html = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin:0 auto; padding:20px; background-color:#f9f9f9; border-radius:10px;">
      <h2 style="text-align:center; color:#627AAD;">PRINCIPALES LIGAS</h2>
      ${Object.entries(data.result).map(([liga, info]) => `
        <div style="margin-top:20px; padding:10px; background-color:#fff; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);">
          <h3 style="display:flex; align-items:center; color:#1E90FF;padding: 6px;background-color:#ccc;">
            <img src="https://images.fotmob.com/image_resources/logo/teamlogo/${info.flag}" width="20" height="20" style="margin:1px 7px 0 0;">
            <span>${liga}</span>
          </h3>
          <table style="width:100%; border-collapse: collapse; font-size:14px;">
            <thead>
              <tr>
                <th style="text-align:left; padding:5px; border-bottom:1px solid #ccc;">Local</th>
                <th style="text-align:center; padding:5px; border-bottom:1px solid #ccc;">vs</th>
                <th style="text-align:left; padding:5px; border-bottom:1px solid #ccc;">Visitante</th>
                <th style="text-align:right; padding:5px; border-bottom:1px solid #ccc;">Hora</th>
              </tr>
            </thead>
            <tbody>
              ${info.matches.map(match => {
                const start = new Date(match.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return `
                  <tr>
                    <td style="padding:8px;">${match.home}</td>
                    <td style="padding:8px; text-align:center;">vs</td>
                    <td style="padding:8px;">${match.away}</td>
                    <td style="padding:8px; text-align:right;">${start}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      `).join("")}
      <p style="text-align:center; font-size:12px; color:#999; margin-top:20px;">
        Este correo se envía automáticamente desde Football Live.
      </p>
    </div>`;


    const subject = `Partidos de mañana: ${fechaFormateada}`;

    // Codificar el asunto en Base64 para UTF-8
    const encodedSubject = `=?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`;

    // Construcción del email (RFC 2822)
    const messageParts = [
      `To: ${toEmail}`,
      `From: Football Live <${env.GMAIL_USER}>`,
      `Subject: ${encodedSubject}`,
      "MIME-Version: 1.0",
      "Content-Type: text/html; charset=utf-8",
      "",
      html,
    ];

    const message = messageParts.join("\n");

    const encodedMessage = Buffer
      .from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Correo enviado con Gmail API ✅");

  } catch (err) {
    console.error("Error enviando email ❌", err);
  }
}