
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

    const request: AnalysisRequest = {
      sport: t(selectedSport.labelKey as any),
      match: `${entity1} vs ${entity2}`,
      betType: t(selectedBetType.labelKey as any),
    };

    const result = await getBetAnalysis(request, language);
    
    const newAnalysis: AnalysisResult = {
        id: new Date().toISOString(),
        request,
        response: result,
        timestamp: new Date().toLocaleString('fr-FR')
    };
    
    // Save to history in local storage
    const history = JSON.parse(localStorage.getItem('nextwin_history') || '[]');
    history.unshift(newAnalysis);
    localStorage.setItem('nextwin_history', JSON.stringify(history.slice(0, 50))); // Keep last 50

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
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('analysis_title')}</h1>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Select id="sport" label={t('analysis_step1')} value={selectedSport?.key || ''} onChange={handleSportChange}>
              {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey as any)}</option>)}
            </Select>

            {selectedSport && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Input id="entity1" label={`${t('analysis_step2')} ${t(selectedSport.entityNamesKey[0] as any)}`} value={entity1} onChange={e => setEntity1(e.target.value)} required />
                  <Input id="entity2" label={t(selectedSport.entityNamesKey[1] as any)} value={entity2} onChange={e => setEntity2(e.target.value)} required />
                </div>

                <Select id="betType" label={t('analysis_step3')} value={selectedBetType?.key || ''} onChange={handleBetTypeChange}>
                  {selectedSport.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey as any)}</option>)}
                </Select>
              </>
            )}

            <Button type="submit" disabled={isLoading || !selectedSport || !entity1 || !entity2} className="w-full py-3">
              {isLoading ? t('analysis_inprogress') : t('analysis_launch')}
            </Button>
          </form>
        </Card>
        
        <Card>
          <h2 className="text-2xl font-bold text-white mb-4">{t('analysis_result_title')}</h2>
          {isLoading && <Spinner />}
          {analysisResult && !isLoading && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold text-orange-400 mb-1">{t('analysis_probability')}</h3>
                    <p className="text-2xl font-bold text-white">{analysisResult.successProbability}</p>
                    <ProbabilityGauge probability={probabilityValue} />
                </div>
                 <div>
                    <h3 className="font-semibold text-orange-400 mb-1">{t('analysis_risk')}</h3>
                    <p className={`text-2xl font-bold ${riskColor[analysisResult.riskAssessment]}`}>{analysisResult.riskAssessment}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-orange-400 mb-1">{t('analysis_detailed')}</h3>
                    <p className="text-gray-300 whitespace-pre-wrap text-base">{analysisResult.detailedAnalysis}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-orange-400 mb-1">{t('analysis_opinion')}</h3>
                    <p className="text-gray-300 font-medium italic text-base">"{analysisResult.aiOpinion}"</p>
                </div>
            </div>
          )}
          {!analysisResult && !isLoading && (
            <div className="text-center text-gray-500 py-10">
              <p>{t('analysis_result_placeholder')}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AnalysisPage;
