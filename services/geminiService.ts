
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service to interact with the NextWin AI engine.
 * Optimized for production with robust JSON parsing and error handling.
 */

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "Detailed analysis of the match and players.",
        },
        successProbability: {
            type: Type.STRING,
            description: "Percentage (e.g., '72%').",
        },
        riskAssessment: {
            type: Type.STRING,
            description: "Risk level: Low, Medium, or High.",
        },
        matchDate: {
            type: Type.STRING,
            description: "Official match date (French format).",
        },
        matchTime: {
            type: Type.STRING,
            description: "Kick-off time in Paris (HH:mm).",
        },
        aiOpinion: {
            type: Type.STRING,
            description: "Professional verdict."
        }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion", "matchDate", "matchTime"],
};

/**
 * Helper to safely extract JSON from AI response text, handling potential markdown wrappers.
 */
const safeParseJson = (text: string) => {
    try {
        // Remove markdown code blocks if present
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse AI JSON:", text);
        throw new Error("Invalid response format from AI");
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timeContext = getParisTimeContext();
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `System: NextWin Engine. Paris Time: ${timeContext}. 
  Find 9 real upcoming matches (3 per sport) for next 48h. 
  Convert all times to Paris Time (CET/CEST). 
  Check actual 2024/2025 rosters. 
  Respond in ${languageFullName}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      }
    });

    const result = safeParseJson(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("Error fetching daily picks:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!process.env.API_KEY) throw new Error("API Key missing");
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const timeContext = getParisTimeContext();
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `Expert Analyst NextWin PRO. Current Paris Time: ${timeContext}.
    Match: ${request.match} (${request.sport}). Bet Type: ${request.betType}.
    
    1. SEARCH: Find the EXACT next date/time of this match.
    2. CONVERT: Systematically convert match time to PARIS TIME (CET/CEST).
    3. DATA: Verify 2024/2025 rosters, injuries, and recent form.
    4. RESPOND: JSON in ${languageFullName}.
    
    IMPORTANT: If the match is in the future (even 1 month away), provide the full analysis.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            thinkingConfig: { thinkingBudget: 15000 }
        }
    });
    
    const result = safeParseJson(response.text || "{}");
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Data Source',
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const visualPrompt = style === 'dashboard' 
    ? `Professional sports analytics dashboard for "${request.match}" (${request.sport}). High-tech UI, statistics, dark mode with orange accents.`
    : `Top-down tactical view of "${request.match}" (${request.sport}). Glowing neon arrows, player zones, heatmaps.`;

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
