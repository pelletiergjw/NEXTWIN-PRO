
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult } from '../types';

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
            description: "Your final verdict. State clearly whether you think the bet is interesting and worth considering or not, and give a concluding sentence. For example: 'This is a well-reasoned bet with a good probability of success, but the odds should be considered.' or 'This bet carries significant risk and is not recommended.'"
        }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion"],
};

const mockTranslations = {
    fr: {
        detail: (sport: string, match: string, betType: string) => `Ceci est une analyse fictive pour le match de ${sport} : ${match}, concernant le type de pari : ${betType}. L'IA fournirait normalement une analyse approfondie des statistiques, des performances récentes, de l'état des joueurs et des données historiques pour formuler cet avis.`,
        opinion: "Ce verdict fictif suggère que le pari a une chance de succès modérée. Dans un scénario réel, ce serait une déclaration concluante basée sur l'analyse détaillée fournie."
    },
    en: {
        detail: (sport: string, match: string, betType: string) => `This is a mock analysis for the ${sport} match: ${match}, regarding the bet type: ${betType}. The AI would typically provide a deep dive into statistics, recent performance, player conditions, and historical data to formulate this opinion.`,
        opinion: "This mock verdict suggests the bet has a moderate chance of success. In a real scenario, this would be a conclusive statement based on the detailed analysis provided."
    }
}

const generateMockAnalysis = (request: AnalysisRequest, language: 'fr' | 'en' = 'en'): AnalysisResult['response'] => {
    return {
        detailedAnalysis: mockTranslations[language].detail(request.sport, request.match, request.betType),
        successProbability: `${Math.floor(Math.random() * 50) + 40}%`,
        riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        aiOpinion: mockTranslations[language].opinion
    };
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!API_KEY) {
      console.log("Using mock analysis response.");
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateMockAnalysis(request, language);
  }
  
  const languageFullName = language === 'fr' ? 'French' : 'English';

  const prompt = `
    You are an expert sports betting analyst AI called NextWin.
    Your goal is to provide a detailed, unbiased, and data-driven analysis of a sports bet.
    The user is a beginner, so explain your reasoning clearly and simply.
    
    IMPORTANT: Your entire response, including all fields in the JSON output, MUST be in the following language: ${languageFullName}.

    The bet to analyze is:
    - Sport: ${request.sport}
    - Match/Event: ${request.match}
    - Bet Type: ${request.betType}

    Provide your analysis based on current statistics, team/player form, direct confrontations, and the context of the match.
    Return the analysis in the specified JSON format.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    // Basic validation
    if (result.detailedAnalysis && result.successProbability && result.riskAssessment && result.aiOpinion) {
        return result;
    } else {
        throw new Error("Invalid JSON structure from API");
    }
  } catch (error) {
    console.error("Error fetching analysis from Gemini API:", error);
    // Fallback to mock data on API error
    return generateMockAnalysis(request, language);
  }
};
