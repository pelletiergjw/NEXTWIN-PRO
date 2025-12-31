
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v4.9 "Pro-Shield"
 * Optimisé pour Vercel et la précision des données 2025
 */

const getAPIKey = () => {
    // Ordre de priorité pour la récupération de la clé sur Vercel/Local
    const key = (process.env.API_KEY) || 
                (import.meta as any).env?.VITE_API_KEY || 
                (window as any).process?.env?.API_KEY;
    
    if (!key || key === "undefined" || key === "null") return null;
    return key;
};

// Contexte temporel précis pour la France
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
    const message = error?.message || error?.toString() || "";
    const status = error?.status || (error?.response?.status);

    console.error("Gemini API Error Detail:", error);

    if (message.includes("429") || message.includes("RESOURCE_EXHAUSTED") || status === 429) {
        return "LIMITE ATTEINTE (429) : Votre clé API gratuite a atteint son quota de recherche Google. SOLUTION : Attendez 1 minute ou activez la facturation 'Pay-as-you-go' sur Google AI Studio (ai.google.dev) pour un accès illimité (gratuit jusqu'à 1500 requêtes/jour, puis payant à l'usage).";
    }
    if (message.includes("API_KEY_INVALID") || status === 403) {
        return "CLÉ INVALIDE : La clé API configurée sur Vercel est incorrecte ou n'a pas les droits pour Gemini 3.";
    }
    return "ERREUR TECHNIQUE : Le service Google est temporairement indisponible. Réessayez dans quelques instants.";
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA.");
    let cleaned = text.trim();
    // Extraction sécurisée du bloc JSON
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error("Format de données reçu invalide.");
        }
    }
    throw new Error("L'IA n'a pas pu structurer l'analyse. Réessayez.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `DATE ACTUELLE : ${timeNow}. 
    MISSION : Trouve 9 matchs de sport RÉELS (3 Foot, 3 Basket, 3 Tennis) prévus aujourd'hui ou demain.
    VÉRIFICATION STRICTE : 
    - Heures : Convertis impérativement en heure de PARIS (France).
    - Joueurs : Vérifie que les joueurs cités n'ont pas été transférés (ex: Mafouta est à Guingamp, pas Amiens).
    
    RETOURNE CE JSON :
    {"picks": [{"sport": "football|basketball|tennis", "match": "A vs B", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 2000 } // Aide à la vérification des transferts
        }
    });
    const result = extractJsonFromText(response.text || "");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Failure:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = getAPIKey();
  if (!apiKey) throw new Error("Clé API absente de la configuration Vercel.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `ANALYSEUR NEXTWIN PRO v4.9.
    Match : ${request.match}. Sport : ${request.sport}. Pari : ${request.betType}.
    Heure locale : ${timeNow}.

    PROTOCOLE DE VÉRIFICATION RÉELLE :
    1. RECHERCHE WEB : Trouve l'heure de coup d'envoi et convertis en heure de PARIS.
    2. TRANSFERTS : Vérifie via Google que les joueurs cités sont bien dans l'équipe ACTUELLE (Saison 2024/2025).
    3. BLESSURES : Identifie les forfaits de dernière minute.
    4. RÉDACTION : Analyse pro en ${langLabel} (min 150 mots).

    JSON REQUIS :
    {
      "detailedAnalysis": "Analyse incluant blessés et forme réelle...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil d'expert..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 4000 } // Budget plus élevé pour l'analyse de match
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Info Match', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    throw new Error(parseGeminiError(error));
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Tactical sports board for ${request.match}, professional analytics style.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
