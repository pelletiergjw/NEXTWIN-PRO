
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const TermsOfSalePage: React.FC = () => {
    const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-10">{t('tos_title')}</h1>
      <Card className="text-gray-300 space-y-4">
        <h2 className="text-xl font-semibold text-white">{t('tos_article1_title')}</h2>
        <p>{t('tos_article1_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('tos_article2_title')}</h2>
        <p>{t('tos_article2_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('tos_article3_title')}</h2>
        <p>{t('tos_article3_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('tos_article4_title')}</h2>
        <p>{t('tos_article4_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('tos_article5_title')}</h2>
        <p>{t('tos_article5_content')}</p>
      </Card>
    </div>
  );
};

export default TermsOfSalePage;
