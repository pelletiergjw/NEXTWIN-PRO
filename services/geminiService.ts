
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
            description: "The official date of the match in French time (e.g., '16 Octobre 2024'). Found using search and converted.",
        },
        matchTime: {
            type: Type.STRING,
            description: "The official French kick-off time (e.g., '03:00'). Found using search and converted.",
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
          matchDate: { type: Type.STRING, description: "Detected match date, converted to French time" },
          matchTime: { type: Type.STRING, description: "Detected match time, converted to French time (CET/CEST)" }
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
    System instruction: You are an expert sports analyst providing predictions for a French audience. Your primary goal is to provide accurate and relevant information for users located in France.

    Task:
    1. Search for today's and tomorrow's major upcoming sports matches in Football, Basketball, and Tennis.
    2. Identify 3 high-probability betting opportunities for EACH sport (9 picks total).
    3. For each match, you MUST find its official local date and time and then convert it to French time (CET/CEST).
    4. IMPORTANT: Adjust the date if the match happens on the next day in France (e.g., an NBA game at 7 PM in the US is on the next calendar day in France).
    5. Only select bets with a success probability higher than 70%.
    6. Provide the entire response in ${language === 'fr' ? 'French' : 'English'}.
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
            ? `Analyse fictive pour ${request.match}. Ce contenu est généré car aucune clé API n'est configurée. Les informations affichées, comme la division des équipes, sont des exemples et non des données réelles.` 
            : `Mock analysis for ${request.match}. This content is generated because no API key is configured. The displayed information, such as team divisions, are examples and not real data.`,
        successProbability: `${Math.floor(Math.random() * 50) + 40}%`,
        riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        matchDate: "12 Octobre 2024",
        matchTime: "20:45",
        aiOpinion: language === 'fr' 
            ? "Ceci est une analyse de démonstration. Configurez une clé API pour des résultats en direct."
            : "This is a demonstration analysis. Configure an API key for live results.",
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
    You are NextWin, the world's most accurate sports betting analyst, providing expertise for a French audience.

    CRITICAL INSTRUCTIONS:
    1. Your primary task is to use Google Search to find the most up-to-date, real-time information for your analysis. Do not rely on your pre-existing knowledge, as sports data changes constantly.
    2. You MUST verify the current, official division/league for BOTH teams involved in the match. This is a mandatory step. For example, verify if a team is in 'Ligue 2' or 'National 1' for the current season. State this clearly in your analysis.
    3. You MUST verify the EXACT official local date and time of this match and convert it to French time (CET/CEST), adjusting the date if necessary (e.g., a match at 10 PM in New York on October 15th is at 4 AM on October 16th in France).
    4. You MUST search for the latest team news (injuries, suspensions, key player form) and recent head-to-head results.
    5. Your entire response MUST be in ${languageFullName}.
    6. Return the converted French date and time clearly in the JSON.

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
