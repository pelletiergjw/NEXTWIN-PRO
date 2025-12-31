
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v5.5 "Anti-429 & Pro-Search"
 */

const getAPIKey = async () => {
    // Vérifie si l'utilisateur a sélectionné une clé via le dialogue AI Studio (priorité haute)
    const hasSelected = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : false;
    
    // Récupère la clé injectée par Vercel ou AI Studio
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
    
    if (!key || key === "undefined" || key === "null") return null;
    return key;
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

const parseGeminiError = (error: any): { message: string, code: number } => {
    const errorStr = error?.toString() || "";
    if (errorStr.includes("429") || errorStr.includes("RESOURCE_EXHAUSTED")) {
        return { message: "LIMITE DE REQUÊTES ATTEINTE (429). Votre clé gratuite est saturée par la recherche Google.", code: 429 };
    }
    return { message: "Erreur de connexion aux serveurs Google AI. Veuillez réessayer.", code: 500 };
};

const extractJsonFromText = (text: string) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error("Format de réponse invalide.");
        }
    }
    throw new Error("L'IA n'a pas renvoyé de données structurées.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const prompt = `DATE : ${timeNow}. 
    MISSION : Trouve 9 matchs RÉELS (3 Foot, 3 Basket, 3 Tennis) pour aujourd'hui ou demain.
    VÉRIFICATION OBLIGATOIRE (Google Search) : 
    - Vérifie l'effectif actuel 2024/2025. Exemple : Mafouta est à GUINGAMP (EAG).
    - Donne l'heure de Paris.
    JSON : {"picks": [{"sport": "...", "match": "...", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 2000 }
        }
    });
    const result = extractJsonFromText(response.text || "");
    return result.picks || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = await getAPIKey();
  if (!apiKey) throw new Error("Clé API manquante.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();

    const prompt = `NEXTWIN ANALYSEUR v5.5.
    MATCH : ${request.match} (${request.sport}). PARI : ${request.betType}. 
    CONTEXTE : ${timeNow}.

    PROTOCOLE DE SÉCURITÉ 2025 :
    1. Utilise Google Search pour trouver l'effectif actuel 2024/2025 des deux équipes.
    2. Vérifie spécifiquement les derniers transferts (ex: Mafouta, etc).
    3. Analyse les blessures de moins de 24h.
    4. Rédige une analyse pro de 200 mots.

    JSON :
    {
      "detailedAnalysis": "Analyse détaillée validée avec les effectifs 2025...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil expert..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 4000 }
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source News', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    throw parseGeminiError(error);
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Tactical board for ${request.match}.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
