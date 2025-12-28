
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


const generateMockAnalysis = (request: AnalysisRequest): AnalysisResult['response'] => {
    return {
        detailedAnalysis: `This is a mock analysis for the ${request.sport} match: ${request.match}, regarding the bet type: ${request.betType}. The AI would typically provide a deep dive into statistics, recent performance, player conditions, and historical data to formulate this opinion. Key factors would include team morale, upcoming fixtures, and even weather conditions.`,
        successProbability: `${Math.floor(Math.random() * 50) + 40}%`,
        riskAssessment: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
        aiOpinion: "This mock verdict suggests the bet has a moderate chance of success. In a real scenario, this would be a conclusive statement based on the detailed analysis provided, offering a clear 'go' or 'no-go' for beginner bettors."
    };
};

export const getBetAnalysis = async (request: AnalysisRequest): Promise<AnalysisResult['response']> => {
  // FIX: Corrected typo from API_key to API_KEY.
  if (!API_KEY) {
      console.log("Using mock analysis response.");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateMockAnalysis(request);
  }

  const prompt = `
    You are an expert sports betting analyst AI called NextWin.
    Your goal is to provide a detailed, unbiased, and data-driven analysis of a sports bet.
    The user is a beginner, so explain your reasoning clearly and simply.

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
    return generateMockAnalysis(request);
  }
};
