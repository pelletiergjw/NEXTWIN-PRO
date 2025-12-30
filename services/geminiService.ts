
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service to interact with the NextWin AI engine for sports analysis and daily picks.
 * Optimized for French precision, real-time accuracy, and 2024/2025 season validation.
 */

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "Analyse complète. Doit impérativement confirmer la ligue actuelle (ex: Ligue 2, National) des deux équipes pour la saison 2024/2025 après vérification search.",
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
            description: "Date officielle du match au format français (ex: 'Samedi 15 Mars 2025'). Doit correspondre à la date en France.",
        },
        matchTime: {
            type: Type.STRING,
            description: "Heure de coup d'envoi précise au format français (ex: '20:45'). Doit être l'heure de Paris (CET/CEST).",
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
          matchDate: { type: Type.STRING, description: "Date du match en France." },
          matchTime: { type: Type.STRING, description: "Heure de Paris (CET/CEST)." }
        },
        required: ["sport", "match", "betType", "probability", "analysis", "confidence", "matchDate", "matchTime"]
      }
    }
  },
  required: ["picks"]
};

/**
 * Gets the current time in Paris to provide as anchor for the AI.
 */
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
    1. RECHERCHE GOOGLE OBLIGATOIRE: Trouve 9 matchs réels prévus AUJOURD'HUI ou DEMAIN.
    2. VÉRIFICATION DIVISION: Assure-toi que les équipes sont dans leur division officielle 2024/2025. 
    3. SYNCHRONISATION HORAIRE: Convertis tous les horaires trouvés en HEURE DE PARIS (CET/CEST).
    4. SELECTION: Exactement 3 Foot, 3 Basket, 3 Tennis.
    5. RÉPONSE: JSON en ${languageFullName}.
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
        aiOpinion: "Analyse indisponible pour le moment.",
        sources: []
    };
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  if (!process.env.API_KEY) {
      return generateMockAnalysis(request, language);
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';
  const timeContext = getParisTimeContext();

  const prompt = `
    RÔLE: Expert Analyste NextWin PRO. Précision de données absolue.
    ERREUR INTERDITE SUR LES DIVISIONS ET HORAIRES.
    
    DATE ET HEURE ACTUELLE À PARIS: ${timeContext}

    PROTOCOLE OBLIGATOIRE:
    1. VÉRIFICATION SEARCH: Recherche l'état actuel des deux équipes (${request.match}). 
    2. VALIDATION LIGUE: Confirme impérativement la division/ligue pour la saison 2024/2025. 
       Ex: Si Nancy est en National et Amiens en Ligue 2, tu dois l'énoncer clairement.
    3. CALENDRIER: Trouve la date et l'heure exacte du match. Convertis en HEURE FRANÇAISE (Paris).
       Si le match est déjà fini par rapport à "${timeContext}", signale-le.
    4. ANALYSE PROFONDE: Stats, blessés, enjeux.
    
    DEMANDE UTILISATEUR:
    - Sport: ${request.sport}
    - Match: ${request.match}
    - Type de pari: ${request.betType}

    RÉPONDRE EN JSON (${languageFullName}).
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', // Passage au modèle Pro pour une meilleure logique de recherche
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            thinkingConfig: { thinkingBudget: 4000 } // Autorise la réflexion pour réconcilier les données search
        }
    });
    
    const text = response.text || "{}";
    const result = JSON.parse(text.trim());
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: GroundingSource[] = groundingChunks 
        ? groundingChunks.map((chunk: any) => ({
            title: chunk.web?.title || 'Donnée Officielle',
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
  
  let visualPrompt = '';
  if (style === 'dashboard') {
    visualPrompt = `Futuristic pro sports analytics dashboard for "${request.match}". Win probabilities, data charts, neon orange/deep blue, 4K realistic UI.`;
  } else {
    visualPrompt = `Tactical tactical sports view for "${request.match}". Top-down dark pitch with neon glowing tactical arrows and heatmaps. High-tech.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating visual analysis:", error);
    return undefined;
  }
};
