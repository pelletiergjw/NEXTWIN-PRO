
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
    "Recherche des dernières news (2025)...",
    "Scan des compositions probables...",
    "Vérification des flux de cotes...",
    "Finalisation du rapport stratégique..."
  ];

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep(prev => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sport = SPORTS.find(s => s.key === e.target.value);
    setSelectedSport(sport);
    setAnalysisResult(null);
    setError(null);
  };

  const handleBetTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const betType = selectedSport?.betTypes.find(bt => bt.key === e.target.value);
      setSelectedBetType(betType);
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
    } catch (err: any) {
        setError(err.message);
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
      <h1 className="text-4xl font-bold text-center text-white mb-8">Analyseur de Match <span className="text-orange-500">v4.1</span></h1>
      
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
            <Card className="border-gray-800 shadow-2xl bg-[#1C1C2B]">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Select id="sport" label="1. Choisissez le Sport" value={selectedSport?.key || ''} onChange={handleSportChange}>
                        {SPORTS.map(sport => <option key={sport.key} value={sport.key}>{sport.icon} {t(sport.labelKey)}</option>)}
                    </Select>

                    <div className="grid grid-cols-2 gap-4">
                        <Input id="entity1" label="Équipe 1" value={entity1} onChange={e => setEntity1(e.target.value)} placeholder="Ex: Amiens" required />
                        <Input id="entity2" label="Équipe 2" value={entity2} onChange={e => setEntity2(e.target.value)} placeholder="Ex: Nancy" required />
                    </div>

                    <Select id="betType" label="3. Type de Pari" value={selectedBetType?.key || ''} onChange={handleBetTypeChange}>
                        {selectedSport?.betTypes.map(bt => <option key={bt.key} value={bt.key}>{t(bt.labelKey)}</option>)}
                    </Select>

                    <Button type="submit" disabled={isLoading} className="w-full py-5 text-lg font-black uppercase shadow-xl shadow-orange-500/20">
                        {isLoading ? "Recherche en cours..." : "Lancer l'Analyse"}
                    </Button>
                </form>
            </Card>
        </div>
        
        <div className="lg:col-span-7">
            <Card className="min-h-[550px] relative overflow-hidden flex flex-col border-gray-800 bg-[#1C1C2B]">
            {isLoading ? (
                <div className="flex-grow flex flex-col items-center justify-center py-20 gap-8">
                    <Spinner />
                    <div className="text-center space-y-2">
                        <p className="text-orange-400 font-black uppercase tracking-widest">{loadingSteps[loadingStep]}</p>
                        <p className="text-gray-600 text-[10px] font-bold uppercase">Connexion sécurisée aux serveurs de données sportives...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center space-y-6">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-3xl">⚠️</div>
                    <div className="max-w-xs mx-auto">
                        <h3 className="text-xl font-bold text-white mb-2">Analyse Interrompue</h3>
                        <p className="text-gray-400 text-sm">{error}</p>
                    </div>
                    <Button onClick={() => setError(null)} variant="secondary" className="text-xs font-black uppercase">Réessayer l'analyse</Button>
                </div>
            ) : analysisResult ? (
                <div className="space-y-6 p-4 animate-fadeIn">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white">Verdict de l'IA</h2>
                        <span className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] uppercase font-bold text-green-400">Certifié Temps Réel</span>
                    </div>

                    <div className="bg-gray-900/60 p-5 rounded-2xl flex items-center gap-4">
                        <span className="text-3xl">📅</span>
                        <div>
                            <p className="text-[10px] uppercase font-black text-orange-400">Match prévu le</p>
                            <p className="text-white font-black text-base">{analysisResult.matchDate} à {analysisResult.matchTime} (Paris)</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-900/40 p-5 rounded-2xl">
                            <h3 className="text-[10px] uppercase text-gray-500 font-black mb-2">Probabilité</h3>
                            <p className="text-4xl font-black text-white">{analysisResult.successProbability}</p>
                            <ProbabilityGauge probability={parseInt(analysisResult.successProbability)} />
                        </div>
                        <div className="bg-gray-900/40 p-5 rounded-2xl">
                            <h3 className="text-[10px] uppercase text-gray-500 font-black mb-2">Niveau de Risque</h3>
                            <p className={`text-4xl font-black ${riskColor[analysisResult.riskAssessment as keyof typeof riskColor] || 'text-white'}`}>
                                {analysisResult.riskAssessment}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-900/40 p-6 rounded-2xl">
                        <h3 className="text-[10px] uppercase text-orange-400 font-black mb-3">Analyse Technique</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{analysisResult.detailedAnalysis}</p>
                    </div>

                    {analysisResult.sources && (
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.sources.map((s, i) => (
                                <a key={i} href={s.uri} target="_blank" className="text-[9px] bg-gray-800 text-gray-500 px-3 py-1.5 rounded-lg border border-gray-700 truncate max-w-[150px]">🔗 {s.title}</a>
                            ))}
                        </div>
                    )}

                    <div className="pt-6 border-t border-gray-800">
                        <div className="grid grid-cols-2 gap-4">
                            {!analysisResult.visuals?.dashboard && (
                                <Button onClick={() => handleGenerateVisual('dashboard')} className="w-full text-[10px] py-3 bg-white/5 border border-white/10">Générer Dashboard Stats</Button>
                            )}
                            {analysisResult.visuals?.dashboard && <img src={analysisResult.visuals.dashboard} className="rounded-xl border border-gray-800" />}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center opacity-30">
                    <span className="text-6xl mb-4">🔍</span>
                    <p className="text-xs font-black uppercase">En attente de vos paramètres</p>
                </div>
            )}
            </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
