
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN ULTIMATE TRUTH ENGINE v12.0
 * PROTOCOLE ANTI-HALLUCINATION : RECHERCHE FORCÉE AVEC PREUVE URL
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

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<any[]> => {
    if (!API_KEY || API_KEY.length < 10) return [];

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const todayStr = getParisTime();

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Passage au modèle Pro pour une meilleure gestion du search
            contents: `Aujourd'hui nous sommes le ${todayStr}. 
            
            TACHE : Trouve 9 matchs RÉELS (3 Foot, 3 Basket, 3 Tennis) programmés pour AUJOURD'HUI ou DEMAIN.
            
            RÈGLES CRITIQUES :
            1. Utilise Google Search pour vérifier les calendriers sur Flashscore, L'Équipe, ou ESPN.
            2. Tu DOIS fournir pour chaque match une 'sourceUrl' réelle (ex: lien vers le match sur flashscore).
            3. Si tu ne trouves pas de match réel pour un sport, laisse la liste vide pour ce sport. 
            4. NE CITE PAS de matchs comme Bayern vs Dortmund ou Real vs Barca s'ils ne jouent pas aujourd'hui.
            5. Vérifie les blessés réels (ex: Est-ce que Curry ou Mbappé jouent vraiment ce soir ?).`,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 2000 }, // Force le raisonnement sur la date
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
                                    sourceUrl: { type: Type.STRING, description: "URL réelle du match vérifiée via Google" }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'matchDate', 'matchTime', 'sourceUrl']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        
        if (result.picks) {
            // Filtrage de sécurité : on ne garde que les matchs qui ont une URL source crédible
            return result.picks.filter((p: any) => 
                p.sourceUrl && (p.sourceUrl.includes('flashscore') || p.sourceUrl.includes('lequipe') || p.sourceUrl.includes('espn') || p.sourceUrl.includes('atptour'))
            );
        }
        return [];
    } catch (error) {
        console.error("Search Engine Error:", error);
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
            contents: `Analyse détaillée pour : ${request.match}. Pari : ${request.betType}.
            Date actuelle : ${today}.
            Effectue une recherche approfondie sur les compositions d'équipes et les blessés de DERNIÈRE MINUTE.`,
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
            detailedAnalysis: "Analyse impossible. Le match n'a pas pu être vérifié en temps réel.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Échec de la vérification Google Search.",
            sources: []
        };
    }
};
