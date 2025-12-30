
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
    <div className="max-w-6xl mx-auto py-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
          {t('daily_picks_subtitle')}
        </p>
      </div>

      {/* Sport Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
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
        <div className="flex flex-col items-center justify-center py-24 gap-8">
          <Spinner />
          <p className="text-orange-400 font-bold text-lg animate-pulse tracking-wide">{t('daily_picks_loading')}</p>
        </div>
      ) : filteredPicks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPicks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-24 text-gray-500 rounded-[2rem] border-gray-800/40">
          <p className="text-lg font-medium">{t('daily_picks_empty')}</p>
        </Card>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: string }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all duration-300 border-2 text-sm uppercase tracking-widest ${
      active 
        ? 'bg-orange-500 border-orange-500 text-white shadow-2xl shadow-orange-500/30 scale-105' 
        : 'bg-[#1C1C2B] border-gray-800 text-gray-500 hover:text-white hover:border-gray-700'
    }`}
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </button>
);

const PickCard: React.FC<{ pick: DailyPick }> = ({ pick }) => {
  const { t } = useLanguage();
  const probValue = parseInt(pick.probability, 10) || 0;

  return (
    <Card className="flex flex-col h-full border-gray-800/40 hover:border-orange-500/30 transition-all group overflow-hidden rounded-[2rem] p-8">
      {/* Date & Time Header */}
      <div className="bg-gray-900/80 -mx-8 -mt-8 px-6 py-3 mb-8 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <span className="text-sm">🕒</span>
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
        <p className="text-gray-400 text-sm italic leading-relaxed font-medium">
          "{pick.analysis}"
        </p>
      </div>
    </Card>
  );
};

export default DailyPicksPage;
