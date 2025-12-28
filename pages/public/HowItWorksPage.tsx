
import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../hooks/useLanguage';

const Step: React.FC<{ number: number, title: string, description: string }> = ({ number, title, description }) => (
    <div className="flex items-start gap-6">
        <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center text-3xl font-bold text-white">
            {number}
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-lg">{description}</p>
        </div>
    </div>
);

const HowItWorksPage: React.FC = () => {
    const { t } = useLanguage();
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-5xl font-bold text-center text-white mb-6">{t('howitworks_title')}</h1>
      <p className="text-xl text-center text-gray-300 mb-16">
        {t('howitworks_subtitle')}
      </p>
      
      <div className="space-y-12">
        <Step 
            number={1} 
            title={t('howitworks_step1_title')} 
            description={t('howitworks_step1_desc')}
        />
        <Step 
            number={2} 
            title={t('howitworks_step2_title')}
            description={t('howitworks_step2_desc')}
        />
        <Step 
            number={3} 
            title={t('howitworks_step3_title')}
            description={t('howitworks_step3_desc')}
        />
        <Step 
            number={4} 
            title={t('howitworks_step4_title')}
            description={t('howitworks_step4_desc')}
        />
      </div>

      <div className="text-center mt-20">
        <Card className="bg-[#1C1C2B]">
            <h2 className="text-3xl font-bold text-white mb-4">{t('howitworks_cta_title')}</h2>
            <p className="text-gray-300 mb-6">{t('howitworks_cta_subtitle')}</p>
            <Link to="/signup">
                <Button className="px-8 py-3 text-lg">{t('howitworks_cta_button')}</Button>
            </Link>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorksPage;
