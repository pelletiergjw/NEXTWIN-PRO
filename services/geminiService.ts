
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service to interact with Google Gemini API for sports analysis and daily picks.
 */

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "A comprehensive analysis covering team form, head-to-head stats, key players, injuries, and match context.",
        },
        successProbability: {
            type: Type.STRING,
            description: "A percentage representing the probability of the bet succeeding.",
        },
        riskAssessment: {
            type: Type.STRING,
            description: "An evaluation of the risk involved (Low, Medium, High).",
        },
        matchDate: {
            type: Type.STRING,
            description: "The official date of the match (e.g., '15 Octobre 2024'). Found using search.",
        },
        matchTime: {
            type: Type.STRING,
            description: "The official local kick-off time (e.g., '21:00'). Found using search.",
        },
        aiOpinion: {
            type: Type.STRING,
            description: "Your final verdict and concluding sentence."
        }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion", "matchDate", "matchTime"],
};

const dailyPicksSchema = {
  type: Type.OBJECT,
  properties: {
    picks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sport: { type: Type.STRING, enum: ["football", "basketball", "tennis"] },
          match: { type: Type.STRING },
          betType: { type: Type.STRING },
          probability: { type: Type.STRING },
          analysis: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: ["High", "Very High"] },
          matchDate: { type: Type.STRING, description: "Detected match date" },
          matchTime: { type: Type.STRING, description: "Detected local match time" }
        },
        required: ["sport", "match", "betType", "probability", "analysis", "confidence", "matchDate", "matchTime"]
      }
    }
  },
  required: ["picks"]
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Search for today's and tomorrow's major upcoming sports matches in Football, Basketball, and Tennis.
    Identify 3 high-probability betting opportunities for EACH sport (9 picks total).
    For each match, you MUST find the EXACT date and local time.
    Only select bets with a success probability higher than 70%.
    Provide the response in ${language === 'fr' ? 'French' : 'English'}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: dailyPicksSchema,
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    return result.picks || [];
  } catch (error) {
    console.error("Error fetching daily picks:", error);
    return [];
  }
};

const generateMockAnalysis = (request: AnalysisRequest, language: 'fr' | 'en' = 'en'): AnalysisResult['response'] => {
    return {
        detailedAnalysis: language === 'fr' 
            ? `Analyse fictive pour ${request.match}. Nancy est actuellement en National 1 après sa descente, tandis qu'Amiens évolue en Ligue 2. (Mode Mock)` 
            : `Mock analysis for ${request.match}. Nancy is in National 1, Amiens is in Ligue 2. (Mock Mode)`,
        successProbability: `${Math.floor(Math.random() * 50) + 40}%`,
        riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        matchDate: "12 Octobre 2024",
        matchTime: "20:45",
        aiOpinion: "Ceci est un mode de test sans clé API.",
        sources: []
    };
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!process.env.API_KEY) {
      return generateMockAnalysis(request, language);
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `
    You are NextWin, the world's most accurate sports betting analyst.
    
    IMPORTANT: 
    1. Before analyzing, use Google Search to verify:
       - The EXACT date and time of this match.
       - The current division/league of both teams.
       - Latest team news (injuries, suspensions).
       - Most recent head-to-head results.
    2. Your entire response MUST be in ${languageFullName}.
    3. Return the matchDate and matchTime clearly in the JSON.

    Bet Details:
    - Sport: ${request.sport}
    - Match: ${request.match}
    - Bet Type: ${request.betType}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });
    
    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Source',
            uri: chunk.web?.uri || '#'
          })).filter((s: any) => s.uri !== '#')
        : [];

    return { ...result, sources };
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return generateMockAnalysis(request, language);
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let visualPrompt = '';
  if (style === 'dashboard') {
    visualPrompt = `Futuristic high-tech sports data visualization dashboard for "${request.match}" (${request.sport}). Glowing holographic charts, probability heat maps, professional analytics software style. Cinematic, 4K, deep space blue and neon orange.`;
  } else {
    visualPrompt = `Tactical strategic sports map for "${request.match}" (${request.sport}). Showing player positions, heatzones, and tactical arrows on a high-tech digital field. Cyberpunk laboratory style, neon lines, data overlays. Top-down view, ultra-detailed.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating visual analysis:", error);
    return undefined;
  }
};
