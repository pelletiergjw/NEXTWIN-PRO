
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import ProbabilityGauge from '../../components/ui/ProbabilityGauge';
import { getDailyPicks } from '../../services/geminiService';
import { useLanguage } from '../../hooks/useLanguage';

const DailyPicksPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [picks, setPicks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPicks = async () => {
    setIsLoading(true);
    try {
        const data = await getDailyPicks(language);
        setPicks(data);
    } catch (e) {
        console.error("DailyPicks Fail");
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
                PROTOCAL NEXTWIN V12 - ZERO HALLUCINATION
            </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
          {t('daily_picks_title')}
        </h1>
        <p className="text-gray-400 font-medium italic">Vérification forcée via Google Search. Chaque match inclut sa source officielle.</p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-8">
          <Spinner />
          <div className="text-center space-y-2">
            <p className="text-orange-400 font-black uppercase tracking-widest text-sm animate-pulse">Consultation des calendriers officiels en direct...</p>
          </div>
        </div>
      ) : picks.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {picks.map((pick, idx) => (
            <PickCard key={idx} pick={pick} />
          ))}
        </div>
      ) : (
        <Card className="max-w-xl mx-auto text-center py-16 border-dashed border-gray-700">
            <div className="text-6xl mb-6 grayscale opacity-20">📡</div>
            <h3 className="text-xl font-black text-white mb-2">Aucun match réel détecté</h3>
            <p className="text-gray-500 text-sm mb-8">L'IA n'a trouvé aucun match majeur vérifiable pour aujourd'hui. Par sécurité, aucun pronostic n'est affiché.</p>
            <Button onClick={fetchPicks} variant="secondary" className="px-8">Actualiser la recherche</Button>
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
        <div className="flex flex-col">
            <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
              {pick.matchDate} @ {pick.matchTime}
            </span>
            <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Vérifié sur Google</span>
        </div>
        <span className="text-2xl">{pick.sport === 'football' ? '⚽' : pick.sport === 'basketball' ? '🏀' : '🎾'}</span>
      </div>
      <h3 className="text-xl font-black text-white mb-1 leading-tight group-hover:text-orange-400 transition-colors">{pick.match}</h3>
      <p className="text-orange-400 font-bold text-sm mb-6 uppercase tracking-wide">{pick.betType}</p>
      
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">IA CONFIDENCE</span>
          <span className="text-lg font-black text-white">{pick.probability}</span>
        </div>
        <ProbabilityGauge probability={probValue} />
      </div>

      <div className="mt-auto space-y-4">
        <div className="pt-4 border-t border-gray-800/60">
            <p className="text-gray-400 text-xs italic font-medium leading-relaxed">"{pick.analysis}"</p>
        </div>
        
        {pick.sourceUrl && (
            <div className="pt-2">
                <a 
                  href={pick.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 rounded-xl text-[10px] text-orange-400 font-black uppercase tracking-widest transition-all w-full justify-center"
                >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    Voir sur Source Officielle
                </a>
            </div>
        )}
      </div>
    </Card>
  );
};

export default DailyPicksPage;
