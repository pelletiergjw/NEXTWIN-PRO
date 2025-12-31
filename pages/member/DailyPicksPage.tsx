
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
            setError("L'IA n'a pas pu identifier de matchs à forte probabilité pour le moment.");
        }
    } catch (e: any) {
        console.error("Error Detail:", e);
        if (e.message?.includes("API_KEY_NOT_FOUND")) {
            setError("CONFIGURATION REQUISE : Le site n'est pas déployé via GitHub Actions ou la clé API est absente des secrets.");
        } else if (e.message?.includes("403") || e.message?.includes("API key not valid")) {
            setError("CLÉ INVALIDE : Votre clé API Google Gemini est rejetée. Vérifiez Google AI Studio.");
        } else {
            setError(`ERREUR RÉSEAU : ${e.message || "Connexion à Google Gemini impossible."}`);
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
          <div className="text-center space-y-2">
            <p className="text-orange-400 font-bold animate-pulse uppercase tracking-widest text-sm">Calcul des opportunités temps réel</p>
            <p className="text-gray-600 text-[10px] font-black uppercase tracking-[0.4em]">NextWin Engine v4.0</p>
          </div>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredPicks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <div className="max-w-lg mx-auto">
            <Card className="text-center py-16 px-8 rounded-[2.5rem] border-red-500/20 bg-[#151522] shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl">📡</div>
                <h3 className="text-white font-black text-xl mb-4">Moteur en attente</h3>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-8">
                    <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest leading-relaxed">
                        {error}
                    </p>
                </div>
                <Button onClick={fetchPicks} className="w-full py-4 uppercase font-black tracking-widest shadow-xl shadow-orange-500/20">
                    Redémarrer le moteur
                </Button>
                {error?.includes("CONFIGURATION REQUISE") && (
                    <p className="mt-6 text-[9px] text-gray-500 font-bold uppercase tracking-widest">
                        Aide : Assurez-vous d'avoir activé "GitHub Actions" dans vos réglages Pages.
                    </p>
                )}
            </Card>
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border-2 text-xs uppercase tracking-widest ${active ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-[#1C1C2B] border-gray-800 text-gray-500 hover:text-white'}`}>
    <span>{icon}</span> <span>{label}</span>
  </button>
);

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const probValue = parseInt(pick.probability?.replace('%', '') || "0", 10);
  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all rounded-[2rem] p-8 bg-[#1C1C2B] group">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {pick.matchDate} - {pick.matchTime}
        </span>
        <span className="text-2xl group-hover:scale-110 transition-transform">{pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 leading-tight group-hover:text-orange-400 transition-colors">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-6 uppercase tracking-wide">{pick.betType}</p>
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Confiance IA</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>
      <div className="mt-auto pt-4 border-t border-gray-800/60">
        <p className="text-gray-400 text-xs italic font-medium leading-relaxed line-clamp-2">"{pick.analysis}"</p>
      </div>
    </Card>
  );
};

export default DailyPicksPage;
