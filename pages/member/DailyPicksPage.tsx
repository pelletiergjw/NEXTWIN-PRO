
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ProbabilityGauge from '../../components/ui/ProbabilityGauge';
import { getDailyPicks } from '../../services/geminiService';
import type { DailyPick } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const DailyPicksPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [picks, setPicks] = useState<DailyPick[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [engineStatus, setEngineStatus] = useState<'ai' | 'stat'>('ai');

  const fetchPicks = async () => {
    setIsLoading(true);
    try {
        const data = await getDailyPicks(language);
        setPicks(data);
        // On détecte si on est en mode secours (via les données mockées)
        if (data[0]?.match.includes("Manchester City")) setEngineStatus('stat');
    } catch (e) {
        console.error("DailyPicks Critical Failover");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks();
  }, [language]);

  const activeTab = 'all'; 

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className={`w-2 h-2 rounded-full animate-pulse ${engineStatus === 'ai' ? 'bg-green-500' : 'bg-orange-500'}`}></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                NEXTWIN ENGINE V6.0 - {engineStatus === 'ai' ? 'IA QUANTUM ACTIVE' : 'ALGO STATISTIQUE ACTIF'}
            </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-8">
          <Spinner />
          <div className="text-center space-y-2">
            <p className="text-orange-400 font-bold animate-pulse uppercase tracking-widest text-sm">Synchronisation des modèles prédictifs...</p>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {picks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      )}
    </div>
  );
};

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const probValue = parseInt(pick.probability?.replace('%', '') || "0", 10);
  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all rounded-[2rem] p-8 bg-[#1C1C2B] group">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {pick.matchDate} - {pick.matchTime}
        </span>
        <span className="text-2xl">{pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 leading-tight group-hover:text-orange-400 transition-colors">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-6 uppercase tracking-wide">{pick.betType}</p>
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Confiance Algo</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-800/60">
        <p className="text-gray-400 text-xs italic font-medium leading-relaxed">"{pick.analysis}"</p>
      </div>
    </Card>
  );
};

export default DailyPicksPage;
