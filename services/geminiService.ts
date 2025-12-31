
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version Pro Optimisée
 */

/**
 * Robustly extracts JSON from a string that might contain markdown or additional text.
 * Essential when using search tools which can pollute the response.
 */
const extractJsonFromText = (text: string) => {
    try {
        // Try simple parse first
        return JSON.parse(text);
    } catch (e) {
        // Find the first '{' and the last '}' to isolate JSON block
        const start = text.indexOf('{');
        const end = text.lastIndexOf('}');
        
        if (start !== -1 && end !== -1) {
            const jsonCandidate = text.substring(start, end + 1);
            try {
                return JSON.parse(jsonCandidate);
            } catch (innerError) {
                console.error("Failed to parse extracted JSON block:", jsonCandidate);
                throw new Error("Format JSON invalide");
            }
        }
        throw new Error("Aucun bloc JSON détecté dans la réponse de l'IA");
    }
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
  Respond ONLY with a JSON object: {"picks": [{"sport": "football", "match": "Team A vs Team B", "betType": "...", "probability": "75%", "analysis": "...", "confidence": "High", "matchDate": "...", "matchTime": "..."}]}.
  All times in Paris Time. Language: ${langName}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
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

  // Using a single string prompt for max reliability with search
  const prompt = `Tu es l'expert analyste NextWin PRO. Heure Paris : ${timeContext}.
  
  ANALYSE CE MATCH : ${request.match} (${request.sport})
  TYPE DE PARI : ${request.betType}
  
  MISSIONS :
  1. Trouve la date et l'heure EXACTES du match via recherche web.
  2. Vérifie les effectifs 2024/2025, blessures et forme récente.
  3. Calcule la probabilité mathématique de succès.
  
  RÉPONDS EXCLUSIVEMENT AU FORMAT JSON SUIVANT (en ${langName}) :
  {
    "detailedAnalysis": "Analyse tactique approfondie...",
    "successProbability": "XX%",
    "riskAssessment": "Low" | "Medium" | "High",
    "matchDate": "JJ/MM/AAAA",
    "matchTime": "HH:MM",
    "aiOpinion": "Verdict final concis"
  }
  
  Important : Ne réponds RIEN d'autre que le JSON.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            // Removed responseMimeType and schema to avoid conflicts with Search grounding
            thinkingConfig: { thinkingBudget: 15000 }
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    
    // Extract sources from grounding metadata
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Data Source',
            uri: chunk.web?.uri || '#'
          })).filter((s: any) => s.uri && s.uri !== '#')
        : [];

    return { ...result, sources };
  } catch (error) {
    console.error("Detailed Analysis Error:", error);
    throw error;
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const visualPrompt = style === 'dashboard' 
    ? `Pro sports analytics dashboard for ${request.match} (${request.sport}). High-tech UI, statistics, dark mode, orange neon theme.`
    : `Top-down tactical overview of ${request.match} (${request.sport}). Neon arrows, player heatmaps, glowing pitch zones.`;

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
