
import { translations } from './translations';

export type TranslationKey = keyof typeof translations.fr & keyof typeof translations.en;

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface DailyPick {
  sport: 'football' | 'basketball' | 'tennis';
  match: string;
  betType: string;
  probability: string;
  analysis: string;
  confidence: 'High' | 'Very High';
  matchDate: string;
  matchTime: string;
}

export interface AnalysisRequest {
  sport: string;
  match: string;
  betType: string;
}

export interface AnalysisResult {
  id: string;
  request: AnalysisRequest;
  response: {
    detailedAnalysis: string;
    successProbability: string;
    riskAssessment: 'Low' | 'Medium' | 'High';
    aiOpinion: string;
    matchDate?: string;
    matchTime?: string;
    sources?: GroundingSource[];
    visuals?: {
      dashboard?: string;
      tactical?: string;
    };
  };
  timestamp: string;
}

export interface BetType {
  key: string;
  labelKey: TranslationKey;
}

export interface Sport {
  key: string;
  labelKey: TranslationKey;
  icon: string;
  betTypes: BetType[];
  entityNamesKey: [TranslationKey, TranslationKey];
}
