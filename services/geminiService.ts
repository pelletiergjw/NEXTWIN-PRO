
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v6.0 "Zero-Hallucination"
 * Spécialement optimisé pour la validation des transferts 2024/2025 (Ex: Mafouta à Guingamp)
 */

const getAPIKey = async () => {
    // 1. Priorité à la clé sélectionnée par l'utilisateur via l'interface AI Studio
    const hasSelected = (window as any).aistudio?.hasSelectedApiKey ? await (window as any).aistudio.hasSelectedApiKey() : false;
    
    // 2. Récupération de la clé (Vercel ou AI Studio Injector)
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
    
    if (!key || key === "undefined" || key === "null") return null;
    return key;
};

const getParisTime = () => {
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

const extractJson = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Format de réponse IA invalide.");
    try {
        return JSON.parse(match[0]);
    } catch (e) {
        throw new Error("Erreur de lecture des données IA.");
    }
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `DATE ACTUELLE : ${getParisTime()}. 
    MISSION : Trouve 9 matchs RÉELS prévus aujourd'hui ou demain.
    INSTRUCTION SOURCE : Utilise Google Search pour vérifier les effectifs sur Transfermarkt ou Flashscore.
    EXEMPLE DE RIGUEUR : Mafouta est à GUINGAMP (EAG) pour la saison 24/25, pas Amiens. 
    JSON : {"picks": [{"sport": "football|basketball|tennis", "match": "A vs B", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 2000 }
        }
    });
    const result = extractJson(response.text || "");
    return result.picks || [];
  } catch (error) {
    console.error("DailyPicks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = await getAPIKey();
  if (!apiKey) throw new Error("Clé API manquante ou invalide.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `ANALYSEUR NEXTWIN v6.0.
    MATCH : ${request.match} (${request.sport}). PARI : ${request.betType}.
    DATE : ${getParisTime()}.

    PROTOCOLE DE VÉRIFICATION :
    1. SEARCH : Trouve l'effectif actuel (Saison 2024/2025) sur Flashscore ou SofaScore.
    2. VÉRIFICATION JOUEUR : Si tu parles de joueurs clés, confirme leur club actuel (Ex: Mafouta = Guingamp).
    3. SEARCH : Liste les blessés confirmés dans les dernières 12h.
    4. Rédige une analyse pro en ${language === 'fr' ? 'français' : 'anglais'}.

    JSON :
    {
      "detailedAnalysis": "Analyse technique validée avec squads 24/25...",
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
    
    const result = extractJson(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source Officielle', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    const errStr = error?.toString() || "";
    if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED")) {
        throw { message: "LIMITE DE QUOTA ATTEINTE (429). La clé API partagée est saturée. Veuillez connecter votre propre clé Google pour débloquer l'analyse.", code: 429 };
    }
    throw { message: "Erreur lors de la génération de l'analyse. Réessayez.", code: 500 };
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional sports tactical board for ${request.match} in 4K resolution.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
