
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v4.8 "Ultra-Reliable"
 */

const getAPIKey = () => {
    const key = (process.env.API_KEY) || 
                (import.meta as any).env?.VITE_API_KEY || 
                (window as any).process?.env?.API_KEY;
    
    return (!key || key === "undefined") ? null : key;
};

const getParisContext = () => {
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    }).format(new Date());
};

const parseGeminiError = (error: any): string => {
    const errorStr = error?.toString() || "";
    if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
        return "Quota API dépassé (Erreur 429). Si vous êtes en plan gratuit, Google limite le nombre de requêtes par minute. Patientez 60 secondes ou passez à un plan 'Pay-as-you-go' sur Google AI Studio.";
    }
    if (errorStr.includes("403")) {
        return "Accès refusé. Votre clé API n'a pas les droits nécessaires ou est restreinte géographiquement.";
    }
    if (errorStr.includes("API_KEY_INVALID")) {
        return "Clé API invalide. Vérifiez la variable d'environnement sur Vercel.";
    }
    return error.message || "Une erreur inattendue est survenue avec le moteur IA.";
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse IA vide.");
    let cleaned = text.trim();
    if (cleaned.includes("```")) {
        cleaned = cleaned.split(/```(?:json)?/)[1]?.split("```")[0]?.trim() || cleaned;
    }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        try {
            return JSON.parse(cleaned.substring(start, end + 1));
        } catch (e) {
            throw new Error("Erreur de parsing des données sportives.");
        }
    }
    throw new Error("Structure de données introuvable.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `URGENT : Nous sommes le ${timeNow}. 
    Utilise Google Search pour trouver 9 matchs réels PRÉVUS entre aujourd'hui et après-demain.
    CONSIGNES CRITIQUES :
    1. HEURES : Convertis toutes les heures au fuseau horaire de PARIS.
    2. EFFECTIFS : Vérifie l'effectif actuel 2024/2025. Interdiction de citer des joueurs transférés.
    3. FORMAT : Retourne UNIQUEMENT le JSON :
    {"picks": [{"sport": "football|basketball|tennis", "match": "Equipe A vs Equipe B", "betType": "...", "probability": "XX%", "analysis": "Info en ${langLabel}", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    const result = extractJsonFromText(response.text || "");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = getAPIKey();
  if (!apiKey) throw new Error("Clé API non trouvée.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `SYSTEM NEXTWIN v4.8 - EXPERT EN ANALYSE SPORTIVE TEMPS RÉEL.
    MATCH : ${request.match}.
    SPORT : ${request.sport}.
    PARI : ${request.betType}.
    CONTEXTE : ${timeNow} (Heure de Paris).

    PROCÉDURE DE VÉRIFICATION ANTI-HALLUCINATION :
    1. RECHERCHE WEB : Scanne les dernières infos (news de moins de 12h).
    2. EFFECTIFS 2024/2025 : Vérifie la présence des joueurs clés. (Ex: Si footballeur transféré cet été, ne pas le citer pour son ancien club).
    3. INFIRMERIE : Liste les blessés et suspendus réels pour ce match.
    4. HORAIRE : Trouve l'heure officielle et affiche-la impérativement à l'heure de PARIS.

    STRUCTURE DU JSON (OBLIGATOIRE) :
    {
      "detailedAnalysis": "Analyse technique pro en ${langLabel} basée sur les faits réels (blessures, transferts, enjeux)...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM (Heure Paris)",
      "aiOpinion": "Conseil d'expert stratégique..."
    }
    Langue : ${langLabel}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source vérifiée', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    const friendlyError = parseGeminiError(error);
    throw new Error(friendlyError);
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional tactical sports visualization for ${request.match}, high-end betting analytics style.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
