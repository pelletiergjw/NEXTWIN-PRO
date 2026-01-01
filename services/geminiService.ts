
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, DailyPick } from '../types';

/**
 * NEXTWIN QUANTUM ENGINE v9.0 - REAL-TIME TRUTH
 * Moteur optimisé pour l'exactitude des données sportives et la synchronisation CET/CEST.
 */

const API_KEY = process.env.API_KEY || "";

// Utilitaire de contexte temporel précis pour la France
const getParisContext = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Europe/Paris',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const formatter = new Intl.DateTimeFormat('fr-FR', options);
    const parts = formatter.formatToParts(now);
    const getPart = (type: string) => parts.find(p => p.type === type)?.value || "";
    
    const dateStr = `${getPart('day')}/${getPart('month')}/${getPart('year')}`;
    const timeStr = `${getPart('hour')}:${getPart('minute')}`;
    
    return { 
        full: `${dateStr} à ${timeStr} (Heure de Paris)`, 
        date: dateStr, 
        time: timeStr 
    };
};

// --- LOGIQUE DE ROUTAGE API ---
export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    if (!API_KEY || API_KEY.length < 10) {
        console.warn("NextWin : Clé API absente. Aucun pronostic fictif ne sera généré.");
        return []; // On ne renvoie rien pour éviter les bugs de lecture de faux matchs
    }

    const ctx = getParisContext();

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `CONTEXTE : Nous sommes le ${ctx.full}. 
            MISSION : Agis en tant qu'expert analyste sportif. Tu DOIS utiliser l'outil googleSearch pour identifier 9 matchs RÉELS (3 Foot, 3 Basket, 3 Tennis) programmés entre maintenant et demain soir.
            
            INSTRUCTIONS STRICTES :
            1. VÉRIFICATION : Utilise Google Search pour confirmer que les matchs existent vraiment (Calendriers ATP, NBA, Championnats Foot).
            2. ACTUALITÉS : Vérifie les blessures de dernière minute (ex: état de Mbappe, Curry, blessures à l'échauffement en Tennis).
            3. HEURES : Convertis toutes les heures de début en HEURE FRANÇAISE (CET/CEST).
            4. MARCHÉS : Propose des types de paris variés : Handicaps (Points/Sets), Over/Under, Victoires sèches, Buteurs.
            5. PROBABILITÉS : Calcule une probabilité basée sur les cotes réelles et la forme actuelle.
            6. SORTIE : Format JSON uniquement. Ne propose JAMAIS de match imaginaire.`,
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
                                    match: { type: Type.STRING, description: "Nom exact des opposants" },
                                    betType: { type: Type.STRING, description: "Type de pari (ex: Handicap -1.5, Buteur...)" },
                                    probability: { type: Type.STRING, description: "Format 00%" },
                                    analysis: { type: Type.STRING, description: "Analyse incluant blessés/absents réels" },
                                    confidence: { type: Type.STRING, enum: ['High', 'Very High'] },
                                    matchDate: { type: Type.STRING, description: "Format DD/MM/YYYY" },
                                    matchTime: { type: Type.STRING, description: "Format HH:MM (Heure de Paris)" }
                                },
                                required: ['sport', 'match', 'betType', 'probability', 'analysis', 'confidence', 'matchDate', 'matchTime']
                            }
                        }
                    }
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        return result.picks || [];
    } catch (error) {
        console.error("Erreur critique NextWin Engine:", error);
        return [];
    }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    const ctx = getParisContext();
    if (!API_KEY || API_KEY.length < 10) {
        return {
            detailedAnalysis: "Analyse impossible sans clé API. Connectez votre moteur Quantum.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Connexion Cloud requise.",
            matchDate: ctx.date,
            matchTime: ctx.time,
            sources: []
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `ANALYSE EXPERTE : Match ${request.match} (${request.sport}). Type de pari : ${request.betType}.
            Heure actuelle à Paris : ${ctx.full}.
            
            PROTOCOLE DE RECHERCHE OBLIGATOIRE :
            1. Recherche l'heure réelle du match et la date.
            2. Recherche la liste des blessés, suspendus et transferts récents impactant les deux camps.
            3. Analyse la météo et les stats H2H récentes (6 derniers mois).
            4. Détermine la probabilité mathématique exacte de succès.
            
            Réponds en ${language}. Toutes les heures doivent être en heure de Paris.`,
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
            detailedAnalysis: result.detailedAnalysis || "Échec de l'extraction des données.",
            successProbability: result.successProbability || "50%",
            riskAssessment: result.riskAssessment || "High",
            aiOpinion: result.aiOpinion || "Vérifiez les sources manuellement.",
            matchDate: result.matchDate || ctx.date,
            matchTime: result.matchTime || ctx.time,
            sources: result.sources || []
        };
    } catch (error) {
        return {
            detailedAnalysis: "Erreur réseau : Impossible de contacter le moteur de recherche.",
            successProbability: "0%",
            riskAssessment: "High",
            aiOpinion: "Service temporairement indisponible.",
            matchDate: ctx.date,
            matchTime: ctx.time,
            sources: []
        };
    }
};
