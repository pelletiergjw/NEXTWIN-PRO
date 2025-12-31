
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version PRODUCTION VERCEL
 */

const getAPIKey = () => {
    // Ordre de priorité pour la clé API sur Vite/Vercel
    const key = (import.meta as any).env?.VITE_API_KEY || 
                (process as any).env?.API_KEY || 
                (window as any).process?.env?.API_KEY;
    
    if (!key || key === "undefined" || key === "") {
        console.error("NextWin Error: Clé API (API_KEY) non trouvée dans l'environnement.");
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
    if (!text) throw new Error("Réponse vide");
    
    // Nettoyage des balises Markdown et du texte parasite
    let cleaned = text.trim();
    if (cleaned.includes("```")) {
        cleaned = cleaned.split(/```(?:json)?/)[1]?.split("```")[0]?.trim() || cleaned;
    }
    
    // Extraction du premier bloc { ... }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        try {
            return JSON.parse(cleaned.substring(start, end + 1));
        } catch (e) {
            console.error("Erreur parsing JSON:", e);
            throw e;
        }
    }
    throw new Error("Format JSON non trouvé");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `Date: ${timeNow}. Année 2025.
    Trouve 9 matchs réels (3 Foot, 3 Basket, 3 Tennis) prévus d'ici 48h.
    Retourne UNIQUEMENT ce JSON:
    {"picks": [{"sport": "football|basketball|tennis", "match": "Equipe A vs Equipe B", "betType": "...", "probability": "XX%", "analysis": "Analysis in ${langLabel}", "confidence": "High", "matchDate": "DD/MM/2025", "matchTime": "HH:MM"}]}`;

    // Tentative avec Google Search
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        const result = extractJsonFromText(response.text || "");
        return result.picks || [];
    } catch (searchError) {
        console.warn("Google Search failed, trying standard generation...");
        // Fallback sans outil si Search est bloqué/lent
        const fallbackResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', 
            contents: prompt + " (Utilise tes connaissances si l'outil de recherche est indisponible)",
        });
        const fallbackResult = extractJsonFromText(fallbackResponse.text || "");
        return fallbackResult.picks || [];
    }
  } catch (error) {
    console.error("Critical Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = getAPIKey();
  if (!apiKey) throw new Error("Clé API manquante. Configurez API_KEY sur Vercel.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `ANALYSEUR NEXTWIN PRO. Match: ${request.match}. Sport: ${request.sport}. Pari: ${request.betType}. Date: ${timeNow}.
    Réponds UNIQUEMENT via ce JSON:
    {
      "detailedAnalysis": "Analyse technique...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil de mise"
    }
    Langue: ${langLabel}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source Match', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error("Le moteur d'analyse est saturé ou la clé API est invalide.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = getAPIKey();
  if (!apiKey) return undefined;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const visualPrompt = `Professional sports analytical ${style} visual for ${request.match}, high-tech UI, 4K resolution.`;
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
