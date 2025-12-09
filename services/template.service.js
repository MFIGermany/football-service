import openai from '../config/openai'
import env from '../config/env'


async function buildDailyEmailHtml(fixtures, user) {
const summaryPrompt = `Eres un asistente que genera un HTML de correo corto y profesional. Usuario: ${user.email} .
Genera un encabezado, un breve intro (1-2 frases), y una lista de partidos del día siguiente con hora local. Los datos son: ${JSON.stringify(fixtures)}.`;


const completion = await openai.chat.completions.create({
model: env.OPENAI_MODEL,
messages: [{ role: 'user', content: summaryPrompt }]
});


const html = completion.choices[0].message.content;
// The model should return HTML; add a small footer
return `<div>${html}<hr/><p style="font-size:12px;color:#777">Recibes esto porque estás suscrito a Cartelera Premium.</p></div>`;
}


module.exports = { buildDailyEmailHtml };