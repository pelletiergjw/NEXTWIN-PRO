
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Récupération de la clé API via le système d'environnement de Vite.
 * VITE_API_KEY est injecté pendant le build sur GitHub Actions.
 */
const getApiKey = (): string => {
    // @ts-ignore - Les variables sont injectées par le build
    const key = import.meta.env.VITE_API_KEY || process.env.API_KEY || "";
    return key.trim();
};

const getAIInstance = () => {
    const apiKey = getApiKey();
    if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
        throw new Error("API_KEY_MISSING_IN_BUILD");
    }
    return new GoogleGenAI({ apiKey });
};

const extractJson = (text: string) => {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(cleanText.substring(start, end + 1));
        }
    } catch (e) {
        console.error("JSON Parse Error", e);
    }
    return null;
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Trouve 9 matchs de sport RÉELS pour aujourd'hui ou demain.
            3 Football, 3 Basketball, 3 Tennis. 
            Réponds UNIQUEMENT via ce format JSON :
            { "picks": [ { "sport": "football", "match": "Equipe A vs Equipe B", "betType": "Victoire A", "probability": "75%", "analysis": "...", "confidence": "High", "matchDate": "DD/MM", "matchTime": "HH:MM" } ] }`,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es l'IA experte de NextWin. Utilise Google Search pour trouver des matchs réels."
            }
        });

        const result = extractJson(response.text || "");
        return result?.picks || [];
    } catch (error: any) {
        console.error("Gemini Error:", error);
        throw error;
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert : ${request.match} (${request.betType}). 
            Réponds UNIQUEMENT en JSON avec : detailedAnalysis, successProbability, riskAssessment, aiOpinion, matchDate, matchTime.`,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Expert analyste sportif NextWin."
            }
        });

        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

        return {
            detailedAnalysis: result?.detailedAnalysis || "Analyse indisponible.",
            successProbability: result?.successProbability || "50%",
            riskAssessment: result?.riskAssessment || "Medium",
            aiOpinion: result?.aiOpinion || "Analyse en cours...",
            matchDate: result?.matchDate || "N/A",
            matchTime: result?.matchTime || "N/A",
            sources
        };
    } catch (error: any) {
        throw error;
    }
};
