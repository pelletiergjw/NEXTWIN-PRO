
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur d'Analyse Professionnel
 * Intégration Google Search & Thinking Process
 */

const getAPIKey = async () => {
    // Utilisation de la clé API configurée dans l'environnement
    const key = process.env.API_KEY || (import.meta as any).env?.VITE_API_KEY;
    if (!key || key === "undefined" || key === "null") return null;
    return key;
};

const getParisTime = () => {
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

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `DATE : ${getParisTime()}. 
    MISSION : Génère 9 pronostics sportifs réels (3 Foot, 3 Basket, 3 Tennis).
    SOURCES : Utilise Google Search pour vérifier les derniers effectifs et cotes.
    FORMAT JSON : {"picks": [{"sport": "...", "match": "...", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

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

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `ANALYSEUR NEXTWIN EXPERT.
    MATCH : ${request.match} (${request.sport}). 
    PARI : ${request.betType}.
    CONTEXTE : ${getParisTime()}.

    INSTRUCTIONS :
    1. Utilise Google Search pour obtenir les données actuelles (effectifs, blessures, transferts).
    2. Analyse la dynamique des deux équipes.
    3. Rédige un rapport professionnel en ${language === 'fr' ? 'français' : 'anglais'}.

    FORMAT JSON :
    {
      "detailedAnalysis": "...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "...",
      "matchTime": "...",
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
    throw new Error("L'analyse n'a pas pu être générée. Veuillez réessayer.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = await getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional sports tactical visualization for ${request.match}.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
