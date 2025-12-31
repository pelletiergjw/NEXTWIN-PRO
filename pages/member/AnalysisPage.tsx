
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
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingVisual, setLoadingVisual] = useState<'dashboard' | 'tactical' | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult['response'] | null>(null);

  const loadingSteps = [
    "Initialisation du moteur IA...",
    "Scan des flux de cotes mondiaux...",
    "Vérification des effectifs (2024/2025)...",
    "Analyse des conditions et historiques...",
    "Génération du rapport d'expertise..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (selectedSport) {
      setSelectedBetType(selectedSport.betTypes[0]);
    }
  }, [selectedSport]);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = SPORTS.find(s => s.key === e.target.value);
    setSelectedSport(sport);
    setAnalysisResult(null);
    setError(null);
  };
  
  const handleBetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const betType = selectedSport?.betTypes.find(bt => bt.key === e.target.value);
      setSelectedBetType(betType);
  }

  const handleGenerateVisual = async (style: 'dashboard' | 'tactical') => {
    if (!selectedSport || !entity1 || !entity2 || !analysisResult) return;
    setLoadingVisual(style);
    
    const requestBody: AnalysisRequest = {
      sport: t(selectedSport.labelKey),
      match: `${entity1} vs ${entity2}`,
      betType: selectedBetType ? t(selectedBetType.labelKey) : ''
    };

    try {
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
    } catch (e) {
        console.error("Visual generation failed", e);
    }
    setLoadingVisual(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSport || !selectedBetType || !entity1 || !entity2) return;

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    const requestBody: AnalysisRequest = {
      sport: t(selectedSport.labelKey),
      match: `${entity1} vs ${entity2}`,
      betType: t(selectedBetType.labelKey)
    };

    try {
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
    } catch (err: any) {
        setError(err.message || "Erreur d'analyse. Veuillez vérifier votre connexion ou la configuration de la clé API.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const riskColor = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-red-400',
  };

  const probabilityValue = analysisResult ? parseInt(analysisResult.successProbability, 10) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('analysis_title')}</h1>
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
            <Card className="border-gray-800 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select id="sport" label={t('analysis_step1')} value={selectedSport?.key || ''} onChange={handleSportChange}>
                        {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey)}</option>)}
                    </Select>

                    {selectedSport && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <Input id="entity1" label={`${t(selectedSport.entityNamesKey[0])}`} value={entity1} onChange={e => setEntity1(e.target.value)} placeholder="Ex: PSG" required />
                                <Input id="entity2" label={`${t(selectedSport.entityNamesKey[1])}`} value={entity2} onChange={e => setEntity2(e.target.value)} placeholder="Ex: Marseille" required />
                            </div>

                            <Select id="betType" label={t('analysis_step3')} value={selectedBetType?.key || ''} onChange={handleBetTypeChange}>
                                {selectedSport.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey)}</option>)}
                            </Select>
                        </>
                    )}

                    <Button type="submit" disabled={isLoading || !selectedSport || !entity1 || !entity2} className="w-full py-5 text-lg font-black uppercase tracking-widest shadow-xl shadow-orange-500/20">
                        {isLoading ? "Analyse en cours..." : t('analysis_launch')}
                    </Button>
                    <p className="text-[10px] text-gray-500 text-center font-bold uppercase tracking-widest">NextWin Engine v4.0 Active</p>
                </form>
            </Card>
        </div>
        
        <div className="lg:col-span-7">
            <Card className="min-h-[550px] relative overflow-hidden flex flex-col border-gray-800 bg-[#1C1C2B]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>

            {isLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 gap-8 animate-fadeIn">
                    <div className="relative">
                        <Spinner />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl animate-pulse">🧠</span>
                        </div>
                    </div>
                    <div className="text-center space-y-2 px-4">
                        <p className="text-orange-400 font-black text-sm tracking-[0.2em] uppercase">{loadingSteps[loadingStep]}</p>
                        <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Recherche web et analyse statistique en cours...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-4xl border border-red-500/20">⚠️</div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Analyse Interrompue</h3>
                        <p className="text-red-400/80 text-sm max-w-sm font-medium">{error}</p>
                        {error.includes("Clé API") && (
                            <p className="text-gray-500 text-xs mt-4">Vérifiez vos variables d'environnement Vercel et refaites un déploiement.</p>
                        )}
                    </div>
                    <Button onClick={() => setError(null)} variant="secondary" className="text-xs uppercase font-black">Réessayer</Button>
                </div>
            ) : analysisResult ? (
                <div className="space-y-6 relative z-10 animate-fadeIn p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-black text-white">{t('analysis_result_title')}</h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] uppercase font-bold text-green-400">Certifié</span>
                        </div>
                    </div>

                    <div className="bg-gray-900/60 border border-white/5 rounded-2xl p-5 flex items-center justify-between shadow-inner">
                        <div className="flex items-center gap-4">
                            <div className="bg-orange-500/20 w-12 h-12 rounded-xl flex items-center justify-center text-2xl">📅</div>
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-widest text-orange-400/70">{t('analysis_match_info')}</p>
                                <p className="text-white font-black text-base">{analysisResult.matchDate || 'Aujourd\'hui'} à {analysisResult.matchTime || '--:--'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">{t('analysis_probability')}</h3>
                            <p className="text-4xl font-black text-white mb-3">{analysisResult.successProbability}</p>
                            <ProbabilityGauge probability={probabilityValue} />
                        </div>
                        <div className="bg-gray-900/40 p-5 rounded-2xl border border-white/5">
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-2">{t('analysis_risk')}</h3>
                            <p className={`text-4xl font-black ${riskColor[analysisResult.riskAssessment as keyof typeof riskColor] || 'text-white'}`}>
                                {analysisResult.riskAssessment}
                            </p>
                            <div className="mt-4 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full ${analysisResult.riskAssessment === 'Low' ? 'w-1/3 bg-green-500' : analysisResult.riskAssessment === 'Medium' ? 'w-2/3 bg-yellow-500' : 'w-full bg-red-500'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 p-6 rounded-2xl border border-white/5">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-orange-400 font-black mb-3">{t('analysis_detailed')}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                            {analysisResult.detailedAnalysis}
                        </p>
                    </div>

                    {analysisResult.sources && analysisResult.sources.length > 0 && (
                        <div>
                            <h3 className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black mb-3 px-1">{t('analysis_sources')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.sources.slice(0, 5).map((source, i) => (
                                    <a 
                                        key={i} 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-[9px] font-bold bg-gray-800 hover:bg-gray-700 text-gray-400 px-3 py-1.5 rounded-lg border border-gray-700 transition-all truncate max-w-[200px]"
                                    >
                                        🔗 {source.title}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-2xl relative">
                        <div className="absolute top-2 right-4 text-4xl opacity-10 font-serif italic">“</div>
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-orange-500 font-black mb-2">VERDICT NEXTWIN</h3>
                        <p className="text-white font-bold italic text-sm leading-relaxed">
                            {analysisResult.aiOpinion}
                        </p>
                    </div>

                    <div className="pt-6 border-t border-gray-800">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black mb-4">VISUELS IA</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {!analysisResult.visuals?.dashboard && loadingVisual !== 'dashboard' ? (
                                <Button variant="secondary" onClick={() => handleGenerateVisual('dashboard')} className="w-full text-[10px] font-black uppercase tracking-widest py-3 rounded-xl bg-white/5 border border-white/10">
                                    📊 Dashboard Stats
                                </Button>
                            ) : loadingVisual === 'dashboard' ? (
                                <div className="flex items-center justify-center h-40 bg-gray-900/50 rounded-xl border border-gray-800"><Spinner /></div>
                            ) : analysisResult.visuals?.dashboard && (
                                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl"><img src={analysisResult.visuals.dashboard} alt="Stats" className="w-full h-auto" /></div>
                            )}
                            
                            {!analysisResult.visuals?.tactical && loadingVisual !== 'tactical' ? (
                                <Button variant="secondary" onClick={() => handleGenerateVisual('tactical')} className="w-full text-[10px] font-black uppercase tracking-widest py-3 rounded-xl bg-white/5 border border-white/10">
                                    🎯 Vue Tactique
                                </Button>
                            ) : loadingVisual === 'tactical' ? (
                                <div className="flex items-center justify-center h-40 bg-gray-900/50 rounded-xl border border-gray-800"><Spinner /></div>
                            ) : analysisResult.visuals?.tactical && (
                                <div className="rounded-xl overflow-hidden border border-gray-700 shadow-2xl"><img src={analysisResult.visuals.tactical} alt="Tactique" className="w-full h-auto" /></div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center py-20 text-center opacity-30">
                    <div className="w-24 h-24 bg-gray-800 rounded-3xl flex items-center justify-center text-5xl mb-6 grayscale">🔍</div>
                    <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">{t('analysis_result_placeholder')}</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
