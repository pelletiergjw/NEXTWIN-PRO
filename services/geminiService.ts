
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN REAL-TIME ENGINE v10.0
 * Moteur de vérité : recherche web obligatoire, suppression des données fictives.
 */

const API_KEY = process.env.API_KEY || "";

const getParisTimeContext = () => {
    const now = new Date();
    return now.toLocaleString('fr-FR', { 
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    if (!API_KEY || API_KEY.length < 10) return [];

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const currentContext = getParisTimeContext();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Aujourd'hui nous sommes le ${currentContext} à Paris.
            
            INSTRUCTIONS DE VÉRITÉ ABSOLUE :
            1. Utilise Google Search pour consulter les calendriers réels sur Flashscore, L'Équipe ou ESPN.
            2. Trouve 9 matchs RÉELS qui se jouent AUJOURD'HUI ou DEMAIN (3 Foot, 3 Basket, 3 Tennis).
            3. INTERDICTION FORMELLE d'inventer des matchs (ex: pas de Bayern vs Dortmund s'ils ne jouent pas aujourd'hui).
            4. Vérifie les dernières news : blessures (ex: Mbappe, Curry, Alcaraz), suspensions et enjeux.
            5. Si un sport n'a pas de match majeur, cherche dans une ligue secondaire RÉELLE.
            
            Réponds en JSON uniquement.`,
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
                                    match: { type: Type.STRING, description: "Vrais noms des équipes/joueurs" },
                                    betType: { type: Type.STRING },
                                    probability: { type: Type.STRING },
                                    analysis: { type: Type.STRING },
                                    matchDate: { type: Type.STRING },
                                    matchTime: { type: Type.STRING, description: "Heure française" }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'matchDate', 'matchTime']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        // On récupère aussi les sources web pour preuve
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        
        if (result.picks) {
            return result.picks.map((p: any) => ({
                ...p,
                confidence: parseInt(p.probability) > 75 ? 'Very High' : 'High',
                sources: sources.map((s: any) => s.web?.uri).filter(Boolean).slice(0, 2)
            }));
        }
        return [];
    } catch (error) {
        console.error("Erreur Moteur NextWin:", error);
        return [];
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    if (!API_KEY || API_KEY.length < 10) return {
        detailedAnalysis: "Clé API invalide.",
        successProbability: "0%",
        riskAssessment: "High",
        aiOpinion: "Erreur",
        sources: []
    };

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const currentContext = getParisTimeContext();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse précise pour le match : ${request.match}. 
            Type de pari : ${request.betType}. 
            Date actuelle : ${currentContext}.
            
            RECHERCHE OBLIGATOIRE :
            - Le match existe-t-il vraiment à cette date ?
            - Compositions d'équipes et blessés réels.
            - Dynamique des 5 derniers matchs.
            - Météo et cotes actuelles.`,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        detailedAnalysis: { type: Type.STRING },
                        successProbability: { type: Type.STRING },
                        riskAssessment: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
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

        const result = JSON.parse(response.text || "{}");
        return result;
    } catch (error) {
        return {
            detailedAnalysis: "Le match demandé semble inexistant ou l'IA n'a pas pu confirmer les données en temps réel.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Analyse annulée par sécurité.",
            sources: []
        };
    }
};
