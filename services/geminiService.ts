
import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

/**
 * Service NextWin AI - Version Stabilisée pour Vercel
 * Note : process.env.API_KEY est injecté par Vite lors du build.
 */

const getAIInstance = () => {
    // Tentative de récupération de la clé via process.env (shimé par Vite)
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : undefined;
    
    if (!apiKey || apiKey === "undefined" || apiKey === "") {
        console.error("ERREUR CRITIQUE : La clé API Gemini est manquante.");
        throw new Error("Configuration API incomplète. Assurez-vous d'avoir ajouté API_KEY dans les variables d'environnement Vercel et d'avoir relancé un déploiement.");
    }
    return new GoogleGenAI({ apiKey });
};

const extractJsonFromText = (text: string) => {
    if (!text) throw new Error("Réponse vide de l'IA.");
    
    console.log("DEBUG: Réponse brute reçue de l'IA:", text);

    // Nettoyage des balises de code Markdown
    let cleaned = text.trim();
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
            console.error("ERREUR PARSING JSON:", e, "Texte tenté:", cleaned);
            // Réparation basique
            try {
                const repaired = cleaned.replace(/,\s*([\]}])/g, '$1');
                return JSON.parse(repaired);
            } catch (inner) {
                throw new Error("L'IA a renvoyé un format de données invalide. Réessayez.");
            }
        }
    }
    throw new Error("Impossible d'extraire des données valides de la réponse IA.");
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
  try {
    const ai = getAIInstance();
    const langName = language === 'fr' ? 'Français' : 'English';

    const prompt = `NextWin System. 
    Find 9 REAL pro matches (3 Football, 3 Basketball, 3 Tennis) for today/tomorrow.
    Respond ONLY with a raw JSON object like this: 
    {"picks": [{"sport": "football", "match": "...", "betType": "...", "probability": "75%", "analysis": "...", "confidence": "High", "matchDate": "...", "matchTime": "..."}]}.
    Language: ${langName}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    const result = extractJsonFromText(response.text || "{}");
    return result.picks || [];
  } catch (error) {
    console.error("Daily Picks Failure:", error);
    return [];
  }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
  try {
    const ai = getAIInstance();
    const langName = language === 'fr' ? 'Français' : 'English';

    // On demande le JSON sans l'outil Search dans le même appel pour éviter les conflits de format
    // Le modèle Flash-3 est suffisamment intelligent pour avoir des connaissances de base récentes
    const prompt = `Expert NextWin PRO.
    MATCH : ${request.match} (${request.sport}). TYPE : ${request.betType}.
    
    TACHE : Analyse approfondie.
    REPONDS UNIQUEMENT AVEC CE JSON (${langName}) :
    {
      "detailedAnalysis": "Analyse de 3-4 phrases sur la forme et les enjeux...",
      "successProbability": "XX%",
      "riskAssessment": "Low"|"Medium"|"High",
      "matchDate": "Date du match",
      "matchTime": "Heure du match",
      "aiOpinion": "Ta conclusion finale en 1 phrase"
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview', 
        contents: prompt
    });
    
    const result = extractJsonFromText(response.text || "{}");
    return { ...result, sources: [] };
  } catch (error: any) {
    console.error("Analysis Failure:", error);
    throw new Error(error.message || "Erreur lors de l'analyse. Vérifiez votre clé API.");
  }
};

export const generateAnalysisVisual = async (request: AnalysisRequest, style: 'dashboard' | 'tactical' = 'dashboard'): Promise<string | undefined> => {
  try {
    const ai = getAIInstance();
    const prompt = `High-tech sports analytics ${style} for ${request.match}, neon orange.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "16:9" } }
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  } catch (error) {
    console.error("Visual Generation Failure:", error);
  }
  return undefined;
};
