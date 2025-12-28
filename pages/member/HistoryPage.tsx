
import React, { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';
import type { AnalysisResult } from '../../types';
import { useLanguage } from '../../hooks/useLanguage';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const { t } = useLanguage();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem('nextwin_history') || '[]');
    setHistory(storedHistory);
  }, []);

  const riskColor = {
    Low: 'bg-green-500/20 text-green-300 border-green-500',
    Medium: 'bg-yellow-500/20 text-yellow-300 border-yellow-500',
    High: 'bg-red-500/20 text-red-300 border-red-500',
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('history_title' as any)}</h1>
      {history.length === 0 ? (
        <Card className="text-center text-gray-400 py-12">
          <p>{t('history_empty' as any)}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id} className="transition-all hover:border-orange-500/50 group">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.request.sport === 'Football' ? '⚽' : item.request.sport === 'Tennis' ? '🎾' : '🏀'}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{item.timestamp}</p>
                      <h3 className="font-black text-white text-xl">{item.request.match}</h3>
                      <p className="text-orange-400 text-sm font-semibold">{item.request.betType}</p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="text-center px-4">
                       <p className="text-[10px] text-gray-500 uppercase font-bold">{t('history_probability' as any)}</p>
                       <p className="text-xl font-black text-white">{item.response.successProbability}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${riskColor[item.response.riskAssessment]}`}>
                        {item.response.riskAssessment}
                    </div>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 italic">
                        "{item.response.aiOpinion}"
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {item.response.sources && item.response.sources.length > 0 && (
                        <>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Sources consultées</p>
                            <div className="flex flex-wrap gap-1">
                                {item.response.sources.slice(0, 3).map((s, i) => (
                                    <span key={i} className="text-[9px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700 truncate max-w-full">
                                        {s.title}
                                    </span>
                                ))}
                                {item.response.sources.length > 3 && <span className="text-[9px] text-gray-600">+{item.response.sources.length - 3}</span>}
                            </div>
                        </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
