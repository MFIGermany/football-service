import Mailgun from "mailgun.js";
import formData from "form-data";
import { getMatches } from "./matches.js";
import env from "../config/env.js";

const mailgun = new Mailgun(formData);
const mg = mailgun.client({ 
  username: "api", 
  key: env.MAILGUN_API_KEY, 
  url: "https://api.mailgun.net" 
});

export const sendMatchesEmail = async (toEmail) => {
  try {
    // Fecha de mañana en formato YYYYMMDD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fecha = tomorrow.toISOString().split("T")[0].replace(/-/g, "");

    // Llamamos a getMatches usando los checks directamente del .env
    const data = await getMatches(fecha, env.CHECKS);
    
    let html = `
      <h2 style="font-family: sans-serif;">Partidos para ${fecha}</h2>
    `;

    Object.entries(data.result).forEach(([liga, info]) => {
      html += `
        <h3 style="font-family: sans-serif; color:#1E90FF;">
          <img src="https://www.football-live.it.com/static/flags/${info.flag}" width="20" style="vertical-align: middle; margin-right:5px;">
          ${liga}
        </h3>
        <table style="width:100%; border-collapse: collapse; font-family: sans-serif;">
          <thead>
            <tr>
              <th style="border-bottom:1px solid #ccc; padding:5px;text-align:left;">Local</th>
              <th style="border-bottom:1px solid #ccc; padding:5px;text-align:center;">vs</th>
              <th style="border-bottom:1px solid #ccc; padding:5px;text-align:left;">Visitante</th>
              <th style="border-bottom:1px solid #ccc; padding:5px;text-align:right;">Hora</th>
            </tr>
          </thead>
          <tbody>
      `;
      info.matches.forEach(match => {
        const start = new Date(match.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        html += `
          <tr>
            <td style="padding:5px;">${match.home}</td>
            <td style="padding:5px;text-align:center;">vs</td>
            <td style="padding:5px;">${match.away}</td>
            <td style="padding:5px;text-align:right;">${start}</td>
          </tr>
        `;
      });
      html += `</tbody></table>`;
    });

    const message = {
      from: `Football Live <no-reply@${env.MAILGUN_DOMAIN}>`,
      to: toEmail,
      subject: `Partidos de mañana - ${fecha}`,
      html
    };

    const response = await mg.messages.create(env.MAILGUN_DOMAIN, message);
    console.log("Correo enviado ✅", response);
  } catch (err) {
    console.error("Error enviando email ❌", err);
  }
}