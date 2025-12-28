
import React from 'react';
import Card from '../../components/ui/Card';
import { SPORTS } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';

const SportsAndBetsPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('sports_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-16">
        {t('sports_subtitle')}
      </p>

      <div className="space-y-12">
        {SPORTS.map((sport) => (
          <Card key={sport.key}>
            <div className="flex items-center mb-6">
              <span className="text-5xl mr-4">{sport.icon}</span>
              <h2 className="text-4xl font-bold text-white">{t(sport.labelKey as any)}</h2>
            </div>
            <p className="text-gray-400 mb-6">
              {t('sports_intro_text')} {t(sport.labelKey as any).toLowerCase()}.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sport.betTypes.map((betType) => (
                <div key={betType.key} className="bg-gray-900 p-3 rounded-lg text-center">
                  <p className="text-gray-200">{t(betType.labelKey as any)}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SportsAndBetsPage;
