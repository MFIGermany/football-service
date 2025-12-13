import { sendMatchesEmail } from "../services/gmail.service.js";
import { getMatches } from "../services/matches.js"
import env from '../config/env.js'

export class MatchesController {

    getMatches = async (req, res) => {
        const fecha = "20251206"

        const checks = env.CHECKS

        const partidos = await getMatches(fecha, checks);

        console.log(partidos);
    }

    run = async (req, res) => {
        const emails = ["yvanega@gmail.com"]; // tu correo , "lbetancourtoliva@gmail.com"
        try {
            emails.forEach((email) => {
                sendMatchesEmail(email);
            })
            res.json({ status: "ok", message: "Correos enviados" })
        } 
        catch (e) {
            console.error("Error:", e);
            res.status(500).json({ status: "error", message: e.message })
        }
    }
}