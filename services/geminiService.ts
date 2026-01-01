
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN QUANTUM SEARCH ENGINE v11.0
 * AUCUNE DONNÉE FICTIVE TOLÉRÉE. RECHERCHE GOOGLE OBLIGATOIRE.
 */

const API_KEY = process.env.API_KEY || "";

const getParisContext = () => {
    return new Date().toLocaleString('fr-FR', { 
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<any[]> => {
    if (!API_KEY || API_KEY.length < 10) return [];

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const today = getParisContext();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `AUJOURD'HUI : ${today} à Paris.
            
            MISSION CRITIQUE : 
            1. Utilise GOOGLE SEARCH pour trouver 9 matchs RÉELS se déroulant entre MAINTENANT et DEMAIN SOIR.
            2. Tu DOIS chercher spécifiquement sur : "Flashscore matches aujourd'hui", "L'équipe calendrier foot", "NBA schedule today", "ATP live scores".
            3. INTERDIT de citer : Bayern vs Dortmund, Real vs Barca ou tout match classique s'ils ne jouent pas VRAIMENT.
            4. Pour chaque match, vérifie les absences réelles (ex: blessure de Mbappé, absence de Curry).
            5. Si tu n'as pas de certitude via la recherche, ne propose pas le match.
            
            SORTIE : JSON avec les champs 'match', 'sport', 'betType', 'probability', 'analysis', 'matchDate', 'matchTime'.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        picks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    sport: { type: Type.STRING, enum: ['football', 'basketball', 'tennis'] },
                                    match: { type: Type.STRING },
                                    betType: { type: Type.STRING },
                                    probability: { type: Type.STRING },
                                    analysis: { type: Type.STRING },
                                    matchDate: { type: Type.STRING },
                                    matchTime: { type: Type.STRING }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'matchDate', 'matchTime']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        const grounding = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        // On attache les sources réelles à chaque pronostic pour prouver la véracité
        if (result.picks) {
            return result.picks.map((p: any) => ({
                ...p,
                sources: grounding.map((g: any) => g.web?.uri).filter(Boolean).slice(0, 2)
            }));
        }
        return [];
    } catch (error) {
        console.error("Erreur Moteur Search:", error);
        return [];
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    if (!API_KEY || API_KEY.length < 10) return { detailedAnalysis: "Erreur Clé", successProbability: "0%", riskAssessment: "High", aiOpinion: "Error", sources: [] };

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const today = getParisContext();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse RECHERCHÉE pour : ${request.match} (${request.sport}). Pari : ${request.betType}.
            Date et Heure à Paris : ${today}.
            1. Effectue une recherche Google sur l'état de forme RÉEL des équipes/joueurs.
            2. Vérifie la liste des blessés du jour.
            3. Cite les dernières cotes réelles du marché.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        detailedAnalysis: { type: Type.STRING },
                        successProbability: { type: Type.STRING },
                        riskAssessment: { type: Type.STRING },
                        aiOpinion: { type: Type.STRING },
                        matchDate: { type: Type.STRING },
                        matchTime: { type: Type.STRING },
                        sources: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    uri: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        return JSON.parse(response.text || "{}");
    } catch (error) {
        return {
            detailedAnalysis: "L'IA n'a pas pu confirmer l'existence de ce match ou les données sont indisponibles via Google Search.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Analyse annulée par sécurité.",
            sources: []
        };
    }
};
