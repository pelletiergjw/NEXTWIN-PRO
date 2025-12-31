
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
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'football' | 'basketball' | 'tennis'>('all');

  const fetchPicks = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const data = await getDailyPicks(language);
        if (data && data.length > 0) {
            setPicks(data);
        } else {
            setError("Aucun match trouvé par l'IA pour le moment.");
        }
    } catch (e: any) {
        console.error("Gemini Error:", e);
        if (e.message.includes("API_KEY_MISSING")) {
            setError("La clé API n'est pas configurée dans GitHub Secrets.");
        } else if (e.message.includes("API key not valid")) {
            setError("La clé API configurée est invalide ou expirée.");
        } else {
            setError(`Erreur Google : ${e.message}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks();
  }, [language]);

  const filteredPicks = activeTab === 'all' ? picks : picks.filter(p => p.sport.toLowerCase() === activeTab);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-1.5 mb-6 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">9 SÉLECTIONS EXCLUSIVES IA</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
      </div>

      <div className="flex flex-wrap justify-center gap-2 mb-12">
        <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="Tous" icon="📊" />
        <TabButton active={activeTab === 'football'} onClick={() => setActiveTab('football')} label={t('daily_picks_football')} icon="⚽" />
        <TabButton active={activeTab === 'basketball'} onClick={() => setActiveTab('basketball')} label={t('daily_picks_basketball')} icon="🏀" />
        <TabButton active={activeTab === 'tennis'} onClick={() => setActiveTab('tennis')} label={t('daily_picks_tennis')} icon="🎾" />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-8">
          <Spinner />
          <p className="text-orange-400 font-bold animate-pulse">{t('daily_picks_loading')}</p>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredPicks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
            <Card className="text-center py-16 px-8 rounded-[2.5rem] border-red-500/20 bg-red-500/5">
                <div className="text-6xl mb-6">⚠️</div>
                <h3 className="text-white font-black text-xl mb-4">Erreur de Connexion</h3>
                <p className="text-xs text-red-400 font-bold mb-8 uppercase tracking-widest">{error}</p>
                <Button onClick={fetchPicks} className="w-full">RÉESSAYER</Button>
            </Card>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 text-xs uppercase tracking-widest ${active ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-[#1C1C2B] border-gray-800 text-gray-500 hover:text-white'}`}>
    <span>{icon}</span> <span>{label}</span>
  </button>
);

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const probValue = parseInt(pick.probability?.replace('%', '') || "0", 10);
  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all rounded-[2rem] p-8">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400">
          {pick.matchDate} - {pick.matchTime}
        </span>
        <span className="text-2xl">{pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 leading-tight">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-6 uppercase">{pick.betType}</p>
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-bold text-gray-500">Probabilité</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>
      <p className="text-gray-400 text-xs italic mt-auto pt-4 border-t border-gray-800">"{pick.analysis}"</p>
    </Card>
  );
};

export default DailyPicksPage;
