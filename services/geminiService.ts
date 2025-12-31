
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version VERCEL OPTIMIZED
 */

const getAIInstance = () => {
    // Sur Vite/Vercel, process.env est injecté via le define du vite.config.ts
    const apiKey = (window as any).process?.env?.API_KEY || process.env.API_KEY;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("API_KEY_MISSING");
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
    if (!text) throw new Error("EMPTY_RESPONSE");
    
    // Nettoyage Markdown (Gemini entoure souvent de ```json ... ```)
    let cleaned = text.trim().replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Recherche de la première accolade ouvrante et de la dernière fermante
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        const jsonContent = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(jsonContent);
        } catch (e) {
            console.error("JSON Parse Error. Content:", jsonContent);
            // Tentative de réparation ultime (suppression des sauts de ligne dans les strings)
            try {
                const repaired = jsonContent.replace(/\n/g, " ");
                return JSON.parse(repaired);
            } catch (innerE) {
                throw new Error("INVALID_JSON_FORMAT");
            }
        }
    }
    throw new Error("NO_JSON_FOUND");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const lang = language === 'fr' ? 'français' : 'english';

    // Prompt plus direct pour limiter les hallucinations et le texte superflu
    const prompt = `Date: ${timeNow}. Année 2025. 
    Trouve 9 matchs réels (3 Foot, 3 Basket, 3 Tennis) prévus d'ici 48h via Google Search.
    Retourne UNIQUEMENT cet objet JSON brut:
    {"picks": [{"sport": "football|basketball|tennis", "match": "A vs B", "betType": "...", "probability": "XX%", "analysis": "Analysis in ${lang}", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}
    Langue des analyses: ${lang}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { 
        tools: [{ googleSearch: {} }],
        temperature: 0.1 // Plus de déterminisme pour le JSON
      }
    });

    if (!response.text) return [];
    const result = extractJsonFromText(response.text);
    return result.picks || [];
  } catch (error: any) {
    if (error.message === "API_KEY_MISSING") {
        console.error("NextWin: API_KEY is missing in Vercel environment variables.");
    }
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const lang = language === 'fr' ? 'français' : 'english';

    const prompt = `ANALYSEUR NEXTWIN 2025.
    Match: ${request.match} (${request.sport}). Pari: ${request.betType}. Date: ${timeNow}.
    Recherche via Google Search (blessés, forme 2025).
    Réponds UNIQUEMENT en JSON:
    {
      "detailedAnalysis": "Analyse technique...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil final"
    }
    Langue: ${lang}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source Info', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Analysis Engine Error:", error);
    throw new Error(error.message === "API_KEY_MISSING" ? "Clé API non configurée sur Vercel." : "Le moteur d'analyse est momentanément indisponible.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Professional sports analytical ${style} visual for ${request.match}, high-tech neon orange interface, 4K.`;
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
