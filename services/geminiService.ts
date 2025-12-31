
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Extrait un objet JSON d'une chaîne de caractères robuste aux préambules de l'IA.
 */
const extractJson = (text: string) => {
    try {
        const firstBracket = text.indexOf('{');
        const lastBracket = text.lastIndexOf('}');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            const jsonString = text.substring(firstBracket, lastBracket + 1);
            return JSON.parse(jsonString);
        }
    } catch (e) {
        console.error("Erreur de parsing JSON IA:", e, "Texte brut:", text);
    }
    return null;
};

const getAIInstance = () => {
    // Vite remplace process.env.API_KEY par la valeur réelle pendant le build GitHub Actions
    const apiKey = process.env.API_KEY;
    
    if (!apiKey || apiKey === "" || apiKey === "process.env.API_KEY") {
        console.error("CRITICAL: API_KEY non configurée dans les Secrets GitHub.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    try {
        const prompt = `Trouve 9 matchs de sport RÉELS prévus aujourd'hui ou demain : 3 de Football, 3 de Basketball et 3 de Tennis.
        Pour chaque match, fournis : l'équipe/joueur 1, l'équipe/joueur 2, le type de pari suggéré, la probabilité de succès (en %), une analyse rapide et la confiance (High ou Very High).
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
                systemInstruction: "Tu es l'expert NextWin. Tu identifies des matchs RÉELS via Google Search et tu réponds exclusivement en JSON."
            }
        });

        const result = extractJson(response.text || "");
        return (result && result.picks) ? result.picks : [];
    } catch (error) {
        console.error("Erreur picks:", error);
        throw error;
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    try {
        const prompt = `Analyse expert pour le match : ${request.match} (${request.betType}). 
        Cherche les dernières infos réelles (compos, blessures) via Google Search.
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
                systemInstruction: "Tu es un analyste pro. Utilise Search pour les données réelles. Réponds en JSON pur."
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
    } catch (error) {
        console.error("Erreur analyse:", error);
        throw error;
    }
};
