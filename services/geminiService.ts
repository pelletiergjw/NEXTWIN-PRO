
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Extrait le JSON de manière ultra-robuste, même si l'IA ajoute du texte autour ou des balises markdown.
 */
const extractJson = (text: string) => {
    try {
        // Supprime les balises markdown json si présentes
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const firstBracket = cleanText.indexOf('{');
        const lastBracket = cleanText.lastIndexOf('}');
        
        if (firstBracket !== -1 && lastBracket !== -1) {
            const jsonString = cleanText.substring(firstBracket, lastBracket + 1);
            return JSON.parse(jsonString);
        }
    } catch (e) {
        console.error("Erreur critique de parsing JSON IA:", e, "Texte reçu:", text);
    }
    return null;
};

const getAIInstance = () => {
    // Vite remplace process.env.API_KEY lors du build GitHub Actions.
    // On récupère la valeur brute injectée.
    const apiKey = process.env.API_KEY;
    
    // Si la clé est absente ou n'a pas été remplacée (cas local sans env)
    if (!apiKey || apiKey === "" || apiKey === "process.env.API_KEY" || apiKey === "undefined") {
        console.error("ERREUR : Clé API non détectée. Vérifiez vos Secrets GitHub (API_KEY).");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

/**
 * Récupère les 9 pronostics du jour (3 par sport) basés sur des matchs RÉELS.
 */
export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    // Calcul de la date actuelle à Paris pour le prompt
    const nowInParis = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date());

    try {
        const prompt = `Utilise Google Search pour trouver 9 matchs de sport RÉELS prévus pour aujourd'hui ou demain (date de référence actuelle à Paris : ${nowInParis}).
        Répartition impérative : 3 Football, 3 Basketball, 3 Tennis.
        
        Pour chaque match, tu dois fournir :
        - Le nom exact du match (Equipe A vs Equipe B)
        - Le type de pari (ex: Victoire Equipe A, Plus de 2.5 buts, etc.)
        - La probabilité de réussite (ex: 78%)
        - Une analyse courte (2 phrases)
        - La confiance (High ou Very High)
        - La date et l'heure EXACTE DE PARIS.

        Réponds UNIQUEMENT avec cet objet JSON :
        {
          "picks": [
            {
              "sport": "football",
              "match": "Nom du Match",
              "betType": "Type de Pari",
              "probability": "00%",
              "analysis": "Analyse...",
              "confidence": "High",
              "matchDate": "JJ/MM",
              "matchTime": "HH:MM"
            }
          ]
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es l'analyste expert de NextWin. Ton sérieux dépend de la véracité des matchs. Utilise Google Search pour vérifier les horaires réels à Paris. Réponds exclusivement en JSON pur."
            }
        });

        const result = extractJson(response.text || "");
        if (result && result.picks && Array.isArray(result.picks)) {
            return result.picks;
        }
        
        return [];
    } catch (error) {
        console.error("Erreur DailyPicks:", error);
        throw error;
    }
};

/**
 * Analyse approfondie d'un match spécifique via recherche web.
 */
export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    const ai = getAIInstance();
    if (!ai) throw new Error("API_KEY_MISSING");

    const nowInParis = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris' }).format(new Date());

    try {
        const prompt = `Analyse expert via Google Search pour le match : ${request.match} (${request.betType}).
        Vérifie les compositions, blessures et dynamiques réelles pour la date du ${nowInParis}.
        
        Toutes les heures citées doivent être à l'heure de PARIS.
        
        Réponds UNIQUEMENT en JSON :
        {
          "detailedAnalysis": "Analyse technique exhaustive...",
          "successProbability": "00%",
          "riskAssessment": "Low/Medium/High",
          "aiOpinion": "Conseil stratégique final...",
          "matchDate": "Date réelle",
          "matchTime": "Heure de Paris"
        }`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                systemInstruction: "Tu es un analyste pro. Utilise Google Search pour obtenir des données factuelles et récentes. Heure de Paris obligatoire. Format JSON pur."
            }
        });

        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source Web', uri: c.web.uri }));

        return {
            detailedAnalysis: result?.detailedAnalysis || "L'IA n'a pas pu générer une analyse détaillée.",
            successProbability: result?.successProbability || "50%",
            riskAssessment: result?.riskAssessment || "High",
            aiOpinion: result?.aiOpinion || "Données insuffisantes pour un avis tranché.",
            matchDate: result?.matchDate || "N/A",
            matchTime: result?.matchTime || "N/A",
            sources
        };
    } catch (error) {
        console.error("Erreur BetAnalysis:", error);
        throw error;
    }
};
