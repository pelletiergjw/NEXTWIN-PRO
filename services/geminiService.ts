
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Extrait un objet JSON proprement, même si l'IA ajoute du texte autour ou des balises markdown.
 */
const extractJson = (text: string) => {
    try {
        // Nettoyage des balises markdown ```json ... ```
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

const getAIInstance = () => {
    const apiKey = process.env.API_KEY;
    
    // Vérification de sécurité pour le développeur
    if (!apiKey || apiKey === "" || apiKey === "undefined" || apiKey.length < 10) {
        throw new Error("API_KEY_INVALID");
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
                temperature: 0.7,
                systemInstruction: "Tu es l'expert NextWin. Utilise Google Search pour trouver des matchs RÉELS. Réponds exclusivement en JSON."
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
        Réponds UNIQUEMENT en JSON :
        {
          "detailedAnalysis": "Analyse complète...",
          "successProbability": "70%",
          "riskAssessment": "Medium",
          "aiOpinion": "Résumé...",
          "matchDate": "Date",
          "matchTime": "Heure"
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es un analyste pro. Utilise Search. Réponds en JSON pur."
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
