// services/gmailMail.js
import nodemailer from "nodemailer";
import { getMatches } from "./matches.js";
import env from "../config/env.js";

export const sendMatchesEmail = async (toEmail) => {
  try {
    // Fecha de mañana en formato YYYYMMDD
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const fecha = tomorrow.toISOString().split("T")[0].replace(/-/g, "");

    // Obtener los partidos
    const data = await getMatches(fecha, env.CHECKS);

    if (!data || data.length === 0) {
        console.log("No hay partidos, no se envía email");
        return;
    }

    if (data.result){
        // Extraer año, mes y día
        const ano = fecha.slice(0, 4);
        const mes = fecha.slice(4, 6);
        const dia = fecha.slice(6, 8);

        // Formatear a DD/MM/YYYY
        const fechaFormateada = `${dia}/${mes}/${ano}`;

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
                                }).join('')}
                                </tbody>
                            </table>
                            </div>
                        `).join('')}
                        <p style="text-align:center; font-size:12px; color:#999; margin-top:20px;">Este correo se envía automáticamente desde Football Live.</p>
                        </div>`;

        // Configuración de transporte SMTP
        const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.GMAIL_USER,
            pass: env.GMAIL_PASS
        }
        });

        const mailOptions = {
        from: `"Football Live" <${env.GMAIL_USER}>`,
        to: toEmail,
        subject: `Partidos de mañana: ${fechaFormateada}`,
        html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Correo enviado ✅", info.messageId);
    }
  } catch (err) {
    console.error("Error enviando email ❌", err);
  }
};
