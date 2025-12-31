
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version Production Vercel
 * Optimisé pour répondre en moins de 10 secondes.
 */

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA");
    
    // Nettoyage des caractères de contrôle et espaces inutiles
    const sanitized = text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim();
    
    // Extraction du bloc JSON entre les premières et dernières accolades
    const start = sanitized.indexOf('{');
    const end = sanitized.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        const jsonCandidate = sanitized.substring(start, end + 1);
        try {
            return JSON.parse(jsonCandidate);
        } catch (e) {
            // Tentative de réparation si virgule traînante
            try {
                const repaired = jsonCandidate.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (innerError) {
                console.error("JSON Error:", jsonCandidate);
                throw new Error("Format de données invalide");
            }
        }
    }
    throw new Error("L'IA n'a pas renvoyé de résultats structurés");
};

const getParisTimeContext = () => {
    const now = new Date();
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        dateStyle: 'full',
        timeStyle: 'medium',
    }).format(now);
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  if (!process.env.API_KEY) return [];
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timeContext = getParisTimeContext();
  const langName = language === 'fr' ? 'Français' : 'English';

  const prompt = `NextWin Engine. Time: ${timeContext}.
  Find 9 REAL upcoming professional matches for next 48h (3 Football, 3 Basketball, 3 Tennis).
  Respond ONLY with JSON: {"picks": [{"sport": "football", "match": "Team A vs Team B", "betType": "...", "probability": "75%", "analysis": "...", "confidence": "High", "matchDate": "...", "matchTime": "..."}]}.
  Language: ${langName}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timeContext = getParisTimeContext();
  const langName = language === 'fr' ? 'Français' : 'English';

  // Utilisation de Flash pour éviter le timeout Vercel (10s)
  const prompt = `Expert NextWin PRO. Heure Paris : ${timeContext}.
  MATCH : ${request.match} (${request.sport}). TYPE : ${request.betType}.
  
  TACHE :
  1. Trouve la date/heure exacte du match via Web.
  2. Analyse la forme 2024/2025.
  3. Réponds UNIQUEMENT en JSON (${langName}) :
  {
    "detailedAnalysis": "...",
    "successProbability": "XX%",
    "riskAssessment": "Low"|"Medium"|"High",
    "matchDate": "JJ/MM/AAAA",
    "matchTime": "HH:MM",
    "aiOpinion": "..."
  }`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
            // Pas de thinkingBudget ici pour garantir une réponse < 10s
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Source Web',
            uri: chunk.web?.uri || '#'
          })).filter((s: any) => s.uri !== '#')
        : [];

    return { ...result, sources };
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const visualPrompt = style === 'dashboard' 
    ? `Sports analytics dashboard for ${request.match}, high-tech, orange neon.`
    : `Tactical view of ${request.match}, neon heatmaps on pitch.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
