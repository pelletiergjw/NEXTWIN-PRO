import { NextResponse } from "next/server";

/* ---------------- UTILS ---------------- */

function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function frenchDate(hoursOffset: number) {
  const d = new Date();
  d.setHours(d.getHours() + hoursOffset);

  return {
    date: d.toLocaleDateString("fr-FR", {
      timeZone: "Europe/Paris"
    }),
    time: d.toLocaleTimeString("fr-FR", {
      timeZone: "Europe/Paris",
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

/* ---------------- MATCHS INTERNES ---------------- */

const FOOTBALL = [
  "PSG vs Marseille",
  "Real Madrid vs Sevilla",
  "Bayern Munich vs Leipzig"
];

const BASKET = [
  "Lakers vs Warriors",
  "Celtics vs Heat",
  "Bucks vs Knicks"
];

const TENNIS = [
  "Djokovic vs Alcaraz",
  "Sinner vs Medvedev",
  "Zverev vs Tsitsipas"
];

/* ---------------- GÉNÉRATION ---------------- */

function generatePronostics() {
  const picks: any[] = [];

  FOOTBALL.forEach((match, i) => {
    const fr = frenchDate(2 + i * 2);
    picks.push({
      sport: "football",
      match,
      betType: "Double chance (Victoire ou Nul)",
      probability: `${random(72, 85)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  BASKET.forEach((match, i) => {
    const fr = frenchDate(6 + i * 2);
    picks.push({
      sport: "basketball",
      match,
      betType: "Vainqueur du match",
      probability: `${random(74, 88)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  TENNIS.forEach((match, i) => {
    const fr = frenchDate(1 + i * 3);
    picks.push({
      sport: "tennis",
      match,
      betType: "Vainqueur du match",
      probability: `${random(70, 82)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  return picks;
}

/* ---------------- API ---------------- */

export async function GET() {
  return NextResponse.json({
    generatedAt: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris"
    }),
    picks: generatePronostics()
  });
}
