
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface GroundingSource {
  title: string;
  uri: string;
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
    sources?: GroundingSource[];
  };
  timestamp: string;
}

export interface BetType {
  key: string;
  labelKey: string;
}

export interface Sport {
  key: string;
  labelKey: string;
  icon: string;
  betTypes: BetType[];
  entityNamesKey: [string, string];
}
