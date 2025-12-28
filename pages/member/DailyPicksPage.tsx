
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
      const data = await getDailyPicks(language);
      setPicks(data);
      setIsLoading(false);
    };
    fetchPicks();
  }, [language]);

  const filteredPicks = picks.filter(p => p.sport === activeTab);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
          {t('daily_picks_title')}
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          {t('daily_picks_subtitle')}
        </p>
      </div>

      {/* Sport Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <TabButton 
          active={activeTab === 'football'} 
          onClick={() => setActiveTab('football')} 
          label={t('daily_picks_football')} 
          icon="⚽" 
        />
        <TabButton 
          active={activeTab === 'basketball'} 
          onClick={() => setActiveTab('basketball')} 
          label={t('daily_picks_basketball')} 
          icon="🏀" 
        />
        <TabButton 
          active={activeTab === 'tennis'} 
          onClick={() => setActiveTab('tennis')} 
          label={t('daily_picks_tennis')} 
          icon="🎾" 
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-6">
          <Spinner />
          <p className="text-orange-400 font-medium animate-pulse">{t('daily_picks_loading')}</p>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPicks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-20 text-gray-500">
          <p>{t('daily_picks_empty')}</p>
        </Card>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
      active 
        ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105' 
        : 'bg-[#1C1C2B] border-gray-800 text-gray-400 hover:border-gray-700'
    }`}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const { t } = useLanguage();
  const probValue = parseInt(pick.probability, 10) || 0;

  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all group overflow-hidden">
      {/* Date & Time Header */}
      <div className="bg-gray-900/80 -mx-6 -mt-6 px-4 py-2 mb-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-xs">🕒</span>
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{pick.matchDate}</span>
        </div>
        <span className="text-[10px] font-black text-orange-400">{pick.matchTime}</span>
      </div>

      <div className="flex justify-between items-start mb-4">
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${pick.confidence === 'Very High' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
          {pick.confidence}
        </span>
        <span className="text-xl group-hover:rotate-12 transition-transform">
          {pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}
        </span>
      </div>

      <h3 className="text-xl font-black text-white mb-1 leading-tight">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-4 uppercase tracking-wide">{pick.betType}</p>
      
      <div className="mb-6">
        <div className="flex justify-between items-end mb-1">
          <span className="text-[10px] uppercase font-bold text-gray-500">{t('daily_picks_probability')}</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>

      <div className="mt-auto pt-4 border-t border-gray-800/50">
        <h4 className="text-[10px] uppercase font-bold text-gray-500 mb-2">{t('daily_picks_analysis')}</h4>
        <p className="text-gray-400 text-xs italic leading-relaxed">
          "{pick.analysis}"
        </p>
      </div>
    </Card>
  );
};

export default DailyPicksPage;
