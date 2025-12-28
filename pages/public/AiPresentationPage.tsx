
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const AiPresentationPage: React.FC = () => {
    const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto text-lg">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('ai_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-16">
        {t('ai_subtitle')}
      </p>

      <Card className="space-y-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
          {t('ai_gemini_title')}
        </h2>
        <p className="text-gray-300">
          {t('ai_gemini_desc')}
        </p>

        <h2 className="text-3xl font-bold text-white pt-4">{t('ai_what_title')}</h2>
        <p className="text-gray-300">
          {t('ai_what_desc')}
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-2 pl-4">
          <li>{t('ai_what_item1')}</li>
          <li>{t('ai_what_item2')}</li>
          <li>{t('ai_what_item3')}</li>
          <li>{t('ai_what_item4')}</li>
          <li>{t('ai_what_item5')}</li>
        </ul>

        <h2 className="text-3xl font-bold text-white pt-4">{t('ai_accessible_title')}</h2>
        <p className="text-gray-300">
          {t('ai_accessible_desc1')}
        </p>
         <p className="text-gray-300 pt-4">
          {t('ai_accessible_desc2')}
        </p>
      </Card>
    </div>
  );
};

export default AiPresentationPage;
