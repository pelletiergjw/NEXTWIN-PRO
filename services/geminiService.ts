import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Système NextWin Pro v5.1 - Engine Stable
 * Utilisation stricte de process.env.API_KEY injecté par Vite.
 */

const getAI = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY non détectée dans process.env");
    }
    return new GoogleGenAI({ apiKey: apiKey || "" });
};

// Schéma pour les 9 Pronostics du Jour
const dailyPicksSchema = {
    type: Type.OBJECT,
    properties: {
        picks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    sport: { type: Type.STRING },
                    match: { type: Type.STRING },
                    betType: { type: Type.STRING },
                    probability: { type: Type.STRING },
                    analysis: { type: Type.STRING },
                    confidence: { type: Type.STRING },
                    matchDate: { type: Type.STRING },
                    matchTime: { type: Type.STRING }
                },
                required: ["sport", "match", "betType", "probability", "analysis", "matchDate", "matchTime"]
            }
        }
    },
    required: ["picks"]
};

// Schéma pour l'Analyse de Match Personnalisée
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: { type: Type.STRING },
        successProbability: { type: Type.STRING },
        riskAssessment: { type: Type.STRING },
        aiOpinion: { type: Type.STRING },
        matchDate: { type: Type.STRING },
        matchTime: { type: Type.STRING }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion"]
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Trouve 9 matchs de sport RÉELS pour aujourd'hui ou demain (3 Football, 3 Basketball, 3 Tennis). 
            Vérifie les cotes réelles via Google Search.
            Langue : ${language === 'fr' ? 'Français' : 'Anglais'}.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: dailyPicksSchema,
                systemInstruction: "Tu es l'algorithme NextWin Pro. Fournis uniquement des données sportives réelles et vérifiées."
            }
        });

        const result = JSON.parse(response.text || "{\"picks\":[]}");
        return result.picks || [];
    } catch (error: any) {
        console.error("Gemini DailyPicks Error:", error);
        throw new Error("ERR_API_DAILY");
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert : ${request.match} (${request.sport}). Pari : ${request.betType}.
            Recherche les infos de dernière minute (blessures, météo).
            Langue : ${language === 'fr' ? 'Français' : 'Anglais'}.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                systemInstruction: "Tu es l'analyste expert de NextWin. Rends un rapport technique et précis."
            }
        });

        const result = JSON.parse(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

        return {
            detailedAnalysis: result.detailedAnalysis || "Analyse indisponible.",
            successProbability: result.successProbability || "0%",
            riskAssessment: (result.riskAssessment as any) || "Medium",
            aiOpinion: result.aiOpinion || "Indisponible.",
            matchDate: result.matchDate || "N/A",
            matchTime: result.matchTime || "N/A",
            sources
        };
    } catch (error: any) {
        console.error("Gemini Analysis Error:", error);
        throw new Error("ERR_API_ANALYSIS");
    }
};
