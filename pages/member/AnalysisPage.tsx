
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import ProbabilityGauge from '../../components/ui/ProbabilityGauge';
import { SPORTS } from '../../constants';
import { getBetAnalysis } from '../../services/geminiService';
import type { AnalysisRequest, AnalysisResult, Sport, BetType } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const AnalysisPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>(SPORTS[0]);
  const [selectedBetType, setSelectedBetType] = useState<BetType | undefined>(SPORTS[0].betTypes[0]);
  const [entity1, setEntity1] = useState('');
  const [entity2, setEntity2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult['response'] | null>(null);

  useEffect(() => {
    if (selectedSport) {
      setSelectedBetType(selectedSport.betTypes[0]);
    } else {
      setSelectedBetType(undefined);
    }
  }, [selectedSport]);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = SPORTS.find(s => s.key === e.target.value);
    setSelectedSport(sport);
    setAnalysisResult(null);
  };
  
  const handleBetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const betType = selectedSport?.betTypes.find(bt => bt.key === e.target.value);
      setSelectedBetType(betType);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport || !selectedBetType || !entity1 || !entity2) return;

    setIsLoading(true);
    setAnalysisResult(null);

    const requestBody: AnalysisRequest = {
      sport: t(selectedSport.labelKey as any),
      match: `${entity1} vs ${entity2}`,
      betType: t(selectedBetType.labelKey as any),
    };

    const result = await getBetAnalysis(requestBody, language);
    
    const newAnalysis: AnalysisResult = {
        id: new Date().toISOString(),
        request: requestBody,
        response: result,
        timestamp: new Date().toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US')
    };
    
    const history = JSON.parse(localStorage.getItem('nextwin_history') || '[]');
    history.unshift(newAnalysis);
    localStorage.setItem('nextwin_history', JSON.stringify(history.slice(0, 50)));

    setAnalysisResult(result);
    setIsLoading(false);
  };
  
  const riskColor = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-red-400',
  };

  const probabilityValue = analysisResult ? parseInt(analysisResult.successProbability, 10) : 0;

  return (
    <div>
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('analysis_title' as any)}</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select id="sport" label={t('analysis_step1' as any)} value={selectedSport?.key || ''} onChange={handleSportChange}>
              {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey as any)}</option>)}
            </Select>

            {selectedSport && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="entity1" label={`${t('analysis_step2' as any)} ${t(selectedSport.entityNamesKey[0] as any)}`} value={entity1} onChange={e => setEntity1(e.target.value)} required />
                  <Input id="entity2" label={t(selectedSport.entityNamesKey[1] as any)} value={entity2} onChange={e => setEntity2(e.target.value)} required />
                </div>

                <Select id="betType" label={t('analysis_step3' as any)} value={selectedBetType?.key || ''} onChange={handleBetTypeChange}>
                  {selectedSport.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey as any)}</option>)}
                </Select>
              </>
            )}

            <Button type="submit" disabled={isLoading || !selectedSport || !entity1 || !entity2} className="w-full py-3">
              {isLoading ? t('analysis_inprogress' as any) : t('analysis_launch' as any)}
            </Button>
          </form>
        </Card>
        
        <Card className="min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">{t('analysis_result_title' as any)}</h2>
            {analysisResult?.sources && analysisResult.sources.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] uppercase font-bold text-blue-400">{t('analysis_verified_by' as any)}</span>
                </div>
            )}
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Spinner />
                <p className="text-orange-400 animate-pulse text-sm font-medium tracking-wide">Vérification des dernières données sportives...</p>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{t('analysis_probability' as any)}</h3>
                        <p className="text-3xl font-black text-white">{analysisResult.successProbability}</p>
                        <ProbabilityGauge probability={probabilityValue} />
                    </div>
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{t('analysis_risk' as any)}</h3>
                        <p className={`text-3xl font-black ${riskColor[analysisResult.riskAssessment]}`}>{analysisResult.riskAssessment}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">{t('analysis_detailed' as any)}</h3>
                    <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed bg-gray-900/30 p-4 rounded-lg border border-gray-800">
                        {analysisResult.detailedAnalysis}
                    </p>
                </div>

                {analysisResult.sources && analysisResult.sources.length > 0 && (
                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">{t('analysis_sources' as any)}</h3>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.sources.map((source, i) => (
                                <a 
                                    key={i} 
                                    href={source.uri} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-[10px] bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-md border border-gray-700 transition-colors truncate max-w-[150px]"
                                >
                                    🔗 {source.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t border-gray-800">
                    <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">{t('analysis_opinion' as any)}</h3>
                    <div className="relative">
                        <div className="absolute -left-2 top-0 text-3xl text-orange-500/20 font-serif leading-none">“</div>
                        <p className="text-gray-300 font-medium italic text-base pl-4 pr-4">
                            {analysisResult.aiOpinion}
                        </p>
                    </div>
                </div>
            </div>
          )}
          {!analysisResult && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
              <span className="text-6xl mb-4">🔍</span>
              <p className="text-gray-400">{t('analysis_result_placeholder' as any)}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;
