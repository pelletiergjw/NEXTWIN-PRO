
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Extraction robuste du JSON pour éviter les textes parasites de l'IA
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
        console.error("Erreur de parsing JSON IA:", e, "Texte brut reçu:", text);
    }
    return null;
};

const getAIInstance = () => {
    // Vite remplace cette chaîne lors du build GitHub Actions
    // @ts-ignore
    const apiKey = process.env.API_KEY;
    
    // Vérification stricte de la présence de la clé
    if (!apiKey || apiKey === "" || apiKey === "process.env.API_KEY" || apiKey === "undefined") {
        console.error("ERREUR CRITIQUE : La clé API Gemini n'est pas injectée dans le build.");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    const today = new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
        // Utilisation de gemini-3-pro-preview pour une meilleure fiabilité avec l'outil de recherche
        const prompt = `Consulte Google Search pour trouver 9 matchs de sport RÉELS prévus spécifiquement le ${today} (ou le lendemain si l'heure est tardive).
        Répartition : 3 Football (Ligue 1, PL, Liga, etc.), 3 Basketball (NBA, Euroleague), 3 Tennis (ATP/WTA).
        
        IMPORTANT : Toutes les heures doivent être au format HEURE DE PARIS (France).
        
        Réponds UNIQUEMENT avec cet objet JSON :
        {
          "picks": [
            {
              "sport": "football",
              "match": "Équipe A vs Équipe B",
              "betType": "Victoire Équipe A",
              "probability": "78%",
              "analysis": "Analyse courte basée sur les dernières compos...",
              "confidence": "Very High",
              "matchDate": "${today}",
              "matchTime": "21:00"
            }
          ]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: `Tu es l'expert analyste de NextWin. Ton sérieux dépend de la réalité des matchs. 
                Utilise exclusivement l'heure de Paris (France). Ne propose que des matchs dont tu peux vérifier l'existence aujourd'hui via Google Search. 
                Réponds en JSON pur sans texte avant ou après.`
            }
        });

        const result = extractJson(response.text || "");
        if (result && result.picks && Array.isArray(result.picks)) {
            return result.picks;
        }
        
        console.warn("L'IA a retourné un format JSON invalide ou vide.");
        return [];
    } catch (error) {
        console.error("Erreur lors de la récupération des pronostics:", error);
        throw error;
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    const today = new Date().toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' });

    try {
        const prompt = `Effectue une recherche approfondie sur Google pour le match : ${request.match} (${request.betType}). 
        Vérifie : les compositions probables, les blessés de dernière minute, et les conditions météo pour le ${today}.
        
        IMPORTANT : Utilise l'HEURE DE PARIS (France) pour la date et l'heure.
        
        Réponds UNIQUEMENT en JSON :
        {
          "detailedAnalysis": "Analyse technique approfondie...",
          "successProbability": "72%",
          "riskAssessment": "Medium",
          "aiOpinion": "Résumé stratégique pour le parieur...",
          "matchDate": "Date du match",
          "matchTime": "Heure de Paris"
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es un analyste sportif professionnel. Tu bases tes rapports sur des faits réels vérifiés par recherche web. Heure de Paris obligatoire. Format JSON pur."
            }
        });

        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source Web', uri: c.web.uri }));

        return {
            detailedAnalysis: result?.detailedAnalysis || "Analyse technique indisponible pour le moment.",
            successProbability: result?.successProbability || "0%",
            riskAssessment: result?.riskAssessment || "High",
            aiOpinion: result?.aiOpinion || "L'IA n'a pas pu émettre d'avis précis.",
            matchDate: result?.matchDate || today,
            matchTime: result?.matchTime || "--:--",
            sources
        };
    } catch (error) {
        console.error("Erreur lors de l'analyse du match:", error);
        throw error;
    }
};
