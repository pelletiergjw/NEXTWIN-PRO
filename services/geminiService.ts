
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version DEBUG & PROD Vercel
 */

const getAPIKey = () => {
    // Tentative de récupération sur tous les points d'injection possibles de Vite/Vercel
    const key = (process.env.API_KEY) || 
                (import.meta as any).env?.VITE_API_KEY || 
                (window as any).process?.env?.API_KEY;
    
    if (!key || key === "undefined" || key === "") {
        return null;
    }
    return key;
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
    if (!text) throw new Error("L'IA a renvoyé une réponse vide.");
    
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
            throw new Error("Erreur de formatage des données IA.");
        }
    }
    throw new Error("Données structurées introuvables dans la réponse.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `NextWin Engine. Date: ${timeNow}. 
    Trouve 9 matchs réels prévus d'ici 48h.
    Retourne UNIQUEMENT ce JSON:
    {"picks": [{"sport": "football|basketball|tennis", "match": "A vs B", "betType": "...", "probability": "XX%", "analysis": "Brief in ${langLabel}", "confidence": "High", "matchDate": "DD/MM/2025", "matchTime": "HH:MM"}]}`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        const result = extractJsonFromText(response.text || "");
        return result.picks || [];
    } catch (e) {
        // Fallback sans recherche si erreur de quota ou de tool
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt + " (Base-toi sur tes connaissances actuelles 2025)",
        });
        const result = extractJsonFromText(response.text || "");
        return result.picks || [];
    }
  } catch (error) {
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = getAPIKey();
  if (!apiKey) throw new Error("La clé API n'est pas configurée dans Vercel (Variable: API_KEY).");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `ANALYSEUR PRO. Match: ${request.match}. Sport: ${request.sport}. Pari: ${request.betType}. Date: ${timeNow}.
    Réponds UNIQUEMENT via ce JSON:
    {
      "detailedAnalysis": "Analyse technique...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil final"
    }
    Langue: ${langLabel}.`;

    let response;
    try {
        // Tentative avec recherche Google (plus précis)
        response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
    } catch (searchError) {
        // Fallback si Google Search échoue (souvent dû aux restrictions de clé API gratuite)
        response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt + " (Analyse immédiate sans recherche web)",
        });
    }
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Gemini Critical Error:", error);
    // On renvoie l'erreur réelle pour aider le débogage sur Vercel
    throw new Error(error.message || "Erreur de communication avec l'IA.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Analytical sports visual for ${request.match}, neon orange and black theme.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
