
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Spinner from '../../components/ui/Spinner';
import ProbabilityGauge from '../../components/ui/ProbabilityGauge';
import { SPORTS } from '../../constants';
import { getBetAnalysis, generateAnalysisVisual } from '../../services/geminiService';
import type { AnalysisRequest, AnalysisResult, Sport, BetType } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const AnalysisPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedSport, setSelectedSport] = useState<Sport | undefined>(SPORTS[0]);
  const [selectedBetType, setSelectedBetType] = useState<BetType | undefined>(SPORTS[0].betTypes[0]);
  const [entity1, setEntity1] = useState('');
  const [entity2, setEntity2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingVisual, setLoadingVisual] = useState<'dashboard' | 'tactical' | null>(null);
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

  const handleGenerateVisual = async (style: 'dashboard' | 'tactical') => {
    if (!selectedSport || !entity1 || !entity2 || !analysisResult) return;
    setLoadingVisual(style);
    
    // Fix: Remove 'as any' as TranslationKey is now properly typed
    const requestBody: AnalysisRequest = {
      sport: t(selectedSport.labelKey),
      match: `${entity1} vs ${entity2}`,
      betType: selectedBetType ? t(selectedBetType.labelKey) : ''
    };

    const visual = await generateAnalysisVisual(requestBody, style);
    if (visual) {
      setAnalysisResult({ 
        ...analysisResult, 
        visuals: { 
          ...(analysisResult.visuals || {}), 
          [style]: visual 
        } 
      });
    }
    setLoadingVisual(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport || !selectedBetType || !entity1 || !entity2) return;

    setIsLoading(true);
    setAnalysisResult(null);

    // Fix: Remove 'as any' as TranslationKey is now properly typed
    const requestBody: AnalysisRequest = {
      sport: t(selectedSport.labelKey),
      match: `${entity1} vs ${entity2}`,
      betType: t(selectedBetType.labelKey)
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
    <div className="max-w-7xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('analysis_title')}</h1>
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
            <Card>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Select id="sport" label={t('analysis_step1')} value={selectedSport?.key || ''} onChange={handleSportChange}>
                {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey)}</option>)}
                </Select>

                {selectedSport && (
                <>
                    <div className="grid grid-cols-2 gap-4">
                    <Input id="entity1" label={`${t(selectedSport.entityNamesKey[0])}`} value={entity1} onChange={e => setEntity1(e.target.value)} required />
                    <Input id="entity2" label={`${t(selectedSport.entityNamesKey[1])}`} value={entity2} onChange={e => setEntity2(e.target.value)} required />
                    </div>

                    <Select id="betType" label={t('analysis_step3')} value={selectedBetType?.key || ''} onChange={handleBetTypeChange}>
                    {selectedSport.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey)}</option>)}
                    </Select>
                </>
                )}

                <Button type="submit" disabled={isLoading || !selectedSport || !entity1 || !entity2} className="w-full py-4 text-lg">
                {isLoading ? t('analysis_inprogress') : t('analysis_launch')}
                </Button>
                <p className="text-[10px] text-gray-500 text-center font-medium">L'IA détectera automatiquement la date et l'heure du match.</p>
            </form>
            </Card>
        </div>
        
        <div className="lg:col-span-7">
            <Card className="min-h-[500px] relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-white">{t('analysis_result_title')}</h2>
                {analysisResult?.sources && analysisResult.sources.length > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] uppercase font-bold text-blue-400">{t('analysis_verified_by')}</span>
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Spinner />
                    <p className="text-orange-400 animate-pulse text-sm font-medium tracking-wide">{t('analysis_inprogress')}</p>
                </div>
            )}

            {analysisResult && !isLoading && (
                <div className="space-y-6 relative z-10">
                    {/* Detected Match Time Card */}
                    <div className="bg-gray-900/60 border border-orange-500/20 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500/20 p-2 rounded-lg">
                                <span className="text-xl">📅</span>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-orange-500/70">{t('analysis_match_info')}</p>
                                <p className="text-white font-black text-sm">{analysisResult.matchDate} à {analysisResult.matchTime}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] uppercase font-bold text-gray-500">Live Status</p>
                             <p className="text-green-400 text-[10px] font-black animate-pulse">CONFIRMÉ</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{t('analysis_probability')}</h3>
                            <p className="text-3xl font-black text-white">{analysisResult.successProbability}</p>
                            <ProbabilityGauge probability={probabilityValue} />
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">{t('analysis_risk')}</h3>
                            <p className={`text-3xl font-black ${riskColor[analysisResult.riskAssessment]}`}>{analysisResult.riskAssessment}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">{t('analysis_detailed')}</h3>
                        <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed bg-gray-900/30 p-4 rounded-xl border border-gray-800">
                            {analysisResult.detailedAnalysis}
                        </p>
                    </div>

                    {analysisResult.sources && analysisResult.sources.length > 0 && (
                        <div>
                            <h3 className="text-xs uppercase tracking-widest text-blue-400 font-bold mb-3">{t('analysis_sources')}</h3>
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
                        <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">{t('analysis_opinion')}</h3>
                        <div className="relative">
                            <div className="absolute -left-2 top-0 text-3xl text-orange-500/20 font-serif leading-none">“</div>
                            <p className="text-gray-300 font-medium italic text-base pl-4 pr-4">
                                {analysisResult.aiOpinion}
                            </p>
                        </div>
                    </div>

                    {/* AI Visual Analysis Section */}
                    <div className="pt-6 border-t border-gray-800">
                        <h3 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-4">{t('analysis_visual_title')}</h3>
                        
                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Dashboard Visual */}
                            <div className="flex flex-col gap-2">
                                {!analysisResult.visuals?.dashboard && loadingVisual !== 'dashboard' ? (
                                    <Button variant="secondary" onClick={() => handleGenerateVisual('dashboard')} className="w-full flex items-center justify-center gap-2 border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 text-orange-400 text-xs py-3 rounded-xl">
                                        📊 {t('analysis_generate_dashboard')}
                                    </Button>
                                ) : loadingVisual === 'dashboard' ? (
                                    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 gap-2 h-[150px]">
                                        <Spinner />
                                        <p className="text-[10px] text-gray-400 animate-pulse">{t('analysis_visual_loading')}</p>
                                    </div>
                                ) : analysisResult.visuals?.dashboard && (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-xl group">
                                        <img src={analysisResult.visuals.dashboard} alt="Dashboard" className="w-full h-auto" />
                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white uppercase font-bold border border-white/10">Dashboard</div>
                                    </div>
                                )}
                            </div>

                            {/* Tactical Visual */}
                            <div className="flex flex-col gap-2">
                                {!analysisResult.visuals?.tactical && loadingVisual !== 'tactical' ? (
                                    <Button variant="secondary" onClick={() => handleGenerateVisual('tactical')} className="w-full flex items-center justify-center gap-2 border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 text-xs py-3 rounded-xl">
                                        🎯 {t('analysis_generate_tactical')}
                                    </Button>
                                ) : loadingVisual === 'tactical' ? (
                                    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/50 rounded-xl border border-gray-800 gap-2 h-[150px]">
                                        <Spinner />
                                        <p className="text-[10px] text-gray-400 animate-pulse">{t('analysis_visual_loading')}</p>
                                    </div>
                                ) : analysisResult.visuals?.tactical && (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-700 shadow-xl group">
                                        <img src={analysisResult.visuals.tactical} alt="Tactical View" className="w-full h-auto" />
                                        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8px] text-white uppercase font-bold border border-white/10">Tactique</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {!analysisResult && !isLoading && (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <span className="text-6xl mb-4">🔍</span>
                <p className="text-gray-400 font-medium">{t('analysis_result_placeholder')}</p>
                <p className="text-gray-500 text-sm mt-2">L'IA s'occupe de trouver toutes les infos du match.</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
