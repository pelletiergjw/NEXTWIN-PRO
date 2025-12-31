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
  const [activeTab, setActiveTab] = useState<'football' | 'basketball' | 'tennis'>('football');

  useEffect(() => {
    const fetchPicks = async () => {
      setIsLoading(true);
      try {
        const data = await getDailyPicks(language);
        setPicks(data);
      } catch (error) {
        console.error("Failed to fetch picks", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPicks();
  }, [language]);

  const filteredPicks = picks.filter(p => p.sport === activeTab);

  // Completé le composant avec les sélections filtrées par sport
  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('daily_picks_subtitle')}
        </p>
        
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {(['football', 'basketball', 'tennis'] as const).map((sport) => (
            <button
              key={sport}
              onClick={() => setActiveTab(sport)}
              className={`px-8 py-3 rounded-2xl font-bold text-[12px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                activeTab === sport 
                  ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 scale-105' 
                  : 'bg-gray-900/50 text-gray-500 hover:text-white border-gray-800'
              }`}
            >
              {sport === 'football' ? '⚽' : sport === 'basketball' ? '🏀' : '🎾'} {t(`daily_picks_${sport}`)}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-6">
          <Spinner />
          <p className="text-orange-400 font-bold uppercase tracking-widest text-sm animate-pulse">
            {t('daily_picks_loading')}
          </p>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPicks.map((pick, index) => (
            <Card key={index} className="flex flex-col h-full border-gray-800 bg-[#1C1C2B] hover:border-orange-500/30 transition-all group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    pick.confidence === 'Very High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  }`}>
                    {pick.confidence} Confidence
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">{pick.matchDate} • {pick.matchTime}</span>
                </div>
                
                <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-orange-400 transition-colors">
                  {pick.match}
                </h3>
                
                <p className="text-orange-400 font-black text-sm uppercase tracking-wide mb-6">
                  {pick.betType}
                </p>

                <div className="space-y-4 mb-6">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{t('daily_picks_probability')}</p>
                      <p className="text-2xl font-black text-white">{pick.probability}</p>
                   </div>
                   <ProbabilityGauge probability={parseInt(pick.probability)} />
                </div>

                <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                  <p className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2">{t('daily_picks_analysis')}</p>
                  <p className="text-gray-400 text-sm leading-relaxed italic line-clamp-3">"{pick.analysis}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-20 text-center opacity-40">
          <p className="text-gray-400 font-bold uppercase tracking-widest">{t('daily_picks_empty')}</p>
        </Card>
      )}
    </div>
  );
};

export default DailyPicksPage;