import { GoogleGenAI } from "@google/genai";
import type { AnalysisRequest, AnalysisResult, GroundingSource, DailyPick } from '../types';

const extractJson = (text: string) => {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : null;
};

const getAIInstance = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
        throw new Error("Clé API manquante dans les Secrets GitHub.");
    }
    return new GoogleGenAI({ apiKey });
};

export const getDailyPicks = async (language: 'fr' | 'en'): Promise<DailyPick[]> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: "Trouve 9 matchs réels pour aujourd'hui (3 Foot, 3 Basket, 3 Tennis). Réponds en JSON uniquement avec un champ 'picks'.",
            config: { tools: [{ googleSearch: {} }] }
        });
        const result = extractJson(response.text || "");
        return result?.picks || [];
    } catch (error) { throw error; }
};

export const getBetAnalysis = async (request: AnalysisRequest, language: 'fr' | 'en'): Promise<AnalysisResult['response']> => {
    try {
        const ai = getAIInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyse expert : ${request.match} (${request.betType}). Réponds en JSON.`,
            config: { tools: [{ googleSearch: {} }] }
        });
        const result = extractJson(response.text || "{}");
        const sources: GroundingSource[] = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || [])
            .filter((c: any) => c.web?.uri)
            .map((c: any) => ({ title: c.web.title || 'Source', uri: c.web.uri }));
        return { ...result, sources };
    } catch (error) { throw error; }
};
