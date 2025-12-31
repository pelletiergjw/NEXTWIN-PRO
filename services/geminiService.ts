
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version Production Ultra-Stable
 * Conçu pour fonctionner dans le navigateur avec injection via Vite.
 */

const getAIInstance = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "undefined") {
        throw new Error("Clé API manquante ou non configurée dans Vercel.");
    }
    return new GoogleGenAI({ apiKey });
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA");
    
    // Nettoyage agressif des caractères spéciaux et balises Markdown
    let cleaned = text.trim();
    if (cleaned.includes("```json")) {
        cleaned = cleaned.split("```json")[1].split("```")[0];
    } else if (cleaned.includes("```")) {
        cleaned = cleaned.split("```")[1].split("```")[0];
    }
    
    // On ne garde que ce qui est entre les premières et dernières accolades
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            // Tentative de réparation des virgules de fin d'objet
            try {
                const repaired = cleaned.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (inner) {
                console.error("Critical JSON Parse Error:", cleaned);
                throw new Error("Format de réponse IA corrompu.");
            }
        }
    }
    throw new Error("Aucune donnée structurée trouvée dans la réponse.");
};

const getParisTimeContext = () => {
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(new Date());
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeContext = getParisTimeContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    const prompt = `NextWin Engine. Time: ${timeContext}.
    TASK: Find 9 REAL pro matches for next 48h (3 Football, 3 Basketball, 3 Tennis).
    FORMAT: Respond ONLY with JSON: {"picks": [{"sport": "football", "match": "...", "betType": "...", "probability": "75%", "analysis": "...", "confidence": "High", "matchDate": "...", "matchTime": "..."}]}.
    Language: ${langName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Failure:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeContext = getParisTimeContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    const prompt = `Expert NextWin PRO. Heure Paris : ${timeContext}.
    ANALYSIS FOR: ${request.match} (${request.sport}). BET: ${request.betType}.
    
    INSTRUCTIONS:
    1. Search web for latest info, injuries, and odds.
    2. Analyze 2024/2025 form.
    3. Output JSON ONLY (${langName}):
    {
      "detailedAnalysis": "...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "...",
      "matchTime": "...",
      "aiOpinion": "..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    
    // Citation des sources web
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Analysis Failure:", error);
    throw new Error(error.message || "Erreur lors de la communication avec l'IA.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const prompt = style === 'dashboard' 
      ? `High-tech sports analytics dashboard for ${request.match}, neon orange.`
      : `Tactical view of ${request.match} on a field, neon heatmaps.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Visual Generation Failure:", error);
  }
  return undefined;
};
