
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur d'Analyse Professionnel
 * Focus : Précision temporelle (Paris) et validation via Google Search
 */

const getAPIKey = async () => {
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
    if (!key || key === "undefined" || key === "null") return null;
    return key;
};

const getParisContext = () => {
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    }).format(new Date());
};

const extractJson = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Format de réponse invalide.");
    try {
        return JSON.parse(match[0]);
    } catch (e) {
        throw new Error("Erreur de traitement des données.");
    }
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return [];

  const timeNow = getParisContext();

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `DATE ET HEURE ACTUELLE À PARIS : ${timeNow}. 
    MISSION : Trouve 9 matchs RÉELS prévus pour aujourd'hui ou demain.
    RÉPARTITION OBLIGATOIRE : 3 Football, 3 Basketball, 3 Tennis.
    SOURCES : Utilise Google Search pour vérifier les heures de coup d'envoi (FUSEAU PARIS).
    
    IMPORTANT : Les heures doivent être EXACTES (heure française).
    
    FORMAT JSON UNIQUE : 
    {"picks": [
      {"sport": "football|basketball|tennis", "match": "A vs B", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "DD/MM/2025", "matchTime": "HH:MM"}
    ]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 2000 }
        }
    });
    
    const result = extractJson(response.text || "");
    return result.picks || [];
  } catch (error) {
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = await getAPIKey();
  if (!apiKey) throw new Error("Erreur de configuration.");

  const timeNow = getParisContext();

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `ANALYSEUR NEXTWIN EXPERT.
    MATCH : ${request.match} (${request.sport}). 
    PARI : ${request.betType}.
    HEURE PARIS : ${timeNow}.

    INSTRUCTIONS :
    1. Utilise Google Search pour les données réelles (absents, enjeux).
    2. Vérifie l'heure du match à Paris.
    3. Rapport technique en ${language === 'fr' ? 'français' : 'anglais'}.

    FORMAT JSON :
    {
      "detailedAnalysis": "...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "..."
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { 
            tools: [{ googleSearch: {} }],
            thinkingConfig: { thinkingBudget: 4000 }
        }
    });
    
    const result = extractJson(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    throw new Error("L'analyse n'a pas pu être générée.");
  }
};
