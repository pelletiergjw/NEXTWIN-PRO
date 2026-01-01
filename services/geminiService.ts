
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN REALITY CHECK ENGINE v13.0
 * PROTOCOLE ZÉRO TOLÉRANCE ANTI-HALLUCINATION
 */

const API_KEY = process.env.API_KEY || "";

const getParisTime = () => {
    return new Date().toLocaleString('fr-FR', { 
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    if (!API_KEY || API_KEY.length < 10) return [];

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const todayStr = getParisTime();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `Date du jour : ${todayStr} (Heure de Paris). Mission de VÉRIFICATION DE LA RÉALITÉ.

            INSTRUCTIONS IMPÉRATIVES :
            1. EXÉCUTE une recherche Google avec les termes EXACTS : "matchs de football aujourd'hui sur Flashscore".
            2. EXÉCUTE une recherche Google avec les termes EXACTS : "NBA schedule today ESPN".
            3. EXÉCUTE une recherche Google avec les termes EXACTS : "ATP Tour schedule today".
            4. Pour 3 matchs de chaque sport (9 au total) qui ont lieu AUJOURD'HUI ou DEMAIN, extrais les informations.
            5. Pour CHAQUE match, tu DOIS fournir une URL DIRECTE et VALIDE ('sourceUrl') vers la page du match (ex: https://www.flashscore.fr/match/...).
            6. Si l'URL n'est pas trouvée ou si le match n'est pas confirmé pour aujourd'hui/demain, le match est REJETÉ. Ne l'inclus PAS.
            7. INTERDICTION ABSOLUE d'inventer des matchs. Si le Bayern ne joue pas, il ne doit PAS apparaître.
            8. Positionne le champ 'isVerified' à 'true' SEULEMENT si tu as suivi les étapes 1 à 6.`,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 2500 },
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
                                    matchTime: { type: Type.STRING },
                                    sourceUrl: { type: Type.STRING, description: "URL réelle du match vérifiée via Google" },
                                    isVerified: { type: Type.BOOLEAN, description: "Doit être TRUE si le match a été trouvé via Google Search pour aujourd'hui ou demain." }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'matchDate', 'matchTime', 'sourceUrl', 'isVerified']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        
        if (result.picks) {
            // DOUBLE FILTRAGE DE SÉCURITÉ : on ne garde que les matchs que l'IA a explicitement validés ET qui ont une URL crédible.
            return result.picks.filter((p: DailyPick) => 
                p.isVerified === true &&
                p.sourceUrl && (p.sourceUrl.includes('flashscore') || p.sourceUrl.includes('lequipe') || p.sourceUrl.includes('espn') || p.sourceUrl.includes('atptour') || p.sourceUrl.includes('nba.com'))
            );
        }
        return [];
    } catch (error) {
        console.error("Reality Check Engine Error:", error);
        return [];
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    if (!API_KEY || API_KEY.length < 10) return { detailedAnalysis: "Clé API invalide.", successProbability: "0%", riskAssessment: "High", aiOpinion: "Erreur", sources: [] };

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const today = getParisTime();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: `MISSION D'ANALYSE SÉCURISÉE pour le match : ${request.match}. Pari : ${request.betType}. Date du jour : ${today}.

            ÉTAPE 1 (OBLIGATOIRE) : VÉRIFICATION D'EXISTENCE
            - Utilise Google Search pour confirmer que ce match a bien lieu aujourd'hui ou dans les prochaines 48h.
            - SI LE MATCH N'EST PAS TROUVÉ, arrête l'analyse et renvoie un message d'erreur clair dans 'detailedAnalysis'.

            ÉTAPE 2 (SI LE MATCH EXISTE) : ANALYSE APPROFONDIE
            - Recherche les compositions probables, les blessés de dernière minute et la dynamique des équipes.
            - Fournis une analyse détaillée, probabilité, risque et ton avis.`,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 1500 },
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
            detailedAnalysis: "Analyse impossible. Le match n'a pas pu être vérifié en temps réel via Google Search.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Échec de la vérification. L'analyse est annulée par mesure de sécurité.",
            sources: []
        };
    }
};
