
import React from 'react';
import Card from '../../components/ui/Card';
import { useLanguage } from '../../hooks/useLanguage';

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center text-white mb-10">{t('privacy_title')}</h1>
      <Card className="text-gray-300 space-y-4">
        <p>{t('privacy_intro')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_collection_title')}</h2>
        <p>{t('privacy_collection_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_usage_title')}</h2>
        <p>{t('privacy_usage_content')}</p>
        <ul className="list-disc list-inside pl-4">
          <li>{t('privacy_usage_item1')}</li>
          <li>{t('privacy_usage_item2')}</li>
          <li>{t('privacy_usage_item3')}</li>
          <li>{t('privacy_usage_item4')}</li>
          <li>{t('privacy_usage_item5')}</li>
        </ul>

        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_sharing_title')}</h2>
        <p>{t('privacy_sharing_content')}</p>

        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_retention_title')}</h2>
        <p>{t('privacy_retention_content')}</p>

        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_rights_title')}</h2>
        <p>{t('privacy_rights_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_cookies_title')}</h2>
        <p>{t('privacy_cookies_content')}</p>
        
        <h2 className="text-xl font-semibold text-white pt-4">{t('privacy_updates_title')}</h2>
        <p>{t('privacy_updates_content')}</p>
      </Card>
    </div>
  );
};

export default PrivacyPolicyPage;
