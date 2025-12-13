import fetch from "node-fetch";

export const getMatches = async (fecha, checks) => {
  const url = "https://football-live.up.railway.app/footlive/";
  const payload = { fecha, checks };

  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "football-premium-service/1.0"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      console.log(`getMatches attempt ${attempt} → status:`, response.status);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }

      const data = await response.json();
      return data;

    } catch (err) {
      console.error(`getMatches attempt ${attempt} failed ❌`, err.message);

      if (attempt === 2) {
        return null; // ⬅️ NO lanzamos error
      }

    } finally {
      clearTimeout(timeout);
    }
  }
}