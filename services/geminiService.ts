
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

const extractJson = (text: string) => {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBracket = cleanText.indexOf('{');
        const lastBracket = cleanText.lastIndexOf('}');
        if (firstBracket !== -1 && lastBracket !== -1) {
            return JSON.parse(cleanText.substring(firstBracket, lastBracket + 1));
        }
    } catch (e) {
        console.error("Erreur parsing JSON:", e);
    }
    return null;
};

const getAIInstance = () => {
    // Vite remplace process.env.API_KEY au build par la valeur du secret GitHub
    const apiKey = (process.env.API_KEY || "").trim();
    
    if (!apiKey || apiKey === "" || apiKey === "undefined" || apiKey.length < 10) {
        throw new Error("API_KEY_MISSING");
    }
    
    return new GoogleGenAI({ apiKey });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Trouve 9 matchs de sport RÉELS (3 Foot, 3 Basket, 3 Tennis) pour aujourd'hui ou demain. Réponds UNIQUEMENT en JSON avec une structure { 'picks': [...] }.",
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es l'expert NextWin. Utilise Google Search pour trouver des matchs RÉELS. Réponds exclusivement en JSON."
            }
        });

        const result = extractJson(response.text || "");
        return (result && result.picks) ? result.picks : [];
    } catch (error: any) {
        // On remonte l'erreur exacte de Google pour le diagnostic
        throw new Error(error.message || "Unknown API Error");
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert : ${request.match} (${request.betType}).`,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Expert analyste sportif. Réponds en JSON."
            }
        });

        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

        return {
            detailedAnalysis: result?.detailedAnalysis || "Analyse indisponible.",
            successProbability: result?.successProbability || "0%",
            riskAssessment: result?.riskAssessment || "High",
            aiOpinion: result?.aiOpinion || "Avis indisponible.",
            matchDate: result?.matchDate || "N/A",
            matchTime: result?.matchTime || "N/A",
            sources
        };
    } catch (error: any) {
        throw new Error(error.message || "Analysis Failed");
    }
};
