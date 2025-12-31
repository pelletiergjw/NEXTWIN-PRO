
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service to interact with the NextWin AI engine for sports analysis and daily picks.
 * Optimized for French precision, CET/CEST time accuracy, roster integrity, and 2024/2025 season validation.
 */

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        detailedAnalysis: {
            type: Type.STRING,
            description: "Analyse complète. Doit confirmer la ligue actuelle (2024/2025) et valider la présence des joueurs dans l'effectif actuel via Search.",
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
            description: "Date officielle du match en France (ex: 'Samedi 15 Mars 2025'). Ne pas utiliser de date américaine.",
        },
        matchTime: {
            type: Type.STRING,
            description: "Heure de coup d'envoi impérativement convertie en HEURE DE PARIS (CET/CEST) au format HH:mm. C'est critique pour les matchs US (NBA).",
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
          matchDate: { type: Type.STRING, description: "Date en France (CET/CEST)." },
          matchTime: { type: Type.STRING, description: "Heure précise de Paris (HH:mm)." }
        },
        required: ["sport", "match", "betType", "probability", "analysis", "confidence", "matchDate", "matchTime"]
      }
    }
  },
  required: ["picks"]
};

/**
 * Gets a precise localized time context for Paris to help the AI anchor its search results.
 */
const getParisTimeContext = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        dateStyle: 'full',
        timeStyle: 'medium',
    });
    return formatter.format(now);
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const languageFullName = language === 'fr' ? 'French' : 'English';
  const timeContext = getParisTimeContext();

  const prompt = `
    RÔLE SYSTÈME: Moteur NextWin v4.0. 
    CONTEXTE TEMPOREL RÉEL (PARIS, FRANCE): ${timeContext}

    PROTOCOLE "NEXTWIN TIME PRECISION" :
    1. RECHERCHE SEARCH: Identifie 9 matchs réels prévus dans les 24-48h.
    2. CONVERSION HORAIRE OBLIGATOIRE: Trouve l'heure locale du match et convertis-la systématiquement en HEURE DE PARIS (CET/CEST). 
       Exemple: Un match NBA à 8 PM ET doit être converti en 02:00 (le lendemain) à Paris.
    3. VÉRIFICATION ROSTERS: Confirme l'effectif 2024/2025 avant toute mention de joueur.
    4. RÉPONSE: JSON en ${languageFullName}. Utilise uniquement l'heure française.
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
    RÔLE: Expert Analyste NextWin PRO - Spécialiste Data, Transferts et Prévisions Stratégiques.
    
    CONTEXTE TEMPOREL (PARIS, FRANCE): ${timeContext}

    PROTOCOLE "NEXTWIN PRECISION & PREDICTION" :
    1. VÉRIFICATION TEMPORELLE (CRITIQUE) :
       - Recherche la date et l'heure locale exacte de la PROCHAINE rencontre entre ces deux entités : ${request.match}.
       - CONVERTIS CET HORAIRE EN HEURE DE PARIS (CET/CEST).
       - Si le match est prévu dans le futur (même dans plusieurs jours/semaines), tu DOIS impérativement fournir une ANALYSE PRÉVISIONNELLE complète.
       - Ne refuse JAMAIS une analyse sous prétexte que le match n'a pas lieu aujourd'hui. Les clients utilisent NextWin pour se projeter.
       - Si le match est fini par rapport à "${timeContext}", mentionne-le et donne le score si disponible, mais fournis tout de même une analyse rétrospective de la performance.

    2. VÉRIFICATION EFFECTIFS (Saison 2024/2025) : 
       - Utilise Search pour confirmer le club actuel de chaque joueur et la forme récente des équipes.
       - Toute hallucination sur un effectif est une faute grave.

    3. ANALYSE :
       - Sport: ${request.sport}
       - Match: ${request.match}
       - Pari: ${request.betType}

    RÉPONDRE EN JSON (${languageFullName}).
    Le champ 'matchTime' doit être l'heure de Paris (format HH:mm).
    Le champ 'matchDate' doit être la date réelle trouvée via Search.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
            responseSchema: responseSchema,
            thinkingConfig: { thinkingBudget: 12000 }
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
