import { NextResponse } from "next/server";

/* -------- UTILS -------- */

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function frenchDate(offsetHours: number) {
  const d = new Date();
  d.setHours(d.getHours() + offsetHours);

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

/* -------- DATA INTERNE (STABLE) -------- */

const FOOTBALL_MATCHES = [
  "PSG vs Marseille",
  "Real Madrid vs Sevilla",
  "Bayern Munich vs Leipzig",
  "Arsenal vs Tottenham",
  "Inter Milan vs Roma"
];

const BASKET_MATCHES = [
  "Lakers vs Warriors",
  "Celtics vs Heat",
  "Bucks vs Knicks",
  "Nuggets vs Suns",
  "Mavericks vs Clippers"
];

const TENNIS_MATCHES = [
  "Djokovic vs Alcaraz",
  "Sinner vs Medvedev",
  "Zverev vs Tsitsipas",
  "Nadal vs Rune",
  "Rublev vs Hurkacz"
];

/* -------- GÉNÉRATEUR PRONOSTICS -------- */

function generatePicks() {
  const picks: any[] = [];

  FOOTBALL_MATCHES.slice(0, 3).forEach((match, i) => {
    const fr = frenchDate(2 + i * 2);
    picks.push({
      sport: "football",
      match,
      betType: "Victoire ou Nul (Double Chance)",
      probability: `${randomBetween(72, 85)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  BASKET_MATCHES.slice(0, 3).forEach((match, i) => {
    const fr = frenchDate(6 + i * 2);
    picks.push({
      sport: "basketball",
      match,
      betType: "Vainqueur du match",
      probability: `${randomBetween(74, 88)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  TENNIS_MATCHES.slice(0, 3).forEach((match, i) => {
    const fr = frenchDate(1 + i * 3);
    picks.push({
      sport: "tennis",
      match,
      betType: "Vainqueur du match",
      probability: `${randomBetween(70, 82)}%`,
      matchDate: fr.date,
      matchTime: fr.time
    });
  });

  return picks;
}

/* -------- API -------- */

export async function GET() {
  const picks = generatePicks();

  return NextResponse.json({
    generatedAt: new Date().toLocaleString("fr-FR", {
      timeZone: "Europe/Paris"
    }),
    picks
  });
}
