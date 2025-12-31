
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version PRO Ultra-Fiable 2025
 * Utilise Gemini 3 Pro pour une recherche web de haute précision et un raisonnement complexe.
 */

const getAIInstance = () => {
    // Vite injects process.env.API_KEY via the define config in vite.config.ts
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        console.error("NextWin Error: API_KEY is missing in environment.");
        throw new Error("Configuration API incomplète sur Vercel. Assurez-vous d'avoir ajouté API_KEY dans les variables d'environnement.");
    }
    return new GoogleGenAI({ apiKey });
};

// Obtenir le contexte temporel précis de Paris
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
    if (!text) throw new Error("Réponse vide du moteur IA.");
    
    // Nettoyage rigoureux du texte pour extraire le JSON
    let cleaned = text.trim();
    
    // Supprimer les blocs de code Markdown si présents
    if (cleaned.includes("```json")) {
        cleaned = cleaned.split("```json")[1].split("```")[0];
    } else if (cleaned.includes("```")) {
        cleaned = cleaned.split("```")[1].split("```")[0];
    }
    
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
        cleaned = cleaned.substring(start, end + 1);
        try {
            return JSON.parse(cleaned);
        } catch (e) {
            // Tentative de réparation de JSON mal formé (virgules traînantes)
            try {
                const repaired = cleaned.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (inner) {
                console.error("Parsing Error details:", cleaned);
                throw new Error("Le format des données renvoyées par l'IA est invalide.");
            }
        }
    }
    throw new Error("Aucune donnée structurée (JSON) n'a été trouvée dans la réponse.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    // Utilisation de Gemini 3 Pro pour la recherche temps réel complexe
    const prompt = `NextWin AI Engine. 
    DATE ACTUELLE (PARIS) : ${timeNow}. 
    ANNEE : 2025 (Important: Ignore tout match de 2024 ou avant).
    
    MISSION : Utilise Google Search pour identifier 9 VRAIS matchs de sport professionnel prévus dans les prochaines 48 HEURES.
    - 3 Football (Ligue 1, Premier League, Liga, Champions League...)
    - 3 Basketball (NBA, Euroleague...)
    - 3 Tennis (ATP, WTA...)
    
    FORMAT DE SORTIE : Réponds UNIQUEMENT avec un objet JSON valide. Pas de texte avant ou après.
    
    STRUCTURE JSON :
    {
      "picks": [
        {
          "sport": "football" | "basketball" | "tennis",
          "match": "Nom de l'équipe A vs Nom de l'équipe B",
          "betType": "Type de pari (ex: Victoire PSG, Over 2.5)",
          "probability": "XX%",
          "analysis": "Analyse ultra-courte (20 mots max) basée sur les infos réelles de 2025",
          "confidence": "High" | "Very High",
          "matchDate": "DD/MM/2025",
          "matchTime": "HH:MM (Heure de Paris)"
        }
      ]
    }
    Langue des textes : ${langName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro pour une meilleure recherche web
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("NextWin DailyPicks Failure:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const timeNow = getParisContext();
    const langName = language === 'fr' ? 'Français' : 'English';

    const prompt = `EXPERT ANALYSTE NEXTWIN PRO. 
    HEURE DE PARIS : ${timeNow}. ANNEE : 2025.
    
    MATCH : ${request.match} (${request.sport}). TYPE DE PARI : ${request.betType}.
    
    TACHE :
    1. Utilise Google Search pour trouver les dernières news (blessures, suspensions, météo, cotes) pour ce match spécifique en 2025.
    2. Vérifie la date et l'heure exacte du match (Heure de Paris).
    3. Produis une analyse experte structurée en JSON (${langName}).
    
    STRUCTURE JSON ATTENDUE :
    {
      "detailedAnalysis": "Analyse technique approfondie (4-5 phrases) incluant les infos réelles trouvées...",
      "successProbability": "XX%",
      "riskAssessment": "Low" | "Medium" | "High",
      "matchDate": "DD/MM/2025",
      "matchTime": "HH:MM (Heure de Paris)",
      "aiOpinion": "Ta conclusion d'expert en 1 phrase percutante"
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview', 
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    const result = extractJsonFromText(response.text || "{}");
    
    // Extraction des sources web
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = chunks
        .filter((c: any) => c.web?.uri)
        .map((c: any) => ({
            title: c.web.title || 'Source Officielle',
            uri: c.web.uri
        }));

    return { ...result, sources };
  } catch (error: any) {
    console.error("NextWin Analysis Failure:", error);
    throw new Error(error.message || "Impossible de contacter le moteur d'analyse en temps réel.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const visualPrompt = `Futuristic sports analytics ${style} for ${request.match} in 2025. Professional interface, neon orange and black. 4K quality.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Ce modèle reste performant pour les images
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
  } catch (error) {
    console.error("NextWin Visual Generation Failure:", error);
  }
  return undefined;
};
