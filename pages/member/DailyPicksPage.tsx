
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
            setError("L'IA n'a pas renvoyé de résultats. Veuillez réessayer dans quelques instants.");
        }
    } catch (e: any) {
        console.error("Fetch Error:", e);
        if (e.message === "API_KEY_INVALID") {
            setError("CONFIG_ERROR : La clé API est manquante ou invalide dans vos Secrets GitHub.");
        } else {
            setError("Erreur de connexion : Impossible de joindre le serveur IA (Vérifiez votre clé API).");
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
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('daily_picks_subtitle')}
        </p>
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
          <div className="text-center space-y-2">
            <p className="text-orange-400 font-bold text-lg animate-pulse tracking-wide">{t('daily_picks_loading')}</p>
            <p className="text-gray-600 text-[10px] uppercase font-black tracking-widest">Analyse en temps réel via Google Search...</p>
          </div>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredPicks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
            <Card className="text-center py-16 px-8 text-gray-500 rounded-[2.5rem] border-gray-800/40 bg-[#1C1C2B] shadow-2xl">
                <div className="text-6xl mb-6 opacity-40 grayscale animate-bounce">📡</div>
                <h3 className="text-white font-black text-xl mb-4">Moteur en attente</h3>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8">
                    <p className="text-xs text-red-400 leading-relaxed font-medium">{error}</p>
                </div>
                <Button onClick={fetchPicks} className="w-full py-4 text-xs font-black uppercase tracking-widest">
                    RECHARGER LE MOTEUR
                </Button>
            </Card>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 border-2 text-xs uppercase tracking-widest ${
      active ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20' : 'bg-[#1C1C2B] border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
    }`}
  >
    <span className="text-sm">{icon}</span>
    <span>{label}</span>
  </button>
);

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const { t } = useLanguage();
  const probValue = parseInt(pick.probability?.replace('%', '') || "0", 10);

  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all group overflow-hidden rounded-[2rem] p-8">
      <div className="bg-gray-900/80 -mx-8 -mt-8 px-6 py-3 mb-8 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <span className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em]">{pick.matchDate}</span>
        </div>
        <span className="text-[11px] font-black text-orange-400 tracking-widest">{pick.matchTime}</span>
      </div>

      <div className="flex justify-between items-start mb-6">
        <span className={`px-3 py-1 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] ${pick.confidence === 'Very High' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
          {pick.confidence}
        </span>
        <span className="text-2xl group-hover:rotate-12 transition-transform">
          {pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}
        </span>
      </div>

      <h3 className="text-2xl font-black text-white mb-2 leading-tight tracking-tight">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-base mb-6 uppercase tracking-wide">{pick.betType}</p>
      
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[11px] uppercase font-bold text-gray-500 tracking-[0.2em]">{t('daily_picks_probability')}</span>
          <span className="text-xl font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>

      <div className="mt-auto pt-6 border-t border-gray-800/50">
        <h4 className="text-[11px] uppercase font-bold text-gray-500 mb-3 tracking-[0.2em]">{t('daily_picks_analysis')}</h4>
        <p className="text-gray-400 text-sm italic leading-relaxed font-medium">"{pick.analysis}"</p>
      </div>
    </Card>
  );
};

export default DailyPicksPage;
