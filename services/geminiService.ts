
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service to interact with the NextWin AI engine for sports analysis and daily picks.
 * Optimized for French precision, real-time roster accuracy, and 2024/2025 season validation.
 */

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "Analyse complète. Doit impérativement confirmer la ligue actuelle ET valider la présence des joueurs clés cités dans l'effectif actuel (2024/2025) via une recherche search spécifique.",
        },
        successProbability: {
            type: Type.STRING,
            description: "Pourcentage de réussite (ex: '72%').",
        },
        riskAssessment: {
            type: Type.STRING,
            description: "Niveau de risque (Low, Medium, High).",
        },
        matchDate: {
            type: Type.STRING,
            description: "Date officielle du match au format français (ex: 'Samedi 15 Mars 2025').",
        },
        matchTime: {
            type: Type.STRING,
            description: "Heure de coup d'envoi à Paris (CET/CEST).",
        },
        aiOpinion: {
            type: Type.STRING,
            description: "Verdict final professionnel."
        }
    },
    required: ["detailedAnalysis", "successProbability", "riskAssessment", "aiOpinion", "matchDate", "matchTime"],
};

const dailyPicksSchema = {
  type: Type.OBJECT,
  properties: {
    picks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sport: { type: Type.STRING, enum: ["football", "basketball", "tennis"] },
          match: { type: Type.STRING },
          betType: { type: Type.STRING },
          probability: { type: Type.STRING },
          analysis: { type: Type.STRING },
          confidence: { type: Type.STRING, enum: ["High", "Very High"] },
          matchDate: { type: Type.STRING },
          matchTime: { type: Type.STRING }
        },
        required: ["sport", "match", "betType", "probability", "analysis", "confidence", "matchDate", "matchTime"]
      }
    }
  },
  required: ["picks"]
};

const getParisTimeContext = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        dateStyle: 'full',
        timeStyle: 'long',
    });
    return formatter.format(now);
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';
  const timeContext = getParisTimeContext();

  const prompt = `
    RÔLE SYSTÈME: Moteur NextWin v4.0. 
    CONTEXTE TEMPOREL (PARIS): ${timeContext}

    INSTRUCTIONS CRITIQUES:
    1. RECHERCHE GOOGLE INDISPENSABLE: Trouve 9 matchs réels pour aujourd'hui ou demain.
    2. VÉRIFICATION EFFECTIFS: Avant de suggérer un pari (surtout buteur), vérifie via search que le joueur appartient bien au club indiqué pour la saison 2024/2025.
    3. RÉPONSE: JSON en ${languageFullName}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: dailyPicksSchema,
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    return result.picks || [];
  } catch (error) {
    console.error("Error fetching daily picks:", error);
    return [];
  }
};

const generateMockAnalysis = (request: AnalysisRequest, language: 'fr' | 'en' = 'en'): AnalysisResult['response'] => {
    return {
        detailedAnalysis: language === 'fr' 
            ? `Analyse experte NextWin pour ${request.match}.` 
            : `NextWin expert analysis for ${request.match}.`,
        successProbability: "65%",
        riskAssessment: 'Medium',
        matchDate: "À vérifier",
        matchTime: "--:--",
        aiOpinion: "Données indisponibles.",
        sources: []
    };
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!process.env.API_KEY) return generateMockAnalysis(request, language);
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';
  const timeContext = getParisTimeContext();

  const prompt = `
    RÔLE: Expert Analyste NextWin PRO - Spécialiste Data & Transferts.
    
    DATE RÉFÉRENCE (PARIS): ${timeContext}

    PROTOCOLE "ZERO HALLUCINATION" :
    1. RECHERCHE DES EFFECTIFS (Saison 2024/2025) : 
       - Si le pari est de type "Buteur" ou implique un joueur spécifique, tu DOIS faire une recherche Google pour confirmer son club actuel. 
       - INTERDICTION de te baser sur tes connaissances internes (ex: Mafouta n'est plus à Amiens, il est à Guingamp).
       - Vérifie le transfert le plus récent via des sites comme Transfermarkt ou L'Équipe.

    2. VÉRIFICATION DIVISION : Confirme la division exacte (Ligue 2, National, etc.) pour chaque équipe.
    
    3. ANALYSE DU PARI :
       - Sport: ${request.sport}
       - Match: ${request.match}
       - Type de pari: ${request.betType}

    4. FORMAT DE SORTIE : JSON uniquement (${languageFullName}).
       - Dans 'detailedAnalysis', commence par confirmer : "Effectifs et divisions vérifiés pour la saison 2024/2025 via Search."
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Modèle Pro indispensable pour croiser les sources de recherche
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            thinkingConfig: { thinkingBudget: 8000 } // Budget de réflexion augmenté pour valider les transferts
        }
    });
    
    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Source Roster Officielle',
            uri: chunk.web?.uri || '#'
          })).filter((s: any) => s.uri !== '#')
        : [];

    return { ...result, sources };
  } catch (error) {
    console.error("Error fetching analysis:", error);
    return generateMockAnalysis(request, language);
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  if (!process.env.API_KEY) return undefined;
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const visualPrompt = style === 'dashboard' 
    ? `Pro sports analytics dashboard for "${request.match}" (${request.sport}). Futuristic UI, stats, orange/blue theme.`
    : `Tactical top-down sports view for "${request.match}" (${request.sport}). Glowing neon arrows and heatmaps.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
};
