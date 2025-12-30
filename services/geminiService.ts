
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
            description: "A comprehensive analysis covering team form, head-to-head stats, key players, injuries, and match context. It MUST include a sentence confirming the current league of both teams.",
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
            description: "The official date of the match in French time (e.g., '16 Octobre 2024'). Found using search and correctly converted to French timezone, adjusting the day if necessary.",
        },
        matchTime: {
            type: Type.STRING,
            description: "The official French kick-off time (e.g., '03:00'). Found using search and correctly converted to French timezone (CET/CEST).",
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
          matchDate: { type: Type.STRING, description: "Detected match date, correctly converted to French date (CET/CEST), day must be adjusted if necessary." },
          matchTime: { type: Type.STRING, description: "Detected match time, correctly converted to French time (CET/CEST)." }
        },
        required: ["sport", "match", "betType", "probability", "analysis", "confidence", "matchDate", "matchTime"]
      }
    }
  },
  required: ["picks"]
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `
    SYSTEM ROLE: You are an expert sports analyst. Your ONLY task is to provide 9 hyper-accurate predictions for a French audience. All data must be verified and presented for users located in France.

    *** ABSOLUTE, UNBREAKABLE RULES FOR EACH OF THE 9 PICKS ***

    RULE 1: USE ONLY LIVE DATA. You MUST use Google Search to find all match information. Your internal knowledge is forbidden and outdated.

    RULE 2: FRENCH TIME IS LAW.
        - For EACH of the 9 picks, you MUST perform a Google Search to find its official local start time AND date.
        - You MUST then convert this local time and date to the French timezone (CET/CEST).
        - **CRITICAL DATE ADJUSTMENT:** If a match is at 10 PM on Tuesday in the USA, it is on WEDNESDAY in France. Your 'matchDate' field for that pick MUST be the French date (Wednesday). This is a frequent and critical conversion.
        - The final, converted French date and time are the ONLY values permitted in the 'matchDate' and 'matchTime' JSON fields for each pick. No exceptions.

    RULE 3: SELECTION CRITERIA. Select exactly 3 high-probability picks (over 70% success chance) for Football, 3 for Basketball, and 3 for Tennis. A total of 9 picks.

    RULE 4: LANGUAGE. Your entire JSON response MUST be in ${languageFullName}.
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
    SYSTEM ROLE: You are NextWin, a hyper-precise sports betting analyst for a French audience. Accuracy is your ONLY priority. Errors in data are unacceptable.

    *** ABSOLUTE, UNBREAKABLE RULES ***
    Failure to follow these rules constitutes a total failure of the task.

    RULE 1: NO OLD DATA. You MUST use Google Search for EVERY piece of information in this request. Your internal knowledge is forbidden. Sports data changes constantly. This is the most important rule.

    RULE 2: VERIFY LEAGUES.
        - Before any analysis, you MUST perform a Google Search to find the EXACT current, official league for BOTH teams for the current season.
        - You MUST include a sentence in your 'detailedAnalysis' that explicitly states these verified leagues. This is a mandatory proof of work.
        - Example: For 'Amiens vs Nancy', you find Amiens is in Ligue 2 and Nancy is in National. Your analysis MUST contain: "Amiens SC évolue en Ligue 2, tandis que l'AS Nancy Lorraine joue en National pour la saison en cours."
        - Mismatching a team's league is a critical error.

    RULE 3: FRENCH TIME IS LAW.
        - You MUST perform a Google Search to find the official local start time AND date of the match.
        - You MUST then convert this local time and date to the French timezone (CET/CEST).
        - **CRITICAL DATE ADJUSTMENT:** If a match is at 10 PM on Tuesday in the USA, it is on WEDNESDAY in France. You MUST return the French date. Your 'matchDate' field must reflect this change.
        - The final, converted French date and time are the ONLY values permitted in the 'matchDate' and 'matchTime' JSON fields. No exceptions.

    RULE 4: ANALYZE. After following rules 1, 2, and 3, provide a deep analysis based on your fresh search results (form, injuries, H2H, etc.).

    RULE 5: LANGUAGE. Your entire JSON response MUST be in ${languageFullName}.

    ---
    USER REQUEST:
    - Sport: ${request.sport}
    - Match: ${request.match}
    - Bet Type: ${request.betType}
    ---
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
