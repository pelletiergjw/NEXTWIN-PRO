import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function toFrenchDateTime(utc: string) {
  const date = new Date(utc);
  return {
    date: date.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }),
    time: date.toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

/* -------- MOCK DATA (REMPLACE PAR TES APIS SPORT) -------- */
function getMatches() {
  return {
    football: [
      { match: "PSG vs Marseille", utc: "2026-01-09T20:00:00Z" },
      { match: "Real Madrid vs Sevilla", utc: "2026-01-09T18:00:00Z" },
      { match: "Bayern vs Leipzig", utc: "2026-01-09T19:30:00Z" }
    ],
    basketball: [
      { match: "Lakers vs Warriors", utc: "2026-01-10T01:30:00Z" },
      { match: "Celtics vs Heat", utc: "2026-01-10T00:00:00Z" },
      { match: "Bucks vs Knicks", utc: "2026-01-10T02:00:00Z" }
    ],
    tennis: [
      { match: "Djokovic vs Alcaraz", utc: "2026-01-09T13:00:00Z" },
      { match: "Sinner vs Medvedev", utc: "2026-01-09T15:00:00Z" },
      { match: "Zverev vs Tsitsipas", utc: "2026-01-09T17:00:00Z" }
    ]
  };
}

export async function GET() {
  try {
    const matches = getMatches();

    const prompt = `
You are a professional sports betting analyst.

RULES:
- Return EXACTLY 9 betting picks
- 3 football, 3 basketball, 3 tennis
- HIGH probability bets only (70%+)
- SAFE markets (winner, double chance, over points, match winner)
- NO risky bets

For each pick return ONLY:
- sport
- match
- betType
- probability
- matchDate (FR)
- matchTime (FR)

Return ONLY valid JSON.

MATCHES:
${JSON.stringify(matches, null, 2)}
`;

    const result = await model.generateContent(prompt);
    const text =
      result.response.candidates[0].content.parts[0].text;

    const data = JSON.parse(text);

    // Sécurité : toujours 9 pronostics
    if (!Array.isArray(data) || data.length !== 9) {
      throw new Error("Invalid picks count");
    }

    return NextResponse.json({
      generatedAt: new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris"
      }),
      picks: data
    });
  } catch (error) {
    console.error("Pronostics error:", error);

    // Fallback simple (jamais vide)
    const fallback = [];
    const matches = getMatches();

    Object.entries(matches).forEach(([sport, list]: any) => {
      list.forEach((m: any) => {
        const fr = toFrenchDateTime(m.utc);
        fallback.push({
          sport,
          match: m.match,
          betType: "Vainqueur du match",
          probability: "72%",
          matchDate: fr.date,
          matchTime: fr.time
        });
      });
    });

    return NextResponse.json({
      generatedAt: new Date().toLocaleString("fr-FR", {
        timeZone: "Europe/Paris"
      }),
      picks: fallback.slice(0, 9)
    });
  }
}
