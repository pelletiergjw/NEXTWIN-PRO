
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const LegalNoticePage: React.FC = () => {
    const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-10">{t('legal_notice_title')}</h1>
      <Card className="text-gray-300 space-y-4 whitespace-pre-line">
        <h2 className="text-xl font-semibold text-white">{t('ln_editor_title')}</h2>
        <p>{t('ln_editor_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('ln_hosting_title')}</h2>
        <p>{t('ln_hosting_content')}</p>

        <h2 className="text-xl font-semibold text-white pt-4">{t('ln_ip_title')}</h2>
        <p>{t('ln_ip_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('ln_liability_title')}</h2>
        <p>{t('ln_liability_content')}</p>
      </Card>
    </div>
  );
};

export default LegalNoticePage;
