
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version STABLE 2025
 * Utilisation de Gemini 3 Flash pour garantir la disponibilité et éviter les erreurs de quota (429).
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
    if (!text) throw new Error("Réponse vide.");
    let cleaned = text.trim();
    if (cleaned.includes("```json")) cleaned = cleaned.split("```json")[1].split("```")[0];
    else if (cleaned.includes("```")) cleaned = cleaned.split("```")[1].split("```")[0];
    
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1);
        return JSON.parse(cleaned);
    }
    throw new Error("Format de données invalide.");
};

// Fonction utilitaire pour formater les erreurs API
const handleApiError = (error: any) => {
    console.error("Gemini API Error:", error);
    const message = error?.message || "";
    if (message.includes("429") || message.includes("quota")) {
        return "Le moteur d'analyse est très sollicité. Veuillez patienter 30 secondes et réessayer.";
    }
    if (message.includes("API key")) {
        return "Erreur de configuration : Clé API invalide ou manquante.";
    }
    return "Une erreur technique est survenue lors de l'analyse en temps réel.";
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const prompt = `L'année actuelle est 2025. Aujourd'hui: ${timeNow}. 
    Utilise Google Search pour trouver 9 VRAIS matchs pro (3 Foot, 3 Basket, 3 Tennis) prévus d'ici 48h.
    Réponds UNIQUEMENT en JSON: {"picks": [{"sport": "...", "match": "...", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "DD/MM/2025", "matchTime": "HH:MM"}]}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Flash est plus stable pour les quotas
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const prompt = `Analyseur NextWin 2025. Heure Paris: ${timeNow}. 
    MATCH: ${request.match}. PARI: ${request.betType}.
    Utilise Google Search pour les infos réelles de 2025.
    Réponds en JSON: {
      "detailedAnalysis": "...", 
      "successProbability": "XX%", 
      "riskAssessment": "Low"|"Medium"|"High", 
      "matchDate": "DD/MM/2025", 
      "matchTime": "HH:MM", 
      "aiOpinion": "..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', // Switch to Flash
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = chunks.filter((c: any) => c.web?.uri).map((c: any) => ({
        title: c.web.title || 'Source 2025',
        uri: c.web.uri
    }));

    return { ...result, sources };
  } catch (error: any) {
    throw new Error(handleApiError(error));
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Professional sports visual for ${request.match} (2025), ${style} style, neon orange.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Visual Error:", error);
  }
  return undefined;
};
