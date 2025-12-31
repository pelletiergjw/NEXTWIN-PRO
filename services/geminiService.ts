
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v5.0 "Quantum-Search"
 * Supporte le sélecteur de clé API pour éviter les erreurs 429
 */

const getAPIKey = async () => {
    // 1. Vérifie si l'utilisateur a sélectionné une clé via le dialogue AI Studio
    const hasKey = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : false;
    
    // 2. Si une clé est sélectionnée, elle est injectée dans process.env.API_KEY
    // Sinon, on utilise la clé par défaut de l'environnement Vercel
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
    
    if (!key || key === "undefined") return null;
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
        return { message: "QUOTA ÉPUISÉ : Votre clé API a atteint sa limite. Veuillez sélectionner une clé avec facturation activée.", code: 429 };
    }
    if (errorStr.includes("entity was not found")) {
        return { message: "CLÉ INVALIDE : La clé sélectionnée est introuvable ou périmée.", code: 404 };
    }
    return { message: error.message || "Erreur technique de communication avec l'IA.", code: 500 };
};

const extractJsonFromText = (text: string) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error("Erreur de formatage des données IA.");
        }
    }
    throw new Error("L'IA n'a pas renvoyé de format exploitable.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `DATE : ${timeNow}. 
    TROUVE 9 MATCHS RÉELS (3 Foot, 3 Basket, 3 Tennis) pour aujourd'hui ou demain.
    VÉRIFICATION SQUAD 2025 : Utilise Google Search pour vérifier que les joueurs cités sont bien dans leur club ACTUEL (ex: Mafouta à Guingamp, PAS à Amiens).
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
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = await getAPIKey();
  if (!apiKey) throw new Error("Veuillez configurer une clé API pour continuer.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `NEXTWIN ANALYSEUR v5.0. 
    MATCH : ${request.match} (${request.sport}). 
    PARI : ${request.betType}. 
    DATE : ${timeNow}.

    ÉTAPE 1 (SEARCH) : Vérifie l'effectif actuel 2024/2025 sur Transfermarkt ou L'Equipe. 
    ÉTAPE 2 (SEARCH) : Trouve les derniers blessés et suspendus réels.
    ÉTAPE 3 (ANALYSIS) : Calcule la probabilité de réussite du pari : ${request.betType}.

    RETOURNE CE JSON :
    {
      "detailedAnalysis": "Analyse pro en ${langLabel} (min 150 mots) avec infos blessés/transferts...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil stratégique..."
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
    const parsed = parseGeminiError(error);
    throw parsed;
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional tactical sports visualization for ${request.match}.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
