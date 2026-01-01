
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN QUANTUM ENGINE v8.0 - PRODUCTION READY
 * Système d'intelligence temps réel optimisé pour le marché français.
 */

const API_KEY = process.env.API_KEY || "";

// Utilitaire de gestion du temps (Heure de Paris obligatoire)
const getFrenchContext = () => {
    const now = new Date();
    const dateStr = now.toLocaleString('fr-FR', { 
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const timeStr = now.toLocaleString('fr-FR', { 
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit'
    });
    return { full: `${dateStr} à ${timeStr}`, date: dateStr, time: timeStr };
};

// --- MOTEUR DE SECOURS (MODE DÉMO / FALLBACK) ---
// Note : Si l'API Key est absente ou échoue, on ne renvoie plus de "faux matchs" réels
// mais des exemples pédagogiques pour ne pas induire le client en erreur.
const getHeuristicDailyPicks = (language: string): DailyPick[] => {
    const ctx = getFrenchContext();
    return [
        {
            sport: 'football',
            match: language === 'fr' ? "Match Simulation A vs B" : "Simulation Match A vs B",
            betType: "Plus de 2.5 buts",
            probability: "75%",
            analysis: language === 'fr' ? "MODE DÉMO : Connectez votre API Key pour voir les matchs réels d'aujourd'hui." : "DEMO MODE: Connect API Key for real-time matches.",
            confidence: 'High',
            matchDate: ctx.date,
            matchTime: "18:00"
        },
        {
            sport: 'basketball',
            match: language === 'fr' ? "Simulation NBA : Est vs Ouest" : "NBA Sim: East vs West",
            betType: "Vainqueur",
            probability: "60%",
            analysis: "Simulation statistique basée sur l'historique.",
            confidence: 'High',
            matchDate: ctx.date,
            matchTime: "02:00"
        },
        {
            sport: 'tennis',
            match: language === 'fr' ? "Exemple : Joueur X vs Joueur Y" : "Example: Player X vs Player Y",
            betType: "Nombre de Sets: 3",
            probability: "55%",
            analysis: "Modèle probabiliste de démonstration.",
            confidence: 'High',
            matchDate: ctx.date,
            matchTime: "14:00"
        }
    ];
};

// --- LOGIQUE DE ROUTAGE API ---
export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    if (!API_KEY || API_KEY.length < 10) return getHeuristicDailyPicks(language);

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const ctx = getFrenchContext();
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Nous sommes le ${ctx.full} à Paris.
            INSTRUCTIONS CRITIQUES :
            1. Utilise Google Search pour trouver 9 VRAIS matchs de sport (3 Foot, 3 Basket, 3 Tennis) qui ont lieu AUJOURD'HUI ou DEMAIN.
            2. Ne génère AUCUN match imaginaire. Si un match n'est pas programmé, cherche-en un autre.
            3. Vérifie les blessures majeures (ex: Mbappe, Vinicius, Durant, Sinner) et les suspensions.
            4. Toutes les heures doivent être au format français (CET/CEST).
            5. Calcule des probabilités réalistes pour : Victoire, Over/Under, Handicaps, ou Buteurs.
            6. Langue : ${language}.`,
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
                                    confidence: { type: Type.STRING, enum: ['High', 'Very High'] },
                                    matchDate: { type: Type.STRING },
                                    matchTime: { type: Type.STRING }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'confidence', 'matchDate', 'matchTime']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        return result.picks || getHeuristicDailyPicks(language);
    } catch (error) {
        console.error("NextWin Engine Failover");
        return getHeuristicDailyPicks(language);
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    const ctx = getFrenchContext();
    if (!API_KEY || API_KEY.length < 10) {
        return {
            detailedAnalysis: "Mode Dégradé : Analyse Quantum impossible sans clé API valide.",
            successProbability: "50%",
            riskAssessment: "Medium",
            aiOpinion: "Pari non analysé en temps réel.",
            matchDate: ctx.date,
            matchTime: ctx.time,
            sources: []
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse détaillée pour ${request.match} (${request.sport}) sur le pari "${request.betType}".
            Heure actuelle à Paris : ${ctx.full}.
            
            ÉTAPE 1 : Recherche Google Search sur l'actualité du match (blessés, suspendus, météo, enjeux).
            ÉTAPE 2 : Analyse des cotes et probabilités mathématiques.
            ÉTAPE 3 : Vérification de l'heure exacte du coup d'envoi à Paris.
            
            Rédige en ${language}.`,
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
        return {
            detailedAnalysis: result.detailedAnalysis || "Analyse indisponible.",
            successProbability: result.successProbability || "60%",
            riskAssessment: result.riskAssessment || "Medium",
            aiOpinion: result.aiOpinion || "Avis réservé.",
            matchDate: result.matchDate || ctx.date,
            matchTime: result.matchTime || ctx.time,
            sources: result.sources || []
        };
    } catch (error) {
        return {
            detailedAnalysis: "Erreur de connexion aux serveurs de recherche.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Échec de l'analyse.",
            matchDate: ctx.date,
            matchTime: ctx.time,
            sources: []
        };
    }
};
