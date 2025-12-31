
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Moteur v4.5 "Real-Time Verified"
 */

const getAPIKey = () => {
    const key = (process.env.API_KEY) || 
                (import.meta as any).env?.VITE_API_KEY || 
                (window as any).process?.env?.API_KEY;
    
    return (!key || key === "undefined") ? null : key;
};

// Récupère l'heure exacte de Paris pour synchroniser l'IA
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

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse IA vide.");
    let cleaned = text.trim();
    if (cleaned.includes("```")) {
        cleaned = cleaned.split(/```(?:json)?/)[1]?.split("```")[0]?.trim() || cleaned;
    }
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
        try {
            return JSON.parse(cleaned.substring(start, end + 1));
        } catch (e) {
            throw new Error("Erreur de structure des données.");
        }
    }
    throw new Error("Données structurées introuvables.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const apiKey = getAPIKey();
  if (!apiKey) return [];

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `CONTEXTE TEMPOREL : Nous sommes le ${timeNow} (Heure de Paris).
    MISSION : Trouve 9 matchs RÉELS prévus entre aujourd'hui et après-demain via Google Search.
    CONSIGNES DE FIABILITÉ :
    1. Vérifie les dates et heures exactes sur des sites officiels. 
    2. Convertis impérativement les heures au fuseau horaire de PARIS (CET/CEST).
    3. Vérifie l'effectif actuel 2024/2025. Ne cite aucun joueur transféré (ex: Louis Mafouta n'est plus à Amiens).
    
    RETOURNE UNIQUEMENT CE JSON :
    {"picks": [{"sport": "football|basketball|tennis", "match": "Equipe A vs Equipe B", "betType": "...", "probability": "XX%", "analysis": "Analyse courte en ${langLabel}", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    const result = extractJsonFromText(response.text || "");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  const apiKey = getAPIKey();
  if (!apiKey) throw new Error("Clé API manquante dans l'environnement Vercel.");

  try {
    const ai = new GoogleGenAI({ apiKey });
    const timeNow = getParisContext();
    const langLabel = language === 'fr' ? 'français' : 'english';

    const prompt = `ANALYSEUR EXPERT NEXTWIN. 
    Match : ${request.match}. Sport : ${request.sport}. Type de pari : ${request.betType}.
    Context : ${timeNow} (Heure de Paris).

    PROTOCOLE DE VÉRIFICATION OBLIGATOIRE :
    1. UTILISE GOOGLE SEARCH pour trouver la date et l'heure EXACTES du match.
    2. VÉRIFIE LES TRANSFERTS 2024/2025 : Assure-toi que les joueurs cités sont bien présents dans le club (ex: Pas de Mafouta à Amiens).
    3. VÉRIFIE LES BLESSURES ET SUSPENSIONS actuelles pour ce match précis.
    4. ANALYSE : Propose une analyse technique crédible basée sur ces faits réels.
    5. HEURE : Affiche l'heure uniquement au format français (Paris).

    FORMAT DE SORTIE (JSON UNIQUEMENT) :
    {
      "detailedAnalysis": "Analyse pro en ${langLabel} (min 150 mots) incluant blessés et forme réelle...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil d'expert en ${langLabel}..."
    }
    Langue : ${langLabel}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Info Match', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Erreur de communication avec le moteur de recherche sportif.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  const apiKey = getAPIKey();
  if (!apiKey) return undefined;
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-tech sports visual for ${request.match}, professional betting UI style, neon highlights.` }] },
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {}
  return undefined;
};
