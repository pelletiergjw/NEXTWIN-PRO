
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Extrait un objet JSON proprement des réponses de l'IA.
 */
const extractJson = (text: string) => {
    try {
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBracket = cleanText.indexOf('{');
        const lastBracket = cleanText.lastIndexOf('}');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            const jsonString = cleanText.substring(firstBracket, lastBracket + 1);
            return JSON.parse(jsonString);
        }
    } catch (e) {
        console.error("Erreur de parsing JSON IA:", e);
    }
    return null;
};

/**
 * Récupère la clé API de manière ultra-robuste.
 */
const getApiKey = (): string => {
    // 1. Tente via import.meta.env (Standard Vite)
    // @ts-ignore
    let key = import.meta.env?.VITE_API_KEY;
    
    // 2. Tente via process.env (Injection define)
    if (!key || key === "" || key === "undefined") {
        key = process.env.API_KEY;
    }

    return (key || "").trim();
};

const getAIInstance = () => {
    const apiKey = getApiKey();
    
    // Si la clé ressemble à la variable non remplacée ou est trop courte
    if (!apiKey || apiKey === "" || apiKey.length < 10 || apiKey.includes("process.env")) {
        console.error("DÉTAIL ERREUR : Clé API invalide ou non injectée au build.");
        throw new Error("API_KEY_MISSING_OR_INVALID");
    }
    
    return new GoogleGenAI({ apiKey });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    try {
        const ai = getAIInstance();
        const prompt = `Trouve 9 matchs de sport RÉELS (3 Foot, 3 Basket, 3 Tennis) pour aujourd'hui ou demain.
        Réponds UNIQUEMENT avec cet objet JSON :
        {
          "picks": [
            {
              "sport": "football",
              "match": "Équipe A vs Équipe B",
              "betType": "Victoire Équipe A",
              "probability": "75%",
              "analysis": "Analyse rapide...",
              "confidence": "High",
              "matchDate": "20/05",
              "matchTime": "21:00"
            }
          ]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es l'expert NextWin. Utilise la recherche Google pour les matchs RÉELS. Réponds exclusivement en JSON."
            }
        });

        const result = extractJson(response.text || "");
        return (result && result.picks) ? result.picks : [];
    } catch (error: any) {
        console.error("Erreur picks:", error);
        throw error;
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAIInstance();
        const prompt = `Analyse expert réelle via Google Search : ${request.match} (${request.betType}).
        Réponds UNIQUEMENT en JSON.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Expert analyste. Réponds en JSON."
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
        console.error("Erreur analyse:", error);
        throw error;
    }
};
