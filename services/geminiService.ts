
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Récupération sécurisée de la clé API.
 * Priorise l'injection Vite (GitHub Actions).
 */
const getApiKey = (): string => {
    // @ts-ignore
    const viteKey = import.meta.env?.VITE_API_KEY;
    const processKey = typeof process !== 'undefined' ? process.env?.API_KEY : '';
    
    const finalKey = (viteKey || processKey || "").trim();
    
    // Nettoyage des chaînes de placeholders potentielles
    if (finalKey === "" || finalKey === "undefined" || finalKey.includes("import.meta")) {
        return "";
    }
    return finalKey;
};

/**
 * Initialise l'instance IA avec validation.
 */
const getAIInstance = () => {
    const apiKey = getApiKey();
    if (!apiKey || apiKey.length < 10) {
        throw new Error("API_KEY_NOT_FOUND_IN_BUILD");
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Nettoyage chirurgical du JSON retourné par l'IA.
 */
const extractJson = (text: string) => {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start !== -1 && end !== -1) {
            return JSON.parse(cleanText.substring(start, end + 1));
        }
    } catch (e) {
        console.error("Extraction JSON échouée:", e);
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
                systemInstruction: "Expert NextWin. Utilise la recherche pour des matchs réels."
            }
        });

        const result = extractJson(response.text || "");
        return result?.picks || [];
    } catch (error: any) {
        console.error("Erreur Moteur DailyPicks:", error);
        throw error;
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert : ${request.match} (${request.betType}). 
            Réponds UNIQUEMENT en JSON avec : detailedAnalysis, successProbability, riskAssessment (Low/Medium/High), aiOpinion, matchDate, matchTime.`,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Analyste sportif professionnel NextWin."
            }
        });

        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

        return {
            detailedAnalysis: result?.detailedAnalysis || "Analyse technique indisponible.",
            successProbability: result?.successProbability || "0%",
            riskAssessment: result?.riskAssessment || "High",
            aiOpinion: result?.aiOpinion || "Avis IA en cours de traitement.",
            matchDate: result?.matchDate || "N/A",
            matchTime: result?.matchTime || "N/A",
            sources
        };
    } catch (error: any) {
        console.error("Erreur Moteur Analyse:", error);
        throw error;
    }
};
