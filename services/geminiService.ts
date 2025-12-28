
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "A comprehensive analysis covering team form, head-to-head stats, key players, injuries, and match context. Explain why certain factors are important.",
        },
        successProbability: {
            type: Type.STRING,
            description: "A percentage representing the probability of the bet succeeding. For example: '65%'.",
        },
        riskAssessment: {
            type: Type.STRING,
            description: "An evaluation of the risk involved. Classify it as 'Low', 'Medium', or 'High' and explain why.",
        },
        aiOpinion: {
            type: Type.STRING,
            description: "Your final verdict. State clearly whether you think the bet is interesting and worth considering or not, and give a concluding sentence."
        }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion"],
};

const generateMockAnalysis = (request: AnalysisRequest, language: 'fr' | 'en' = 'en'): AnalysisResult['response'] => {
    return {
        detailedAnalysis: language === 'fr' 
            ? `Analyse fictive pour ${request.match}. Nancy est actuellement en National 1 après sa descente, tandis qu'Amiens évolue en Ligue 2. (Mode Mock)` 
            : `Mock analysis for ${request.match}. Nancy is in National 1, Amiens is in Ligue 2. (Mock Mode)`,
        successProbability: `${Math.floor(Math.random() * 50) + 40}%`,
        riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        aiOpinion: "Ceci est un mode de test sans clé API.",
        sources: []
    };
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!API_KEY) {
      return generateMockAnalysis(request, language);
  }
  
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `
    You are NextWin, the world's most accurate sports betting analyst.
    
    IMPORTANT: 
    1. Before analyzing, use Google Search to verify:
       - The current division/league of both teams (e.g., Are they in Ligue 2, National, etc.?).
       - Their exact current standing in the table.
       - Latest team news (injuries, suspensions, recent manager changes).
       - Most recent head-to-head results from the current or last season.
    2. Your entire response MUST be in ${languageFullName}.
    3. Be precise. If a team has changed division recently, mention it.

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
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Source',
            uri: chunk.web?.uri || '#'
          })).filter((s: any) => s.uri !== '#')
        : [];

    return {
        ...result,
        sources
    };
  } catch (error) {
    console.error("Error fetching analysis from Gemini API:", error);
    return generateMockAnalysis(request, language);
  }
};
