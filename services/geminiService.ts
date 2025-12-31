
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v5.8 "Résilience & Précision"
 * Correction spécifique pour les transferts 2025 (Ex: Mafouta à Guingamp)
 */

const getAPIKey = async () => {
    // 1. Vérifie si une clé a été sélectionnée via le dialogue sécurisé AI Studio
    // C'est la solution la plus efficace contre les erreurs 429
    const hasKey = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : false;
    
    // 2. Récupère la clé injectée (soit par Vercel, soit par le dialogue)
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
        return { 
            message: "QUOTA ÉPUISÉ (429) : Votre clé gratuite Google a atteint sa limite de recherche. Utilisez le bouton 'Connecter ma clé' pour débloquer l'analyse immédiatement.", 
            code: 429 
        };
    }
    if (errorStr.includes("entity was not found")) {
        return { message: "CLÉ INVALIDE : La clé sélectionnée est introuvable. Veuillez en choisir une autre.", code: 404 };
    }
    return { message: "Erreur technique : Le moteur d'IA est momentanément indisponible.", code: 500 };
};

const extractJsonFromText = (text: string) => {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch (e) {
            throw new Error("L'IA n'a pas pu structurer les données. Réessayez.");
        }
    }
    throw new Error("Format de réponse IA invalide.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const prompt = `DATE : ${timeNow}. 
    MISSION : Trouve 9 matchs RÉELS (3 Foot, 3 Basket, 3 Tennis) pour aujourd'hui ou demain.
    VÉRIFICATION SQUAD 2025 (Google Search) :
    - Vérifie que les joueurs sont dans leur club ACTUEL (ex: Mafouta est à Guingamp, PAS à Amiens).
    - Trouve l'heure de Paris.
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
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = await getAPIKey();
  if (!apiKey) throw new Error("Veuillez configurer une clé API.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();

    const prompt = `NEXTWIN ANALYSEUR v5.8.
    MATCH : ${request.match} (${request.sport}). PARI : ${request.betType}. 
    DATE : ${timeNow}.

    PROTOCOLE "VÉRITÉ 2025" :
    1. Utilise Google Search pour vérifier l'effectif actuel 2024/2025.
    2. Si tu parles d'un joueur, vérifie son club actuel sur Transfermarkt ou L'Equipe.
    3. Analyse les blessures réelles de ce matin.
    4. Rédige 200 mots d'analyse experte en ${language === 'fr' ? 'français' : 'anglais'}.

    JSON :
    {
      "detailedAnalysis": "Analyse validée effectif 2025...",
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
      contents: { parts: [{ text: `Professional tactical visualization for ${request.match}.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
