
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
    <div>
      <h1 className="text-4xl font-bold text-center text-white mb-8">{t('history_title')}</h1>
      {history.length === 0 ? (
        <Card className="text-center text-gray-400 py-12">
          <p>{t('history_empty')}</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {history.map((item) => (
            <Card key={item.id} className="transition-all hover:border-orange-500">
              <div className="grid md:grid-cols-4 gap-4 items-center">
                <div>
                  <p className="text-sm text-gray-400">{item.timestamp}</p>
                  <p className="font-bold text-white text-lg">{item.request.match}</p>
                  <p className="text-gray-300">{item.request.betType}</p>
                </div>
                <div className="text-center">
                   <p className="text-sm text-gray-400">{t('history_probability')}</p>
                   <p className="text-2xl font-bold text-white">{item.response.successProbability}</p>
                </div>
                 <div className="text-center">
                   <p className="text-sm text-gray-400">{t('history_risk')}</p>
                   <p className={`text-lg font-bold px-3 py-1 rounded-full inline-block border ${riskColor[item.response.riskAssessment]}`}>
                        {item.response.riskAssessment}
                   </p>
                </div>
                <div className="text-gray-300 italic text-center md:text-left">
                  "{item.response.aiOpinion}"
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
