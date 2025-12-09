import fetch from "node-fetch";

export const getMatches = async (fecha, checks) => {
  try {
    const actionData = { fecha, checks };

    const response = await fetch("https://football-live.up.railway.app/footlive/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0" // opcional, ayuda a simular navegador
      },
      body: JSON.stringify(actionData)
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error obteniendo partidos ❌", err);
    throw err;
  }
}