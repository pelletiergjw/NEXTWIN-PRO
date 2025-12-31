
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version PRODUCTION Vercel
 * Optimisé pour éviter les erreurs de parsing et les problèmes de quota.
 */

const getAIInstance = () => {
    // Tentative d'accès à la clé API injectée par Vite/Vercel
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        console.error("ERREUR CRITIQUE : La variable d'environnement API_KEY est vide ou non définie sur Vercel.");
        throw new Error("Configuration API manquante. Veuillez vérifier les variables d'environnement sur Vercel.");
    }
    return new GoogleGenAI({ apiKey });
};

const getParisContext = () => {
    return new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    }).format(new Date());
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Le moteur IA a renvoyé une réponse vide.");
    
    // Nettoyage des balises markdown et espaces superflus
    let cleaned = text.trim();
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Recherche du bloc JSON valide le plus large
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        const jsonContent = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(jsonContent);
        } catch (e) {
            console.error("Échec du parsing JSON initial. Contenu :", jsonContent);
            // Tentative de réparation (suppression des virgules traînantes)
            try {
                const repaired = jsonContent.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (innerE) {
                throw new Error("Format de données invalide reçu de l'IA.");
            }
        }
    }
    throw new Error("Impossible d'extraire des données structurées de l'analyse.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const lang = language === 'fr' ? 'Français' : 'English';

    const prompt = `NextWin Daily Engine. Date: ${timeNow}. Année: 2025.
    Mission: Utilise Google Search pour trouver 9 matchs réels (3 Foot, 3 Basket, 3 Tennis) prévus dans les prochaines 48h.
    Retourne UNIQUEMENT cet objet JSON sans aucun texte autour:
    {"picks": [{"sport": "football|basketball|tennis", "match": "Equipe A vs Equipe B", "betType": "...", "probability": "XX%", "analysis": "...", "confidence": "High", "matchDate": "JJ/MM/2025", "matchTime": "HH:MM"}]}
    Langue: ${lang}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });

    if (!response.text) return [];
    const result = extractJsonFromText(response.text);
    return result.picks || [];
  } catch (error) {
    console.error("Erreur Daily Picks:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const lang = language === 'fr' ? 'Français' : 'English';

    const prompt = `ANALYSEUR NEXTWIN PRO 2025.
    CIBLE: ${request.match} (${request.sport}). TYPE: ${request.betType}.
    DATE ACTUELLE: ${timeNow}.
    INSTRUCTIONS:
    1. Recherche via Google Search les compos, blessures et news de 2025.
    2. Réponds UNIQUEMENT via ce JSON:
    {
      "detailedAnalysis": "Analyse technique pro...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM",
      "aiOpinion": "Conseil final stratégique"
    }
    Langue: ${lang}.`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { tools: [{ googleSearch: {} }] }
    });
    
    if (!response.text) throw new Error("Réponse vide du moteur de recherche.");
    
    const result = extractJsonFromText(response.text);
    
    // Récupération des sources web pour la transparence
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({ title: c.web.title || 'Source Match', uri: c.web.uri }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Erreur détaillée Analyse:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
        throw new Error("Quota API dépassé (429). Veuillez patienter 1 minute et réessayer.");
    }
    throw new Error(error.message || "Une erreur inattendue est survenue lors de l'analyse.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Professional sports analytical ${style} visual for ${request.match} in 2025, neon orange and black theme, futuristic UI, 4K.`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (e) {
    console.warn("Échec génération visuel:", e);
  }
  return undefined;
};
