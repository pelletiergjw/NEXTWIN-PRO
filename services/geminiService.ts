
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version PRODUCTION STABLE
 * Utilise Gemini 3 Flash pour une haute disponibilité et éviter les erreurs de quota (429).
 */

const getAIInstance = () => {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("Clé API manquante. Configurez API_KEY dans vos variables d'environnement.");
    }
    return new GoogleGenAI({ apiKey });
};

const getParisContext = () => {
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    }).format(new Date());
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA.");
    
    // Nettoyage pour extraire uniquement le bloc JSON entre les premières et dernières accolades
    let cleaned = text.trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        const jsonOnly = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(jsonOnly);
        } catch (e) {
            // Tentative de nettoyage des caractères spéciaux invisibles
            const sanitized = jsonOnly.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
            return JSON.parse(sanitized);
        }
    }
    throw new Error("L'IA n'a pas pu structurer les données. Veuillez réessayer.");
};

const handleApiError = (error: any) => {
    console.error("Gemini Error:", error);
    const msg = error?.message || "";
    if (msg.includes("429") || msg.includes("quota") || msg.includes("limit")) {
        return "Le serveur est saturé. Veuillez patienter 30 secondes avant de cliquer sur Réessayer.";
    }
    return "Erreur lors de l'analyse en temps réel. Veuillez vérifier les noms des équipes.";
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const prompt = `Aujourd'hui: ${timeNow}. Année 2025.
    Utilise Google Search pour trouver 9 matchs réels (3 Foot, 3 Basket, 3 Tennis) prévus d'ici 48h.
    Retourne UNIQUEMENT ce JSON:
    {"picks": [{"sport": "football|basketball|tennis", "match": "Equipe A vs Equipe B", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "DD/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.warn("Daily Picks Failed:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const prompt = `NextWin AI v4.2. Date: ${timeNow}.
    MATCH: ${request.match} (${request.sport}). PARI: ${request.betType}.
    1. Utilise Google Search pour les news réelles 2025 (compos, blessés).
    2. Réponds UNIQUEMENT en JSON:
    {
      "detailedAnalysis": "Analyse technique précise...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil de mise"
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
          tools: [{ googleSearch: {} }],
          thinkingConfig: { thinkingBudget: 0 }
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source Info', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Analytical sports ${style} visual for ${request.match}, neon orange and dark theme, 4K professional graphics.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
