
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version 4.2 Spéciale 2025
 * Optimisé pour la précision temporelle et la recherche réelle.
 */

const getAIInstance = () => {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        throw new Error("Configuration API incomplète. Vérifiez la variable API_KEY sur Vercel.");
    }
    return new GoogleGenAI({ apiKey });
};

// Fonction pour obtenir la date et l'heure actuelle à Paris de manière lisible pour l'IA
const getParisContext = () => {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        weekday: 'long'
    });
    return formatter.format(now);
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA.");
    
    let cleaned = text.trim();
    // Suppression des délimitations markdown
    cleaned = cleaned.replace(/```json/g, "").replace(/```/g, "").trim();
    
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            // Tentative de réparation des erreurs de syntaxe JSON communes
            try {
                const repaired = cleaned.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (inner) {
                console.error("JSON Parse Error:", cleaned);
                throw new Error("Erreur de formatage des données IA.");
            }
        }
    }
    throw new Error("L'IA n'a pas renvoyé de format exploitable.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const parisTime = getParisContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    // Prompt ultra-directif pour éviter les hallucinations de 2024
    const prompt = `CONTEXTE TEMPOREL CRITIQUE : Nous sommes le ${parisTime}. 
    L'année actuelle est 2025.
    
    MISSION : Utilise Google Search pour trouver 9 VRAIS matchs de sport professionnel prévus dans les prochaines 48 HEURES (donc en 2025 uniquement).
    REPARTITION : 3 Football, 3 Basketball, 3 Tennis.
    
    FORMAT DE RÉPONSE : Retourne UNIQUEMENT un objet JSON. 
    Interdiction d'inclure du texte avant ou après le JSON.
    
    STRUCTURE JSON :
    {
      "picks": [
        {
          "sport": "football",
          "match": "Nom Équipe A vs Nom Équipe B",
          "betType": "Type de pari conseillé",
          "probability": "XX%",
          "analysis": "Analyse ultra-courte de la forme actuelle en 2025",
          "confidence": "High",
          "matchDate": "JJ/MM/2025",
          "matchTime": "HH:MM (Heure de Paris)"
        }
      ]
    }
    Langue des textes : ${langName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }] // Recherche activée pour le real-time
      }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Error:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const parisTime = getParisContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    const prompt = `EXPERT ANALYSTE NEXTWIN PRO. 
    HEURE ACTUELLE (PARIS) : ${parisTime}. ANNÉE : 2025.
    
    CIBLE : ${request.match} (${request.sport}). TYPE DE PARI : ${request.betType}.
    
    INSTRUCTIONS :
    1. Utilise Google Search pour vérifier la date exacte et l'heure du match en 2025.
    2. Analyse la forme RECENTE (Saison 2024/2025).
    3. Produis un rapport JSON (${langName}) :
    {
      "detailedAnalysis": "Analyse technique basée sur les dernières infos 2025...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "JJ/MM/2025",
      "matchTime": "HH:MM (Heure de Paris)",
      "aiOpinion": "Verdict final en une phrase percutante"
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    
    // Extraction des sources pour prouver la véracité
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = groundingChunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
            title: c.web.title || 'Info Match Direct',
            uri: c.web.uri
        }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Erreur de connexion avec le moteur de recherche sportif.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Digital sports interface for ${request.match}, ${style} style, neon orange and black theme, futuristic 2025 aesthetics.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: visualPrompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Visual Generation Error:", error);
  }
  return undefined;
};
