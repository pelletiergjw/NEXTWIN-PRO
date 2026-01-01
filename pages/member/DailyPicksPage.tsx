
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

  const fetchPicks = async () => {
    setIsLoading(true);
    try {
        const data = await getDailyPicks(language);
        setPicks(data);
    } catch (e) {
        console.error("Fetch Error");
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPicks();
  }, [language]);

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-3 px-4 py-1.5 mb-6 bg-orange-500/10 border border-orange-500/20 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
                NEXTWIN ENGINE V10 - GROUNDED DATA
            </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
        <p className="text-gray-400 font-medium">Pronostics basés sur des calendriers et blessures vérifiés en temps réel.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-8">
          <Spinner />
          <div className="text-center space-y-2">
            <p className="text-orange-400 font-bold animate-pulse uppercase tracking-widest text-sm">Synchronisation avec les calendriers officiels...</p>
          </div>
        </div>
      ) : picks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {picks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <Card className="max-w-xl mx-auto text-center py-16 border-dashed border-gray-700">
            <div className="text-6xl mb-6 opacity-20">📡</div>
            <h3 className="text-xl font-black text-white mb-2">Aucun match réel trouvé</h3>
            <p className="text-gray-500 text-sm mb-8">L'IA n'a trouvé aucun match majeur aujourd'hui ou votre clé API est mal configurée. Aucun match fictif ne sera affiché.</p>
            <Button onClick={fetchPicks} variant="secondary" className="px-8">Relancer la recherche</Button>
        </Card>
      )}
    </div>
  );
};

const PickCard: React.FC<{ pick: any }> = ({ pick }) => {
  const probValue = parseInt(pick.probability?.replace('%', '') || "0", 10);
  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all rounded-[2rem] p-8 bg-[#1C1C2B] group shadow-xl">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {pick.matchDate} - {pick.matchTime}
        </span>
        <span className="text-2xl">{pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 leading-tight">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-6 uppercase tracking-wide">{pick.betType}</p>
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Confiance Algo</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>
      <div className="mt-auto space-y-4">
        <div className="pt-4 border-t border-gray-800/60">
            <p className="text-gray-400 text-xs italic font-medium leading-relaxed">"{pick.analysis}"</p>
        </div>
        {pick.sources && pick.sources.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
                {pick.sources.map((url: string, i: number) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[8px] text-orange-500/60 hover:text-orange-400 underline truncate max-w-[120px]">
                        Source officielle {i+1}
                    </a>
                ))}
            </div>
        )}
      </div>
    </Card>
  );
};

export default DailyPicksPage;
