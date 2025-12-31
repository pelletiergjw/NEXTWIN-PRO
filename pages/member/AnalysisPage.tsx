
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
    "Connexion au réseau NextWin...",
    "Récupération des news 2025...",
    "Analyse des effectifs et blessures...",
    "Calcul des probabilités finales...",
    "Génération du rapport d'expert..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = SPORTS.find(s => s.key === e.target.value);
    setSelectedSport(sport);
    setSelectedBetType(sport?.betTypes[0]);
    setAnalysisResult(null);
    setError(null);
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
        setAnalysisResult(result);
        
        // Sauvegarde historique
        const history = JSON.parse(localStorage.getItem('nextwin_history') || '[]');
        const newRecord = {
            id: Date.now().toString(),
            timestamp: new Date().toLocaleString(),
            request: requestBody,
            response: result
        };
        localStorage.setItem('nextwin_history', JSON.stringify([newRecord, ...history].slice(0, 20)));
        
    } catch (err: any) {
        console.error("UI Analysis Error:", err);
        setError(err.message || "Une erreur inconnue est survenue.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateVisual = async (style: 'dashboard' | 'tactical') => {
    if (!selectedSport || !entity1 || !entity2 || !analysisResult) return;
    setLoadingVisual(style);
    try {
        const visual = await generateAnalysisVisual({ sport: selectedSport.key, match: `${entity1} vs ${entity2}`, betType: selectedBetType?.key || '' }, style);
        if (visual) setAnalysisResult({ ...analysisResult, visuals: { ...(analysisResult.visuals || {}), [style]: visual } });
    } catch (e) {}
    setLoadingVisual(null);
  };

  const riskColor = { Low: 'text-green-400', Medium: 'text-yellow-400', High: 'text-red-400' };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Analyseur Expert <span className="text-orange-500">NextWin</span></h1>
        <p className="text-gray-500 uppercase text-[10px] font-bold tracking-[0.3em]">Moteur IA v4.2 Stable 2025</p>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
            <Card className="border-gray-800 shadow-2xl bg-[#1C1C2B] rounded-[2rem] p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select id="sport" label="1. Discipline Sportive" value={selectedSport?.key || ''} onChange={handleSportChange}>
                        {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey)}</option>)}
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <Input id="entity1" label="Équipe 1" value={entity1} onChange={e => setEntity1(e.target.value)} placeholder="Ex: Marseille" required />
                        <Input id="entity2" label="Équipe 2" value={entity2} onChange={e => setEntity2(e.target.value)} placeholder="Ex: Monaco" required />
                    </div>

                    <Select id="betType" label="3. Type de Pari" value={selectedBetType?.key || ''} onChange={e => setSelectedBetType(selectedSport?.betTypes.find(bt => bt.key === e.target.value))}>
                        {selectedSport?.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey)}</option>)}
                    </Select>

                    <Button type="submit" disabled={isLoading} className="w-full py-5 text-lg font-black uppercase shadow-xl shadow-orange-500/20 rounded-2xl">
                        {isLoading ? "Recherche en cours..." : "Lancer l'Analyse"}
                    </Button>
                </form>
            </Card>
        </div>
        
        <div className="lg:col-span-7">
            <Card className="min-h-[600px] relative overflow-hidden flex flex-col border-gray-800 bg-[#1C1C2B] rounded-[2rem]">
            {isLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 gap-8">
                    <Spinner />
                    <div className="text-center space-y-3">
                        <p className="text-orange-400 font-black uppercase tracking-widest text-lg animate-pulse">{loadingSteps[loadingStep]}</p>
                        <p className="text-gray-600 text-[9px] font-bold uppercase tracking-[0.2em]">Accès aux bases de données mondiales...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center space-y-8 animate-fadeIn">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-4xl border border-red-500/20 shadow-xl shadow-red-500/5">⚠️</div>
                    <div className="max-w-sm">
                        <h3 className="text-2xl font-black text-white mb-4">Erreur de Connexion</h3>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8">{error}</p>
                        <Button onClick={() => { setError(null); handleSubmit(new Event('submit') as any); }} className="w-full py-4 text-xs font-black uppercase tracking-widest bg-white/5 border border-white/10 hover:bg-white/10">Réessayer l'Analyse</Button>
                    </div>
                </div>
            ) : analysisResult ? (
                <div className="space-y-6 p-6 md:p-10 animate-fadeIn">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-3xl font-black text-white">Rapport IA <span className="text-orange-500">2025</span></h2>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-[9px] uppercase font-black text-green-400 tracking-widest">Live Engine Active</span>
                        </div>
                    </div>

                    <div className="bg-white/5 p-6 rounded-3xl flex items-center gap-6 border border-white/5">
                        <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-3xl">📅</div>
                        <div>
                            <p className="text-[10px] uppercase font-black text-orange-500 tracking-widest">Informations Match</p>
                            <p className="text-white font-black text-xl">{analysisResult.matchDate} à {analysisResult.matchTime}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <h3 className="text-[10px] uppercase text-gray-500 font-black mb-4 tracking-widest">Fiabilité Statistique</h3>
                            <p className="text-5xl font-black text-white tracking-tighter">{analysisResult.successProbability}</p>
                            <ProbabilityGauge probability={parseInt(analysisResult.successProbability)} />
                        </div>
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                            <h3 className="text-[10px] uppercase text-gray-500 font-black mb-4 tracking-widest">Facteur de Risque</h3>
                            <p className={`text-4xl font-black mb-2 ${riskColor[analysisResult.riskAssessment as keyof typeof riskColor] || 'text-white'}`}>
                                {analysisResult.riskAssessment}
                            </p>
                        </div>
                    </div>

                    <div className="bg-[#10101A] p-8 rounded-[2rem] border border-white/5">
                        <h3 className="text-[11px] uppercase text-orange-500 font-black mb-4 tracking-[0.2em]">Analyse Technique</h3>
                        <p className="text-gray-300 text-base leading-relaxed font-medium mb-6">"{analysisResult.detailedAnalysis}"</p>
                        <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20 italic text-sm text-orange-200">
                           <span className="font-bold uppercase text-[10px] block not-italic text-orange-400 mb-1">Avis de l'IA</span>
                           {analysisResult.aiOpinion}
                        </div>
                    </div>

                    {analysisResult.sources && (
                        <div className="flex flex-wrap gap-2 pt-4">
                            {analysisResult.sources.map((s, i) => (
                                <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-gray-900/80 text-gray-400 px-4 py-2 rounded-xl border border-white/5 hover:border-orange-500/40 hover:text-white transition-all">
                                    🔗 {s.title}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center opacity-40 text-center">
                    <div className="text-8xl mb-6 grayscale opacity-20">📊</div>
                    <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-600">Prêt pour une nouvelle analyse 2025</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
