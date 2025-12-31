
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Système NextWin Pro v5 - Architecture à Structure Forcée
 * Utilise responseSchema pour garantir la validité des données.
 */

const getAI = () => {
    const key = process.env.API_KEY || "";
    return new GoogleGenAI({ apiKey: key });
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
                    sport: { type: Type.STRING, description: "football, basketball or tennis" },
                    match: { type: Type.STRING, description: "Team A vs Team B" },
                    betType: { type: Type.STRING },
                    probability: { type: Type.STRING, description: "Percentage with % sign" },
                    analysis: { type: Type.STRING, description: "Short expert analysis" },
                    confidence: { type: Type.STRING, description: "High or Very High" },
                    matchDate: { type: Type.STRING, description: "DD/MM" },
                    matchTime: { type: Type.STRING, description: "HH:MM" }
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
        riskAssessment: { type: Type.STRING, description: "Low, Medium or High" },
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
            contents: `Trouve exactement 9 matchs de sport RÉELS pour aujourd'hui ou demain (3 Football, 3 Basketball, 3 Tennis). 
            Utilise Google Search pour vérifier les cotes et les horaires réels.
            Langue de réponse : ${language === 'fr' ? 'Français' : 'Anglais'}.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: dailyPicksSchema,
                systemInstruction: "Tu es le moteur de données sportives NextWin. Tu ne fournis que des données réelles et vérifiées. Tu suis strictement le format JSON demandé."
            }
        });

        // Avec responseSchema, response.text est GARANTI d'être un JSON valide
        const result = JSON.parse(response.text || "{\"picks\":[]}");
        return result.picks || [];
    } catch (error: any) {
        console.error("Critical API Error (DailyPicks):", error);
        throw new Error("MOTEUR_INDISPONIBLE");
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert pour le match : ${request.match}. Pari ciblé : ${request.betType}. Sport : ${request.sport}.
            Recherche les blessures récentes, la météo et les flux de cotes.
            Langue : ${language === 'fr' ? 'Français' : 'Anglais'}.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: analysisSchema,
                systemInstruction: "Tu es l'analyste en chef de NextWin. Ta mission est de déceler l'avantage statistique. Sois précis et technique."
            }
        });

        const result = JSON.parse(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

        return {
            detailedAnalysis: result.detailedAnalysis,
            successProbability: result.successProbability,
            riskAssessment: result.riskAssessment,
            aiOpinion: result.aiOpinion,
            matchDate: result.matchDate || "N/A",
            matchTime: result.matchTime || "N/A",
            sources
        };
    } catch (error: any) {
        console.error("Critical API Error (Analysis):", error);
        throw new Error("ERREUR_ANALYSE_MOTEUR");
    }
};
