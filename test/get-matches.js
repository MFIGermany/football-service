import { getMatches } from "../services/matches.js"
import env from '../config/env.js'

(async () => {
  const fecha = "20251206"

  const checks = env.checks

  const partidos = await getMatches(fecha, checks);

  console.log(partidos);
})();
